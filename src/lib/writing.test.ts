import { describe, expect, test } from "bun:test";

import type { NotionWritingItem } from "@/lib/notion";
import { recentWritingLinks } from "@/lib/writing";

function post(overrides: Partial<NotionWritingItem> & Pick<NotionWritingItem, "id" | "title">) {
  return {
    slug: "",
    published: "2026-08-01",
    createdTime: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("recentWritingLinks", () => {
  test("lists the five most recent published titles and hrefs", () => {
    const links = recentWritingLinks([
      post({ id: "1", title: "How I'm Feeling About AI", shortId: "O7e1TFS" }),
      post({ id: "2", title: "Second Post", shortId: "abc1234" }),
      post({ id: "3", title: "Third Post", shortId: "def5678" }),
      post({ id: "4", title: "Fourth Post", shortId: "ghi9012" }),
      post({ id: "5", title: "Fifth Post", shortId: "jkl3456" }),
      post({ id: "6", title: "Sixth Post", shortId: "mno7890" }),
    ]);

    expect(links).toEqual([
      {
        id: "1",
        title: "How I'm Feeling About AI",
        href: "/writing/how-im-feeling-about-ai-O7e1TFS",
      },
      { id: "2", title: "Second Post", href: "/writing/second-post-abc1234" },
      { id: "3", title: "Third Post", href: "/writing/third-post-def5678" },
      { id: "4", title: "Fourth Post", href: "/writing/fourth-post-ghi9012" },
      { id: "5", title: "Fifth Post", href: "/writing/fifth-post-jkl3456" },
    ]);
  });

  test("omits posts that have no short id", () => {
    const links = recentWritingLinks([
      post({ id: "1", title: "Draft" }),
      post({ id: "2", title: "Published", shortId: "abc1234" }),
    ]);

    expect(links).toEqual([{ id: "2", title: "Published", href: "/writing/published-abc1234" }]);
  });
});
