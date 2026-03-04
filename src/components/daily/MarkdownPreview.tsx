"use client";

import ReactMarkdown from "react-markdown";

interface MarkdownPreviewProps {
  content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-stone dark:prose-invert max-w-none text-sm leading-relaxed">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
