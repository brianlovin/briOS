import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";

import { installAxiomMock } from "@/lib/axiom-test-utils";

const axiomMock = installAxiomMock();

import { GET } from "@/app/api/likes/sync/route";
import * as likesRedis from "@/lib/likes-redis";
import { notion } from "@/lib/notion/client";

const STACK_PAGE = "stack-page";
const TIPS_PAGE = "tips-page";

const pages: Record<string, unknown> = {
  [STACK_PAGE]: {
    object: "page",
    id: STACK_PAGE,
    in_trash: false,
    url: "",
    properties: { Likes: { type: "number", number: 1 } },
  },
  [TIPS_PAGE]: {
    object: "page",
    id: TIPS_PAGE,
    in_trash: false,
    url: "",
    properties: { Name: { type: "title", title: [] } },
  },
};

const previousToken = process.env.LIKES_SYNC_TOKEN;
let update: ReturnType<typeof spyOn>;

beforeEach(() => {
  axiomMock.enable();
  process.env.LIKES_SYNC_TOKEN = "sync-token";
  spyOn(likesRedis, "getAllLikeCounts").mockResolvedValue(
    new Map([
      [STACK_PAGE, 5],
      [TIPS_PAGE, 2],
    ]),
  );
  spyOn(notion.pages, "retrieve").mockImplementation(
    async ({ page_id }) => pages[page_id] as never,
  );
  update = spyOn(notion.pages, "update").mockResolvedValue({} as never);
});

afterEach(() => {
  axiomMock.disable();
  mock.restore();
  if (previousToken === undefined) delete process.env.LIKES_SYNC_TOKEN;
  else process.env.LIKES_SYNC_TOKEN = previousToken;
});

describe("GET /api/likes/sync", () => {
  test("syncs pages with a Likes column and skips Tips pages without logging an error", async () => {
    const res = await GET(new Request("https://brianlovin.com/api/likes/sync?token=sync-token"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({
      synced: 1,
      unchanged: 0,
      failed: 0,
      total: 2,
      skipped: { no_likes_property: [TIPS_PAGE] },
    });
    expect(body.errors).toBeUndefined();
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith({
      page_id: STACK_PAGE,
      properties: { Likes: { number: 5 } },
    });

    expect(axiomMock.events("log")).toEqual([]);
    expect(axiomMock.events("likes.synced")).toEqual([
      expect.objectContaining({ synced: 1, unchanged: 0, skipped: 1, failed: 0, total: 2 }),
    ]);
  });

  test("rejects requests without the sync token", async () => {
    const res = await GET(new Request("https://brianlovin.com/api/likes/sync?token=nope"));
    expect(res.status).toBe(401);
    expect(update).not.toHaveBeenCalled();
  });
});
