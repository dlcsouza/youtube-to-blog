"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";
import { FileText, Code, Eye } from "lucide-react";

interface ResultDisplayProps {
  result: {
    title: string;
    content: string;
    markdown: string;
  };
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const [viewMode, setViewMode] = useState<"preview" | "markdown">("preview");

  return (
    <div className="mt-8 border rounded-xl bg-card shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-lg">{result.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                viewMode === "preview"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setViewMode("markdown")}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                viewMode === "markdown"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
            >
              <Code className="w-4 h-4" />
              Markdown
            </button>
          </div>
          <CopyButton text={result.markdown} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        {viewMode === "preview" ? (
          <article className="prose max-w-none">
            <MarkdownPreview content={result.content} />
          </article>
        ) : (
          <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
            {result.markdown}
          </pre>
        )}
      </div>
    </div>
  );
}

/**
 * Simple markdown preview component
 * For production, consider using react-markdown or similar
 */
function MarkdownPreview({ content }: { content: string }) {
  // Basic markdown to HTML conversion
  const html = content
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-medium mb-2 mt-4">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold mb-3 mt-6">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-4 mt-8">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 italic my-4">$1</blockquote>')
    // Code blocks
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
    // Single newlines to <br>
    .replace(/\n/g, '<br/>');

  return (
    <div 
      className="space-y-4"
      dangerouslySetInnerHTML={{ 
        __html: `<p class="mb-4 leading-relaxed">${html}</p>` 
      }} 
    />
  );
}
