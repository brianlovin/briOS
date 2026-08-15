import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import type { ProcessedBlock, RichTextContent } from "@/lib/notion";

import { renderBlocks } from "./renderBlocks";

function text(content: string): RichTextContent {
  return {
    type: "text",
    text: { content, link: undefined },
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

function html(blocks: ProcessedBlock[]): string {
  return renderToStaticMarkup(<div>{renderBlocks(blocks)}</div>);
}

describe("renderBlocks", () => {
  test("renders image from url, not content[0]", () => {
    const markup = html([{ id: "img-1", type: "image", url: "https://cdn.example/photo.jpg" }]);

    expect(markup).toContain('src="https://cdn.example/photo.jpg"');
    expect(markup).toContain("<img");
  });

  test("renders to_do checked state", () => {
    const checked = html([{ id: "todo-1", type: "to_do", content: [text("Done")], checked: true }]);
    const unchecked = html([
      { id: "todo-2", type: "to_do", content: [text("Open")], checked: false },
    ]);

    expect(checked).toContain("Done");
    expect(checked).toMatch(/checked/);
    expect(unchecked).toContain("Open");
    expect(unchecked).not.toMatch(/checked/);
  });

  test("renders video from videoUrl", () => {
    const markup = html([{ id: "vid-1", type: "video", videoUrl: "https://cdn.example/clip.mp4" }]);

    expect(markup).toContain("<video");
    expect(markup).toContain('src="https://cdn.example/clip.mp4"');
  });
});
