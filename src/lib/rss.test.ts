import { describe, expect, test } from "bun:test";

import { SITE_CONFIG } from "@/lib/metadata";
import { addRssItem, createRssFeed, rssErrorResponse, rssResponse } from "@/lib/rss";

describe("createRssFeed", () => {
  test("uses the static site OG image, not the removed /api/og route", () => {
    const feed = createRssFeed({
      title: "Writing",
      description: "Essays",
      path: "/writing",
    });
    const options = feed.options;

    expect(options.title).toBe(`${SITE_CONFIG.name} - Writing`);
    expect(options.id).toBe(`${SITE_CONFIG.url}/writing`);
    expect(options.image).toBe(`${SITE_CONFIG.url}/img/og.png`);
    expect(options.image).not.toContain("/api/og");
    expect(options.feedLinks?.rss).toBe(`${SITE_CONFIG.url}/writing/rss.xml`);
  });
});

describe("addRssItem", () => {
  test("defaults the author to the site author", () => {
    const feed = createRssFeed({
      title: "Writing",
      description: "Essays",
      path: "/writing",
    });
    const published = new Date("2026-01-01T00:00:00.000Z");

    addRssItem(feed, {
      title: "Hello",
      id: "hello",
      link: `${SITE_CONFIG.url}/writing/hello`,
      description: "A post",
      date: published,
    });

    expect(feed.items).toHaveLength(1);
    expect(feed.items[0]?.author).toEqual([
      { name: SITE_CONFIG.author.name, link: SITE_CONFIG.url },
    ]);
  });
});

describe("rssResponse", () => {
  test("returns RSS XML with the standard cache headers", async () => {
    const feed = createRssFeed({
      title: "Writing",
      description: "Essays",
      path: "/writing",
    });
    const response = rssResponse(feed);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/rss+xml; charset=utf-8");
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
    );

    const body = await response.text();
    expect(body).toContain("<rss");
    expect(body).toContain(`${SITE_CONFIG.url}/img/og.png`);
  });
});

describe("rssErrorResponse", () => {
  test("returns a 500 with a generic message", async () => {
    const error = console.error;
    console.error = () => {};

    try {
      const response = rssErrorResponse("Writing", new Error("boom"));

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Error generating RSS feed");
    } finally {
      console.error = error;
    }
  });
});
