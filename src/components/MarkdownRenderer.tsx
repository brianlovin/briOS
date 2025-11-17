"use client";

import React from "react";

interface MarkdownRendererProps {
  children: string;
}

export function MarkdownRenderer({ children }: MarkdownRendererProps) {
  // Simple markdown rendering for basic text formatting
  // Handles line breaks, links, bold, and italic
  const renderMarkdown = (text: string) => {
    // Replace \r\n with proper line breaks
    const paragraphs = text.split(/\r\n\r\n|\n\n/);

    return paragraphs.map((paragraph, pIndex) => {
      // Process inline markdown within each paragraph
      const processedContent = paragraph.split(/\r\n|\n/).map((line, lIndex) => {
        // Process links: [text](url)
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts: (string | React.ReactElement)[] = [];
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(line)) !== null) {
          // Add text before the link
          if (match.index > lastIndex) {
            parts.push(line.slice(lastIndex, match.index));
          }
          // Add the link
          parts.push(
            <a
              key={`link-${pIndex}-${lIndex}-${match.index}`}
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="link-body"
            >
              {match[1]}
            </a>,
          );
          lastIndex = linkRegex.lastIndex;
        }

        // Add remaining text
        if (lastIndex < line.length) {
          parts.push(line.slice(lastIndex));
        }

        return (
          <span key={`line-${pIndex}-${lIndex}`}>
            {parts.length > 0 ? parts : line}
            {lIndex < paragraph.split(/\r\n|\n/).length - 1 && <br />}
          </span>
        );
      });

      return (
        <p key={`paragraph-${pIndex}`} className="mb-4 last:mb-0">
          {processedContent}
        </p>
      );
    });
  };

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {renderMarkdown(children)}
    </div>
  );
}
