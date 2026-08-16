import { describe, expect, test } from "bun:test";

import { titleFromNotionPage } from "./activity-from-notion";

describe("titleFromNotionPage", () => {
  test("reads a Notion title property", () => {
    const page = {
      object: "page",
      created_time: "2026-08-16T00:00:00.000Z",
      properties: {
        Name: {
          type: "title",
          title: [{ plain_text: "Hello stack" }],
        },
      },
    };

    expect(titleFromNotionPage(page)).toBe("Hello stack");
  });

  test("falls back to Untitled for incomplete pages", () => {
    expect(titleFromNotionPage(null)).toBe("Untitled");
    expect(titleFromNotionPage({ object: "page" })).toBe("Untitled");
  });
});
