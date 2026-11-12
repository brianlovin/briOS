import { describe, expect, test } from "bun:test";

import { CONTENT_CACHE_VERSION, isPlaceholderNotionBuild, notionContentCacheKey } from "./cache";

describe("notionContentCacheKey", () => {
  test("bumps processed content keys to v4", () => {
    expect(CONTENT_CACHE_VERSION).toBe("v4");
    expect(notionContentCacheKey(null, "page-1")).toBe("notion:content:v4:page-1");
    expect(notionContentCacheKey("writing", "page-1")).toBe("notion:writing:content:v4:page-1");
    expect(notionContentCacheKey("writing", "slug", "hello")).toBe(
      "notion:writing:content:v4:slug:hello",
    );
    expect(notionContentCacheKey("til", "shortid", "abc1234")).toBe(
      "notion:til:content:v4:shortid:abc1234",
    );
    expect(notionContentCacheKey("app-dissection", "instagram")).toBe(
      "notion:app-dissection:content:v4:instagram",
    );
  });
});

describe("isPlaceholderNotionBuild", () => {
  test("is true only for the CI placeholder Notion token", () => {
    const previous = process.env.NOTION_TOKEN;
    process.env.NOTION_TOKEN = "build-placeholder";
    expect(isPlaceholderNotionBuild()).toBe(true);
    process.env.NOTION_TOKEN = "secret_live_token";
    expect(isPlaceholderNotionBuild()).toBe(false);
    if (previous === undefined) {
      delete process.env.NOTION_TOKEN;
    } else {
      process.env.NOTION_TOKEN = previous;
    }
  });
});
