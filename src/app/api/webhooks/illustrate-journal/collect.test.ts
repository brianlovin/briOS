import { describe, expect, test } from "bun:test";

import {
  captionPlainText,
  collectJournalImages,
  FIELD_NOTE_MARK,
  fieldNoteBlockUpdate,
  isFieldNoteCaption,
  MAX_IMAGES_PER_RUN,
  type MediaBlockLike,
} from "./collect";

function imageBlock(id: string, url: string, caption?: { plain_text: string }[]): MediaBlockLike {
  return {
    id,
    type: "image",
    image: {
      type: "external",
      external: { url },
      caption,
    },
  };
}

function videoBlock(id: string): MediaBlockLike {
  return {
    id,
    type: "video",
    video: { type: "external", external: { url: "https://vid.example/1.mp4" } },
  };
}

describe("collectJournalImages", () => {
  test("collects image blocks and ignores videos", () => {
    const { pending, skipped } = collectJournalImages([
      { id: "p1", type: "paragraph" },
      imageBlock("img-1", "https://img.example/1.jpg"),
      videoBlock("vid-1"),
      imageBlock("img-2", "https://img.example/2.jpg"),
    ]);

    expect(pending.map((item) => item.id)).toEqual(["img-1", "img-2"]);
    expect(skipped).toEqual([]);
  });

  test("skips images already marked as field-note", () => {
    const { pending, skipped } = collectJournalImages([
      imageBlock("fresh", "https://img.example/fresh.jpg"),
      imageBlock("done", "https://img.example/done.jpg", [{ plain_text: FIELD_NOTE_MARK }]),
    ]);

    expect(pending.map((item) => item.id)).toEqual(["fresh"]);
    expect(skipped.map((item) => item.id)).toEqual(["done"]);
  });

  test("caps pending images per run and reports the remainder", () => {
    const blocks = Array.from({ length: MAX_IMAGES_PER_RUN + 3 }, (_, index) =>
      imageBlock(`img-${index}`, `https://img.example/${index}.jpg`),
    );

    const { pending, remaining } = collectJournalImages(blocks);
    expect(pending).toHaveLength(MAX_IMAGES_PER_RUN);
    expect(remaining).toBe(3);
  });
});

describe("field-note caption idempotency", () => {
  test("reads plain_text and nested text.content", () => {
    expect(captionPlainText([{ plain_text: "field-note" }])).toBe("field-note");
    expect(captionPlainText([{ text: { content: "field-note" } }])).toBe("field-note");
    expect(isFieldNoteCaption([{ plain_text: "already field-note" }])).toBe(true);
    expect(isFieldNoteCaption([{ plain_text: "original photo" }])).toBe(false);
  });

  test("writes a field-note caption when replacing the block URL", () => {
    const media = collectJournalImages([imageBlock("img-1", "https://notion.example/old.jpg")])
      .pending[0];

    expect(fieldNoteBlockUpdate(media, "https://r2.example/poster.jpg")).toEqual({
      block_id: "img-1",
      image: {
        external: { url: "https://r2.example/poster.jpg" },
        caption: [{ type: "text", text: { content: FIELD_NOTE_MARK } }],
      },
    });
  });
});
