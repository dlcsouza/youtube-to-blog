import { NextRequest, NextResponse } from "next/server";
import { getTranscript, extractVideoId, getVideoInfo } from "@/lib/youtube";
import { generateBlogPost, AIProvider } from "@/lib/ai";
import { verifySession, markSessionUsed } from "@/lib/stripe";

export const maxDuration = 60; // Allow up to 60 seconds for API route

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, provider = "openai", sessionId } = body as {
      url: string;
      provider?: AIProvider;
      sessionId?: string;
    };

    // --- Payment verification ---
    if (!sessionId) {
      return NextResponse.json(
        { error: "Payment required. Please complete checkout first." },
        { status: 402 }
      );
    }

    const payment = await verifySession(sessionId);
    if (!payment.valid) {
      return NextResponse.json(
        { error: "Invalid or already used payment session." },
        { status: 402 }
      );
    }

    // Use the URL from the payment metadata if available (prevents tampering)
    const videoUrl = payment.videoUrl || url;

    if (!videoUrl) {
      return NextResponse.json(
        { error: "YouTube URL is required" },
        { status: 400 }
      );
    }

    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Get video info
    const videoInfo = await getVideoInfo(videoId);

    // Get transcript
    const transcript = await getTranscript(videoId);
    if (!transcript) {
      return NextResponse.json(
        { error: "Could not fetch transcript. Make sure the video has captions enabled." },
        { status: 400 }
      );
    }

    // Generate blog post using AI
    const aiProvider = (payment.provider as AIProvider) || provider;
    const blogPost = await generateBlogPost(
      transcript,
      videoInfo.title,
      aiProvider
    );

    // Mark the session as used so it can't be reused
    await markSessionUsed(sessionId);

    return NextResponse.json({
      title: blogPost.title,
      content: blogPost.content,
      markdown: blogPost.markdown,
      videoTitle: videoInfo.title,
      videoId,
    });
  } catch (error) {
    console.error("Conversion error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to convert video";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
