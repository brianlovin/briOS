import { describe, expect, test } from "bun:test";

import {
  createArticleJsonLd,
  createBreadcrumbJsonLd,
  createMetadata,
  createPersonJsonLd,
  createWebSiteJsonLd,
  SITE_CONFIG,
  truncateDescription,
} from "@/lib/metadata";

describe("createMetadata", () => {
  test("falls back to site defaults with no params", () => {
    const meta = createMetadata();
    expect(meta.title).toBeUndefined();
    expect(meta.description).toBe(SITE_CONFIG.description);
    // @ts-expect-error openGraph is a resolved object here
    expect(meta.openGraph.url).toBe(SITE_CONFIG.url);
    expect(meta.robots).toEqual({ index: true, follow: true });
  });

  test("builds the canonical url from the path", () => {
    const meta = createMetadata({ path: "/writing/hello" });
    // @ts-expect-error openGraph is a resolved object here
    expect(meta.openGraph.url).toBe(`${SITE_CONFIG.url}/writing/hello`);
  });

  test("applies title, description, and image overrides", () => {
    const meta = createMetadata({
      title: "Post",
      description: "desc",
      image: "/custom.png",
    });
    expect(meta.title).toBe("Post");
    expect(meta.description).toBe("desc");
    // @ts-expect-error twitter is a resolved object here
    expect(meta.twitter.images).toEqual(["/custom.png"]);
  });

  test("sets noindex when requested", () => {
    expect(createMetadata({ noIndex: true }).robots).toEqual({ index: false, follow: false });
  });

  test("adds article fields only for article type with a published time", () => {
    const article = createMetadata({
      type: "article",
      publishedTime: "2024-01-01",
    });
    // @ts-expect-error openGraph is a resolved object here
    expect(article.openGraph.type).toBe("article");
    // @ts-expect-error openGraph is a resolved object here
    expect(article.openGraph.publishedTime).toBe("2024-01-01");
    // @ts-expect-error openGraph is a resolved object here
    expect(article.openGraph.modifiedTime).toBe("2024-01-01");

    const website = createMetadata({ type: "website" });
    // @ts-expect-error openGraph is a resolved object here
    expect(website.openGraph.publishedTime).toBeUndefined();
  });
});

describe("json-ld helpers", () => {
  test("createWebSiteJsonLd describes the site", () => {
    const jsonLd = createWebSiteJsonLd();
    expect(jsonLd["@type"]).toBe("WebSite");
    expect(jsonLd.url).toBe(SITE_CONFIG.url);
  });

  test("createPersonJsonLd describes the author", () => {
    const jsonLd = createPersonJsonLd();
    expect(jsonLd["@type"]).toBe("Person");
    expect(jsonLd.name).toBe(SITE_CONFIG.author.name);
  });

  test("createArticleJsonLd defaults modifiedTime to publishedTime", () => {
    const jsonLd = createArticleJsonLd({
      title: "T",
      description: "D",
      path: "/writing/t",
      publishedTime: "2024-05-05",
    });
    expect(jsonLd.datePublished).toBe("2024-05-05");
    expect(jsonLd.dateModified).toBe("2024-05-05");
    expect(jsonLd.url).toBe(`${SITE_CONFIG.url}/writing/t`);
  });

  test("createBreadcrumbJsonLd numbers items starting at 1", () => {
    const jsonLd = createBreadcrumbJsonLd({
      items: [
        { name: "Home", url: "/" },
        { name: "Writing", url: "/writing" },
      ],
    });
    expect(jsonLd.itemListElement).toHaveLength(2);
    expect(jsonLd.itemListElement[0].position).toBe(1);
    expect(jsonLd.itemListElement[1].position).toBe(2);
    expect(jsonLd.itemListElement[1].name).toBe("Writing");
  });
});

describe("truncateDescription", () => {
  test("returns text unchanged when within the limit", () => {
    expect(truncateDescription("short text")).toBe("short text");
  });

  test("truncates at the last word boundary and appends an ellipsis", () => {
    const text = "the quick brown fox jumps over the lazy dog";
    const result = truncateDescription(text, 20);
    expect(result.endsWith("...")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(23);
    expect(result).toBe("the quick brown fox...");
  });

  test("appends an ellipsis without a space when there is no word boundary", () => {
    expect(truncateDescription("aaaaaaaaaa", 4)).toBe("aaaa...");
  });

  test("honors the default max length of 155", () => {
    const text = "a ".repeat(200);
    const result = truncateDescription(text);
    expect(result.length).toBeLessThanOrEqual(158);
    expect(result.endsWith("...")).toBe(true);
  });
});
