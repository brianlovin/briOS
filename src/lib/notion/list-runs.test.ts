import { describe, expect, test } from "bun:test";

import { groupListRuns } from "./list-runs";
import type { ProcessedBlock, RichTextContent } from "./types";

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

function bullet(id: string, label: string): ProcessedBlock {
  return { id, type: "bulleted_list_item", content: [text(label)] };
}

function numbered(id: string, label: string): ProcessedBlock {
  return { id, type: "numbered_list_item", content: [text(label)] };
}

describe("groupListRuns", () => {
  test("groups consecutive same-type list items and splits mixed runs", () => {
    const runs = groupListRuns([
      bullet("b1", "one"),
      bullet("b2", "two"),
      numbered("n1", "first"),
      numbered("n2", "second"),
      { id: "p1", type: "paragraph", content: [text("break")] },
      bullet("b3", "again"),
    ]);

    expect(runs.map((run) => run.kind + (run.kind === "list" ? `:${run.type}` : ""))).toEqual([
      "list:bulleted_list_item",
      "list:numbered_list_item",
      "block",
      "list:bulleted_list_item",
    ]);
    expect(runs[0].kind === "list" && runs[0].items.map((item) => item.id)).toEqual(["b1", "b2"]);
    expect(runs[1].kind === "list" && runs[1].items.map((item) => item.id)).toEqual(["n1", "n2"]);
  });
});
