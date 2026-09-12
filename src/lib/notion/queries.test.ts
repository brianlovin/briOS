import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";

import * as cache from "./cache";
import { notion } from "./client";
import { getGoodWebsitesDatabaseItems, getGoodWebsitesDatabaseItemsForRss } from "./queries";
import type { PageResponse } from "./types";

function richTextItem(content: string) {
  return {
    type: "text" as const,
    text: { content, link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default" as const,
    },
    plain_text: content,
    href: null,
  };
}

function goodWebsitePage({
  id,
  name,
  url,
  createdTime = "2024-01-01T00:00:00.000Z",
}: {
  id: string;
  name: string;
  url?: string;
  createdTime?: string;
}): PageResponse {
  return {
    object: "page",
    id,
    created_time: createdTime,
    icon: null,
    properties: {
      Name: { id: "title", type: "title", title: [richTextItem(name)] },
      URL: { id: "url", type: "url", url: url ?? null },
      "Created time": {
        id: "created",
        type: "created_time",
        created_time: createdTime,
      },
    },
  } as PageResponse;
}

function queryPage(
  results: PageResponse[],
  { hasMore = false, nextCursor = null }: { hasMore?: boolean; nextCursor?: string | null } = {},
) {
  return {
    object: "list" as const,
    results,
    has_more: hasMore,
    next_cursor: nextCursor,
  };
}

function stubGoodWebsitesFetch() {
  process.env.NOTION_GOOD_WEBSITES_DATABASE_ID = "db-good-websites";
  spyOn(cache, "cachedNotionQuery").mockImplementation(async (_key, fetcher) => fetcher());
  spyOn(notion.databases, "retrieve").mockResolvedValue({
    data_sources: [{ id: "ds-good-websites" }],
  } as never);
}

afterEach(() => {
  mock.restore();
});

describe("getGoodWebsitesDatabaseItems", () => {
  test("follows start_cursor until has_more is false and keeps Name sort", async () => {
    stubGoodWebsitesFetch();
    const query = spyOn(notion.dataSources, "query").mockImplementation(async (args) => {
      if (!args.start_cursor) {
        return queryPage(
          [goodWebsitePage({ id: "1", name: "Linear", url: "https://linear.app" })],
          {
            hasMore: true,
            nextCursor: "cursor-page-2",
          },
        ) as never;
      }

      expect(args.start_cursor).toBe("cursor-page-2");
      return queryPage([
        goodWebsitePage({ id: "2", name: "SF Compute", url: "https://sfcompute.com" }),
      ]) as never;
    });

    const items = await getGoodWebsitesDatabaseItems();

    expect(items.map((item) => ({ id: item.id, name: item.name, url: item.url }))).toEqual([
      { id: "1", name: "Linear", url: "https://linear.app" },
      { id: "2", name: "SF Compute", url: "https://sfcompute.com" },
    ]);
    expect(query).toHaveBeenCalledTimes(2);
    expect(query.mock.calls[0]?.[0]).toEqual({
      data_source_id: "ds-good-websites",
      page_size: 100,
      sorts: [{ property: "Name", direction: "ascending" }],
    });
    expect(query.mock.calls[1]?.[0]).toEqual({
      data_source_id: "ds-good-websites",
      page_size: 100,
      start_cursor: "cursor-page-2",
      sorts: [{ property: "Name", direction: "ascending" }],
    });
  });

  test("returns a single page when Notion is already exhausted", async () => {
    stubGoodWebsitesFetch();
    const query = spyOn(notion.dataSources, "query").mockResolvedValue(
      queryPage([goodWebsitePage({ id: "1", name: "Linear", url: "https://linear.app" })]) as never,
    );

    const items = await getGoodWebsitesDatabaseItems();

    expect(items).toHaveLength(1);
    expect(items[0]?.name).toBe("Linear");
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0]?.[0]).not.toHaveProperty("start_cursor");
  });

  test("drops partial rows while still concatenating later pages", async () => {
    stubGoodWebsitesFetch();
    spyOn(notion.dataSources, "query").mockImplementation(async (args) => {
      if (!args.start_cursor) {
        return queryPage(
          [
            { object: "page", id: "partial" } as PageResponse,
            goodWebsitePage({ id: "1", name: "A" }),
          ],
          { hasMore: true, nextCursor: "next" },
        ) as never;
      }

      return queryPage([goodWebsitePage({ id: "2", name: "SF Computer" })]) as never;
    });

    const items = await getGoodWebsitesDatabaseItems();

    expect(items.map((item) => item.id)).toEqual(["1", "2"]);
  });
});

describe("getGoodWebsitesDatabaseItemsForRss", () => {
  test("aggregates every page and keeps Created time descending sort", async () => {
    stubGoodWebsitesFetch();
    const query = spyOn(notion.dataSources, "query").mockImplementation(async (args) => {
      if (!args.start_cursor) {
        return queryPage(
          [
            goodWebsitePage({
              id: "new",
              name: "Newer site",
              url: "https://new.example",
              createdTime: "2026-01-02T00:00:00.000Z",
            }),
          ],
          { hasMore: true, nextCursor: "rss-page-2" },
        ) as never;
      }

      expect(args.start_cursor).toBe("rss-page-2");
      return queryPage([
        goodWebsitePage({
          id: "old",
          name: "Older site",
          url: "https://old.example",
          createdTime: "2025-01-01T00:00:00.000Z",
        }),
      ]) as never;
    });

    const items = await getGoodWebsitesDatabaseItemsForRss();

    expect(
      items.map((item) => ({
        id: item.id,
        name: item.name,
        url: item.url,
        createdTime: item.createdTime,
      })),
    ).toEqual([
      {
        id: "new",
        name: "Newer site",
        url: "https://new.example",
        createdTime: "2026-01-02T00:00:00.000Z",
      },
      {
        id: "old",
        name: "Older site",
        url: "https://old.example",
        createdTime: "2025-01-01T00:00:00.000Z",
      },
    ]);
    expect(query).toHaveBeenCalledTimes(2);
    expect(query.mock.calls[0]?.[0]).toMatchObject({
      data_source_id: "ds-good-websites",
      page_size: 100,
      sorts: [{ property: "Created time", direction: "descending" }],
    });
    expect(query.mock.calls[1]?.[0]).toMatchObject({
      start_cursor: "rss-page-2",
      page_size: 100,
    });
  });
});
