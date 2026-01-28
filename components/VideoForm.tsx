"use client";

import { useState } from "react";
import { Youtube, Loader2, Sparkles, CreditCard } from "lucide-react";

type AIProvider = "openai" | "anthropic";

interface VideoFormProps {
  onSubmit: (url: string, provider: AIProvider) => void;
  loading: boolean;
  /** When true, skip checkout and convert directly (e.g. after returning from Stripe) */
  directConvert?: boolean;
}

export function VideoForm({ onSubmit, loading, directConvert }: VideoFormProps) {
  const [url, setUrl] = useState("");
  const [provider, setProvider] = useState<AIProvider>("openai");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const isValidUrl = (input: string) => {
    const patterns = [
      /youtube\.com\/watch\?v=/,
      /youtu\.be\//,
      /youtube\.com\/embed\//,
      /^[a-zA-Z0-9_-]{11}$/, // Direct video ID
    ];
    return patterns.some((pattern) => pattern.test(input));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !isValidUrl(url)) return;

    if (directConvert) {
      onSubmit(url.trim(), provider);
      return;
    }

    // Redirect to Stripe Checkout
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), provider }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err instanceof Error ? err.message : "Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const isLoading = loading || checkoutLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* URL Input */}
      <div className="space-y-2">
        <label htmlFor="youtube-url" className="block text-sm font-medium">
          YouTube Video URL
        </label>
        <div className="relative">
          <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="youtube-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full pl-11 pr-4 py-3 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            disabled={isLoading}
          />
        </div>
        {url && !isValidUrl(url) && (
          <p className="text-sm text-destructive">
            Please enter a valid YouTube URL
          </p>
        )}
      </div>

      {/* AI Provider Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">AI Provider</label>
        <div className="flex gap-4">
          {(["openai", "anthropic"] as const).map((p) => (
            <label
              key={p}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-all ${
                provider === p
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="radio"
                name="provider"
                value={p}
                checked={provider === p}
                onChange={() => setProvider(p)}
                className="sr-only"
                disabled={isLoading}
              />
              <span className="capitalize font-medium">
                {p === "openai" ? "OpenAI GPT-4" : "Claude (Anthropic)"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !url.trim() || !isValidUrl(url)}
        className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Converting... This may take a minute
          </>
        ) : checkoutLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Redirecting to checkout...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay $5 &amp; Convert to Blog Post
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Secure payment powered by Stripe. $5 per conversion.
      </p>
    </form>
  );
}
