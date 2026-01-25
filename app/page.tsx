"use client";

import { useState } from "react";
import { VideoForm } from "@/components/VideoForm";
import { ResultDisplay } from "@/components/ResultDisplay";
import { Youtube, Sparkles, FileText, Zap } from "lucide-react";

type AIProvider = "openai" | "anthropic";

interface ConversionResult {
  title: string;
  content: string;
  markdown: string;
}

export default function Home() {
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async (url: string, provider: AIProvider) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, provider }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to convert video");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Youtube className="w-10 h-10 text-primary" />
          </div>
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <div className="p-3 bg-primary/10 rounded-xl">
            <FileText className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          YouTube to Blog
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Transform any YouTube video into a well-structured, SEO-optimized blog post using AI.
          Just paste the URL and let the magic happen.
        </p>
      </header>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Youtube, title: "Paste URL", desc: "Any YouTube video" },
          { icon: Zap, title: "AI Processing", desc: "OpenAI or Anthropic" },
          { icon: FileText, title: "Get Article", desc: "SEO-optimized post" },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-center gap-3 p-4 bg-card rounded-lg border shadow-sm"
          >
            <Icon className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <VideoForm onSubmit={handleConvert} loading={loading} />

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && <ResultDisplay result={result} />}

      {/* Footer */}
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>
          Built with Next.js, Tailwind CSS, and AI magic ✨
        </p>
        <p className="mt-1">
          <a
            href="https://github.com/dlcsouza/youtube-to-blog"
            className="hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
