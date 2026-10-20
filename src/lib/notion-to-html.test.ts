import { describe, expect, test } from "bun:test";

import type { ProcessedBlock, RichTextContent } from "@/lib/notion";
import { blocksToHtml, richTextToHtml } from "@/lib/notion-to-html";

function text(
  content: string,
  options: { link?: string; bold?: boolean; code?: boolean } = {},
): RichTextContent {
  return {
    type: "text",
    text: { content, link: options.link },
    annotations: {
      bold: options.bold ?? false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: options.code ?? false,
      color: "default",
    },
  };
}

describe("richTextToHtml", () => {
  test("escapes markup typed into Notion instead of emitting it", () => {
    const html = richTextToHtml([text("<script>alert(1)</script>")]);
    expect(html).toBe("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  test("makes site-relative links absolute", () => {
    expect(richTextToHtml([text("tips", { link: "/computer" })])).toBe(
      '<a href="https://brianlovin.com/computer">tips</a>',
    );
  });

  test("drops javascript: links but keeps the text", () => {
    expect(richTextToHtml([text("click", { link: "javascript:alert(1)" })])).toBe("click");
  });

  test("autolinks bare URLs like the site does", () => {
    expect(richTextToHtml([text("see https://example.com/a?b=1&c=2 now")])).toBe(
      'see <a href="https://example.com/a?b=1&amp;c=2">https://example.com/a?b=1&amp;c=2</a> now',
    );
  });

  test("keeps bold and inline code", () => {
    expect(
      richTextToHtml([text("Cmd", { bold: true }), text(" + "), text("K", { code: true })]),
    ).toBe("<strong>Cmd</strong> + <code>K</code>");
  });
});

describe("blocksToHtml", () => {
  test("groups list items and nests children", () => {
    const blocks: ProcessedBlock[] = [
      {
        id: "a",
        type: "numbered_list_item",
        content: [text("One")],
        children: [{ id: "a1", type: "bulleted_list_item", content: [text("Nested")] }],
      },
      { id: "b", type: "numbered_list_item", content: [text("Two")] },
    ];
    expect(blocksToHtml(blocks)).toBe("<ol><li>One<ul><li>Nested</li></ul></li><li>Two</li></ol>");
  });

  test("renders quotes and callouts as blockquotes", () => {
    const html = blocksToHtml([
      { id: "q", type: "quote", content: [text("A quote")] },
      { id: "c", type: "callout", content: [text("Heads up")] },
    ]);
    expect(html).toBe(
      "<blockquote><p>A quote</p></blockquote>\n<blockquote><p>Heads up</p></blockquote>",
    );
  });

  test("renders code as escaped preformatted text", () => {
    const html = blocksToHtml([
      { id: "code", type: "code", language: "html", content: [text("<div>&</div>")] },
    ]);
    expect(html).toContain("&lt;div&gt;&amp;&lt;/div&gt;</code></pre>");
    expect(html).not.toContain("<div>");
  });

  test("renders videos as links instead of players", () => {
    expect(blocksToHtml([{ id: "v", type: "video", videoUrl: "https://youtu.be/abc" }])).toBe(
      '<p><a href="https://youtu.be/abc">Watch the video</a></p>',
    );
  });

  test("renders tables with a header row", () => {
    const cell = (value: string) => [{ plain_text: value, href: null }] as never;
    const html = blocksToHtml([
      {
        id: "t",
        type: "table",
        tableWidth: 2,
        hasColumnHeader: true,
        hasRowHeader: false,
        tableRows: [
          { id: "r1", type: "table_row", cells: [cell("Key"), cell("Action")] },
          { id: "r2", type: "table_row", cells: [cell("⌘K"), cell("Search")] },
        ],
      },
    ]);
    expect(html).toBe(
      "<table><thead><tr><th>Key</th><th>Action</th></tr></thead><tbody><tr><td>⌘K</td><td>Search</td></tr></tbody></table>",
    );
  });

  test("never emits a CDATA terminator, even when the text contains one", () => {
    const html = blocksToHtml([{ id: "p", type: "paragraph", content: [text("a ]]> b")] }]);
    expect(html).not.toContain("]]>");
  });
});
