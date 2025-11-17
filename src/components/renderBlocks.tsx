import { ReactNode } from "react";

import { CodeBlock } from "@/components/CodeBlock";
import type { ProcessedBlock, RichTextContent, RichTextItemResponse } from "@/lib/notion";

// URL regex pattern to match http/https URLs
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

// Function to truncate long URLs in the middle
function truncateUrl(url: string, maxLength: number = 50): string {
  // Remove http:// or https:// for display
  const displayUrl = url.replace(/^https?:\/\//, "");

  if (displayUrl.length <= maxLength) return displayUrl;

  const start = Math.floor((maxLength - 3) / 2);
  const end = Math.ceil((maxLength - 3) / 2);

  return displayUrl.slice(0, start) + "..." + displayUrl.slice(-end);
}

function parseTextWithUrls(text: string): ReactNode[] {
  const parts = text.split(URL_REGEX);

  return parts.map((part, index) => {
    if (URL_REGEX.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="link-body"
          title={part}
        >
          {truncateUrl(part)}
        </a>
      );
    }
    return part;
  });
}

function renderRichText(richText: RichTextContent[]) {
  return richText.map((text, index) => {
    const content = text.text.content;
    const link = text.text.link;
    const annotations = text.annotations;

    let element: ReactNode;

    // If there's already a link annotation, use it as-is with word-break styling
    if (link) {
      element = (
        <a
          key={index}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="link-body"
          title={link}
        >
          {truncateUrl(content)}
        </a>
      );
    } else {
      // Parse the content for URLs and convert them to links
      element = <span key={index}>{parseTextWithUrls(content)}</span>;
    }

    // Apply text annotations
    if (annotations.bold) element = <strong key={index}>{element}</strong>;
    if (annotations.italic) element = <em key={index}>{element}</em>;
    if (annotations.strikethrough) element = <s key={index}>{element}</s>;
    if (annotations.underline) element = <u key={index}>{element}</u>;
    if (annotations.code)
      element = (
        <code className="bg-tertiary rounded px-1 py-0.5 text-sm" key={index}>
          {element}
        </code>
      );

    return element;
  });
}

export function renderBlocks(blocks: ProcessedBlock[], isPreview: boolean = false) {
  return blocks.map((block) => {
    if (isPreview) {
      // For preview mode, render all blocks as paragraphs with rich text
      if (block.type === "table" && block.tableRows) {
        return (
          <p key={block.id} className="text-secondary leading-[1.6]">
            [Table with {block.tableRows.length} rows]
          </p>
        );
      }
      return (
        <p key={block.id} className="text-secondary leading-[1.6]">
          {renderRichText(block.content)}
        </p>
      );
    }

    // Full rendering mode - handle table blocks with their children rows
    if (block.type === "table" && block.tableRows) {
      return (
        <div key={block.id} className="my-6 overflow-x-auto">
          <table className="border-secondary w-full border-collapse rounded-md border text-sm">
            <tbody>
              {block.tableRows.map((row, rowIndex) => {
                const cells = row.cells || [];
                const isHeaderRow = rowIndex === 0 && block.hasColumnHeader;

                return (
                  <tr key={row.id} className={isHeaderRow ? "bg-tertiary" : ""}>
                    {cells.map((cell, cellIndex) => {
                      const cellContent = cell.map(
                        (richText: RichTextItemResponse, index: number) => (
                          <span key={index}>{richText.plain_text}</span>
                        ),
                      );

                      const CellComponent = isHeaderRow ? "th" : "td";

                      return (
                        <CellComponent
                          key={cellIndex}
                          className={`border-secondary border px-3 py-2 text-left ${
                            isHeaderRow ? "text-primary font-semibold" : "text-secondary"
                          }`}
                        >
                          {cellContent.length > 0 ? cellContent : ""}
                        </CellComponent>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    switch (block.type) {
      case "quote":
        return (
          <blockquote
            key={block.id}
            className="border-primary text-tertiary border-l-3 pl-5 leading-[1.6]"
          >
            {renderRichText(block.content)}
          </blockquote>
        );
      case "paragraph":
        return (
          <p key={block.id} className="text-primary leading-[1.6]">
            {renderRichText(block.content)}
          </p>
        );
      case "heading_1":
        return (
          <h1 key={block.id} className="text-primary mt-6 font-sans text-3xl font-bold">
            {renderRichText(block.content)}
          </h1>
        );
      case "heading_2":
        return (
          <h2 key={block.id} className="text-primary mt-6 font-sans text-2xl font-bold">
            {renderRichText(block.content)}
          </h2>
        );
      case "heading_3":
        return (
          <h3 key={block.id} className="text-primary mt-5 font-sans text-xl font-bold">
            {renderRichText(block.content)}
          </h3>
        );
      case "bulleted_list_item":
        return (
          <li key={block.id} className="text-primary ml-3 list-disc leading-[1.6]">
            {renderRichText(block.content)}
          </li>
        );
      case "numbered_list_item":
        return (
          <li key={block.id} className="text-primary ml-4 list-decimal leading-[1.6]">
            {renderRichText(block.content)}
          </li>
        );
      case "to_do":
        return (
          <div key={block.id} className="text-secondary flex items-start gap-2 leading-[1.6]">
            <input type="checkbox" disabled className="mt-1" />
            <span>{renderRichText(block.content)}</span>
          </div>
        );
      case "toggle":
        return (
          <details key={block.id} className="text-secondary leading-[1.6]">
            <summary>{renderRichText(block.content)}</summary>
          </details>
        );
      case "code":
        return (
          <CodeBlock
            key={block.id}
            code={block.content.map((text) => text.text.content).join("")}
            language={block.language || "plaintext"}
          />
        );
      case "divider":
        return <hr key={block.id} className="border-primary my-6 border-t" />;
      case "image":
        return (
          <div key={block.id}>
            <img
              src={block.content[0].text.content}
              alt=""
              className="w-full rounded-lg"
              loading="lazy"
            />
          </div>
        );
      default:
        return null;
    }
  });
}
