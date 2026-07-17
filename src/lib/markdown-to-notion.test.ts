import { describe, expect, test } from "bun:test";

import { markdownToBlocks } from "@/lib/markdown-to-notion";

describe("markdownToBlocks", () => {
  test("converts a plain paragraph", async () => {
    const blocks = await markdownToBlocks("Hello world");
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("paragraph");
    expect(blocks[0].paragraph.rich_text[0].text.content).toBe("Hello world");
  });

  test("maps heading levels (h4-h6 collapse to heading_3)", async () => {
    const blocks = await markdownToBlocks(
      ["# One", "## Two", "### Three", "#### Four", "##### Five", "###### Six"].join("\n"),
    );
    expect(blocks.map((b) => b.type)).toEqual([
      "heading_1",
      "heading_2",
      "heading_3",
      "heading_3",
      "heading_3",
      "heading_3",
    ]);
    expect(blocks[0].heading_1.rich_text[0].text.content).toBe("One");
  });

  test("parses bulleted and numbered list items", async () => {
    const blocks = await markdownToBlocks(["- first", "* second", "1. third"].join("\n"));
    expect(blocks.map((b) => b.type)).toEqual([
      "bulleted_list_item",
      "bulleted_list_item",
      "numbered_list_item",
    ]);
    expect(blocks[2].numbered_list_item.rich_text[0].text.content).toBe("third");
  });

  test("parses blockquotes and dividers", async () => {
    const blocks = await markdownToBlocks(["> a quote", "", "---"].join("\n"));
    expect(blocks[0].type).toBe("quote");
    expect(blocks[0].quote.rich_text[0].text.content).toBe("a quote");
    expect(blocks[1].type).toBe("divider");
  });

  test("captures fenced code blocks with their language", async () => {
    const blocks = await markdownToBlocks(
      ["```ts", "const a = 1;", "const b = 2;", "```"].join("\n"),
    );
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("code");
    expect(blocks[0].code.language).toBe("ts");
    expect(blocks[0].code.rich_text[0].text.content).toBe("const a = 1;\nconst b = 2;");
  });

  test("defaults code language to 'plain text' when unspecified", async () => {
    const blocks = await markdownToBlocks(["```", "code", "```"].join("\n"));
    expect(blocks[0].code.language).toBe("plain text");
  });

  test("parses inline bold, italic, code, and links", async () => {
    const blocks = await markdownToBlocks(
      "This is **bold**, *italic*, `code`, and [a link](https://x.com).",
    );
    const rich = blocks[0].paragraph.rich_text;
    const bold = rich.find((r: { annotations: { bold: boolean } }) => r.annotations.bold);
    const italic = rich.find((r: { annotations: { italic: boolean } }) => r.annotations.italic);
    const code = rich.find((r: { annotations: { code: boolean } }) => r.annotations.code);
    const link = rich.find((r: { text: { link?: unknown } }) => r.text.link);
    expect(bold.text.content).toBe("bold");
    expect(italic.text.content).toBe("italic");
    expect(code.text.content).toBe("code");
    expect(link.text.link.url).toBe("https://x.com");
  });

  test("treats underscores as italic", async () => {
    const blocks = await markdownToBlocks("Some _emphasis_ here");
    const italic = blocks[0].paragraph.rich_text.find(
      (r: { annotations: { italic: boolean } }) => r.annotations.italic,
    );
    expect(italic.text.content).toBe("emphasis");
  });

  test("joins consecutive non-empty lines into one paragraph", async () => {
    const blocks = await markdownToBlocks(["line one", "line two", "", "second para"].join("\n"));
    expect(blocks).toHaveLength(2);
    expect(blocks[0].paragraph.rich_text[0].text.content).toBe("line one line two");
    expect(blocks[1].paragraph.rich_text[0].text.content).toBe("second para");
  });

  test("collects footnote definitions into a trailing divider and paragraphs", async () => {
    const blocks = await markdownToBlocks(
      ["Body text[^1]", "", "[^1]: The footnote body"].join("\n"),
    );
    const divider = blocks.find((b) => b.type === "divider");
    expect(divider).toBeDefined();
    const footnote = blocks[blocks.length - 1];
    expect(footnote.type).toBe("paragraph");
    expect(footnote.paragraph.rich_text[0].text.content).toBe("[1] The footnote body");
  });

  test("returns an empty array for empty input", async () => {
    expect(await markdownToBlocks("")).toEqual([]);
  });
});
