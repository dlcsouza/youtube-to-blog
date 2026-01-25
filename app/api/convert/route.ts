import { NextRequest, NextResponse } from "next/server";
import { getTranscript, extractVideoId, getVideoInfo } from "@/lib/youtube";
import { generateBlogPost, AIProvider } from "@/lib/ai";

export const maxDuration = 60; // Allow up to 60 seconds for API route

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, provider = "openai" } = body as {
      url: string;
      provider?: AIProvider;
    };

    if (!url) {
      return NextResponse.json(
        { error: "YouTube URL is required" },
        { status: 400 }
      );
    }

    // Extract video ID from URL
    const videoId = extractVideoId(url);
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
    const blogPost = await generateBlogPost(
      transcript,
      videoInfo.title,
      provider
    );

    return NextResponse.json({
      title: blogPost.title,
      content: blogPost.content,
      markdown: blogPost.markdown,
      videoTitle: videoInfo.title,
      videoId,
    });
  } catch (error) {
    console.error("Conversion error:", error);
    
    const message = error instanceof Error ? error.message : "Failed to convert video";
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
