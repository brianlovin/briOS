import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { describe, expect, test } from "bun:test";

import { processBlockFromResponse } from "./blocks";
import { extractPreviewText } from "./types";

function richTextItem(content: string): RichTextItemResponse {
  return {
    type: "text",
    text: { content, link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    },
    plain_text: content,
    href: null,
  };
}

function asBlock(block: object): BlockObjectResponse {
  return block as BlockObjectResponse;
}

describe("processBlockFromResponse", () => {
  test("maps a paragraph to rich text content", () => {
    const result = processBlockFromResponse(
      asBlock({
        id: "p1",
        type: "paragraph",
        paragraph: { rich_text: [richTextItem("Hello")] },
      }),
    );

    expect(result).toEqual({
      id: "p1",
      type: "paragraph",
      content: [
        {
          type: "text",
          text: { content: "Hello", link: undefined },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
        },
      ],
    });
  });

  test("keeps to_do checked state", () => {
    const checked = processBlockFromResponse(
      asBlock({
        id: "todo-1",
        type: "to_do",
        to_do: { rich_text: [richTextItem("Done")], checked: true },
      }),
    );
    const unchecked = processBlockFromResponse(
      asBlock({
        id: "todo-2",
        type: "to_do",
        to_do: { rich_text: [richTextItem("Open")], checked: false },
      }),
    );

    expect(checked).toMatchObject({ type: "to_do", checked: true });
    expect(unchecked).toMatchObject({ type: "to_do", checked: false });
    expect(checked).not.toHaveProperty("videoUrl");
    expect(checked).not.toHaveProperty("url");
  });

  test("maps image to a real url, not fake rich text", () => {
    const external = processBlockFromResponse(
      asBlock({
        id: "img-ext",
        type: "image",
        image: { type: "external", external: { url: "https://cdn.example/pic.jpg" } },
      }),
    );
    const file = processBlockFromResponse(
      asBlock({
        id: "img-file",
        type: "image",
        image: { type: "file", file: { url: "https://notion.so/file.png" } },
      }),
    );

    expect(external).toEqual({
      id: "img-ext",
      type: "image",
      url: "https://cdn.example/pic.jpg",
    });
    expect(file).toEqual({
      id: "img-file",
      type: "image",
      url: "https://notion.so/file.png",
    });
    expect(external).not.toHaveProperty("content");
  });

  test("maps video to videoUrl without content", () => {
    const result = processBlockFromResponse(
      asBlock({
        id: "vid-1",
        type: "video",
        video: { type: "external", external: { url: "https://cdn.example/clip.mp4" } },
      }),
    );

    expect(result).toEqual({
      id: "vid-1",
      type: "video",
      videoUrl: "https://cdn.example/clip.mp4",
    });
    expect(result).not.toHaveProperty("content");
  });

  test("maps code language and table metadata", () => {
    const code = processBlockFromResponse(
      asBlock({
        id: "code-1",
        type: "code",
        code: { rich_text: [richTextItem("const x = 1")], language: "typescript" },
      }),
    );
    const table = processBlockFromResponse(
      asBlock({
        id: "table-1",
        type: "table",
        table: { table_width: 3, has_column_header: true, has_row_header: false },
      }),
    );
    const row = processBlockFromResponse(
      asBlock({
        id: "row-1",
        type: "table_row",
        table_row: { cells: [[richTextItem("A")], [richTextItem("B")]] },
      }),
    );

    expect(code).toMatchObject({ type: "code", language: "typescript" });
    expect(table).toEqual({
      id: "table-1",
      type: "table",
      tableWidth: 3,
      hasColumnHeader: true,
      hasRowHeader: false,
    });
    expect(row).toMatchObject({
      type: "table_row",
      cells: [[richTextItem("A")], [richTextItem("B")]],
    });
    expect(table).not.toHaveProperty("content");
    expect(row).not.toHaveProperty("content");
  });

  test("maps divider without content and drops unsupported types", () => {
    expect(
      processBlockFromResponse(
        asBlock({
          id: "div-1",
          type: "divider",
          divider: {},
        }),
      ),
    ).toEqual({ id: "div-1", type: "divider" });

    expect(processBlockFromResponse(asBlock({ id: "bm-1", type: "bookmark", bookmark: {} }))).toBe(
      null,
    );
  });
});

describe("extractPreviewText", () => {
  test("joins paragraph text and ignores image/video blocks", () => {
    const text = extractPreviewText([
      {
        id: "p1",
        type: "paragraph",
        content: [
          {
            type: "text",
            text: { content: "Hello", link: undefined },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: "default",
            },
          },
        ],
      },
      { id: "img", type: "image", url: "https://cdn.example/x.jpg" },
      { id: "vid", type: "video", videoUrl: "https://cdn.example/x.mp4" },
      {
        id: "p2",
        type: "paragraph",
        content: [
          {
            type: "text",
            text: { content: "World", link: undefined },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: "default",
            },
          },
        ],
      },
    ]);

    expect(text).toBe("Hello\n\nWorld");
  });
});
