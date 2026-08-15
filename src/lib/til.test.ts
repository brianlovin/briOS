import { describe, expect, test } from "bun:test";

import type { NotionTilItem, NotionTilItemWithContent, ProcessedBlock } from "@/lib/notion";
import { hydrateTilEntries, type TilEntry } from "@/lib/til";

function item(id: string, title = id): NotionTilItem {
  return { id, title, published: "2026-01-01" };
}

function content(id: string, blocks: ProcessedBlock[]): NotionTilItemWithContent {
  return { ...item(id), blocks };
}

function paragraph(id: string, text: string): ProcessedBlock {
  return {
    id,
    type: "paragraph",
    content: [
      {
        type: "text",
        text: { content: text },
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
  };
}

describe("hydrateTilEntries", () => {
  test("attaches blocks from matching content records", () => {
    const blocks = [paragraph("b1", "hello")];
    const entries = hydrateTilEntries([item("a"), item("b")], [content("a", blocks), null]);

    expect(entries).toEqual([
      { ...item("a"), blocks },
      { ...item("b"), blocks: [] },
    ]);
  });

  test("matches content by id, not array position", () => {
    const blocks = [paragraph("b2", "later")];
    const entries = hydrateTilEntries([item("a"), item("b")], [null, content("b", blocks)]);

    expect(entries[0]?.blocks).toEqual([]);
    expect(entries[1]?.blocks).toEqual(blocks);
  });

  test("uses empty blocks when content is missing so the feed will not refetch", () => {
    const entries = hydrateTilEntries([item("a")], [null]);
    expect(entries[0]?.blocks).toEqual([]);
    expect("blocks" in (entries[0] as TilEntry)).toBe(true);
  });

  test("keeps list metadata from the feed record", () => {
    const listed = { id: "a", title: "List title", published: "2026-08-15", shortId: "abc1234" };
    const [entry] = hydrateTilEntries([listed], [content("a", [paragraph("b1", "body")])]);

    expect(entry).toMatchObject({
      id: "a",
      title: "List title",
      published: "2026-08-15",
      shortId: "abc1234",
    });
  });
});
