import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouTube to Blog - Convert Videos to SEO Blog Posts",
  description: "Transform any YouTube video into a well-structured, SEO-optimized blog post using AI. Support for OpenAI and Anthropic.",
  keywords: ["youtube", "blog", "converter", "ai", "seo", "content", "transcription"],
  authors: [{ name: "YouTube to Blog" }],
  openGraph: {
    title: "YouTube to Blog Converter",
    description: "Convert YouTube videos into SEO-optimized blog posts with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
          {children}
        </main>
      </body>
    </html>
  );
}
