import { YoutubeTranscript } from "youtube-transcript";

interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Get video transcript from YouTube
 */
export async function getTranscript(videoId: string): Promise<string | null> {
  try {
    const transcriptItems: TranscriptItem[] = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcriptItems || transcriptItems.length === 0) {
      return null;
    }

    // Combine all transcript pieces into one text
    const fullText = transcriptItems
      .map((item) => item.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return fullText;
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return null;
  }
}

/**
 * Get basic video information using oEmbed
 */
export async function getVideoInfo(videoId: string): Promise<{ title: string; author: string }> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch video info");
    }

    const data = await response.json();
    
    return {
      title: data.title || "Untitled Video",
      author: data.author_name || "Unknown Author",
    };
  } catch (error) {
    console.error("Error fetching video info:", error);
    return {
      title: "Untitled Video",
      author: "Unknown Author",
    };
  }
}
