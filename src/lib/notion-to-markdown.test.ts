import { describe, expect, test } from "bun:test";

import type { ProcessedBlock, RichTextContent } from "@/lib/notion";
import { blocksToMarkdown, richTextToMarkdown } from "@/lib/notion-to-markdown";

function text(content: string, extras: Partial<RichTextContent["text"]> = {}): RichTextContent {
  return {
    type: "text",
    text: { content, ...extras },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    },
  };
}

function paragraph(content: string, id = "p"): ProcessedBlock {
  return { id, type: "paragraph", content: [text(content)] };
}

describe("richTextToMarkdown", () => {
  test("keeps links and emphasis", () => {
    const linked = text("Campsite", { link: "https://campsite.com" });
    linked.annotations.bold = true;
    expect(richTextToMarkdown([linked])).toBe("[**Campsite**](https://campsite.com)");
  });
});

describe("blocksToMarkdown", () => {
  test("renders titles, lists, and quotes", () => {
    const blocks: ProcessedBlock[] = [
      { id: "h", type: "heading_2", content: [text("Notes")] },
      paragraph("Hello"),
      { id: "b1", type: "bulleted_list_item", content: [text("One")] },
      { id: "b2", type: "bulleted_list_item", content: [text("Two")] },
      { id: "q", type: "quote", content: [text("Quoted")] },
    ];

    const markdown = blocksToMarkdown(blocks);
    expect(markdown).toContain("## Notes");
    expect(markdown).toContain("Hello");
    expect(markdown).toContain("- One");
    expect(markdown).toContain("- Two");
    expect(markdown).toContain("> Quoted");
  });
});
