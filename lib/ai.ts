import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export type AIProvider = "openai" | "anthropic";

interface BlogPost {
  title: string;
  content: string;
  markdown: string;
}

const SYSTEM_PROMPT = `You are an expert content writer and SEO specialist. Your task is to transform video transcripts into engaging, well-structured blog posts.

Guidelines:
1. Create a compelling, SEO-friendly title
2. Write an engaging introduction that hooks the reader
3. Organize the content into clear sections with H2 and H3 headings
4. Use bullet points and numbered lists where appropriate
5. Include a conclusion with key takeaways
6. Maintain the original message and tone while improving readability
7. Add relevant transition phrases between sections
8. Keep paragraphs short and scannable
9. Include a meta description suggestion at the end

Output the blog post in clean Markdown format.`;

const USER_PROMPT = (transcript: string, videoTitle: string) => `
Transform this YouTube video transcript into a comprehensive, SEO-optimized blog post.

Original Video Title: "${videoTitle}"

Transcript:
${transcript}

Please create:
1. A new SEO-friendly title (can be different from the video title)
2. The full blog post in Markdown format
3. Include suggested meta description at the end

Focus on making the content valuable, readable, and well-organized for blog readers.
`;

/**
 * Generate blog post using OpenAI
 */
async function generateWithOpenAI(
  transcript: string,
  videoTitle: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenAI API key not configured. Set OPENAI_API_KEY in environment variables.");
  }

  const openai = new OpenAI({ apiKey });

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_PROMPT(transcript, videoTitle) },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return response.choices[0]?.message?.content || "";
}

/**
 * Generate blog post using Anthropic Claude
 */
async function generateWithAnthropic(
  transcript: string,
  videoTitle: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error("Anthropic API key not configured. Set ANTHROPIC_API_KEY in environment variables.");
  }

  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [
      { role: "user", content: USER_PROMPT(transcript, videoTitle) },
    ],
  });

  const content = response.content[0];
  if (content.type === "text") {
    return content.text;
  }
  
  return "";
}

/**
 * Parse the generated content into structured blog post
 */
function parseGeneratedContent(content: string): BlogPost {
  // Extract title from the first H1 or first line
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch 
    ? titleMatch[1].trim() 
    : content.split("\n")[0].replace(/^#+\s*/, "").trim();

  // Remove the title line from content for cleaner display
  const contentWithoutTitle = content
    .replace(/^#\s+.+$/m, "")
    .trim();

  return {
    title,
    content: contentWithoutTitle,
    markdown: content,
  };
}

/**
 * Generate blog post from transcript using specified AI provider
 */
export async function generateBlogPost(
  transcript: string,
  videoTitle: string,
  provider: AIProvider = "openai"
): Promise<BlogPost> {
  // Truncate transcript if too long (to stay within token limits)
  const maxTranscriptLength = 15000;
  const truncatedTranscript = transcript.length > maxTranscriptLength
    ? transcript.substring(0, maxTranscriptLength) + "..."
    : transcript;

  let generatedContent: string;

  if (provider === "anthropic") {
    generatedContent = await generateWithAnthropic(truncatedTranscript, videoTitle);
  } else {
    generatedContent = await generateWithOpenAI(truncatedTranscript, videoTitle);
  }

  return parseGeneratedContent(generatedContent);
}
