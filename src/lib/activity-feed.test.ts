import { describe, expect, test } from "bun:test";

import { GET as getFeed } from "@/app/api/activity/feed/route";
import { GET as getTail } from "@/app/api/activity/tail/route";
import { GET as getTotals } from "@/app/api/activity/totals/route";
import {
  buildActivityFeed,
  createMemoryActivityStore,
  ingestActivityEvent,
  isActivityFeedPayload,
} from "@/lib/activity";
import { ACTIVITY_FEED_CACHE_HEADERS, activityCachedJson } from "@/lib/activity-feed";
import {
  ACTIVITY_FEED_CACHE_CONTROL,
  ACTIVITY_FEED_DEDUPING_MS,
  ACTIVITY_FEED_POLL_MS,
  ACTIVITY_STREAM_MAXLEN,
  activityFeedRefreshInterval,
} from "@/lib/activity-shared";

describe("activity feed cache headers", () => {
  test("uses a 2s shared max-age and 30s stale-while-revalidate", () => {
    expect(ACTIVITY_FEED_CACHE_CONTROL).toBe("public, s-maxage=2, stale-while-revalidate=30");
    expect(ACTIVITY_FEED_CACHE_HEADERS["Cache-Control"]).toBe(ACTIVITY_FEED_CACHE_CONTROL);
    expect(ACTIVITY_FEED_CACHE_HEADERS["CDN-Cache-Control"]).toBe(ACTIVITY_FEED_CACHE_CONTROL);
  });

  test("JSON responses set both cache headers and no Vary or Set-Cookie", async () => {
    const res = activityCachedJson({ events: [], count: 0 });
    expect(res.headers.get("Cache-Control")).toBe(ACTIVITY_FEED_CACHE_CONTROL);
    expect(res.headers.get("CDN-Cache-Control")).toBe(ACTIVITY_FEED_CACHE_CONTROL);
    expect(res.headers.get("Vary")).toBeNull();
    expect(res.headers.get("Set-Cookie")).toBeNull();
    expect(await res.json()).toEqual({ events: [], count: 0 });
  });
});

describe("activity feed payload", () => {
  test("is { events, count } and empty when the store is missing", async () => {
    const empty = await buildActivityFeed(null);
    expect(empty).toEqual({ events: [], count: 0 });
    expect(isActivityFeedPayload(empty)).toBe(true);
    expect(isActivityFeedPayload({ events: [] })).toBe(false);
    expect(isActivityFeedPayload({ count: 0 })).toBe(false);
  });

  test("reads tail and lifetime count from the store", async () => {
    const store = createMemoryActivityStore();
    await ingestActivityEvent(
      {
        source: "brios",
        type: "like",
        speed: "event",
        summary: "Someone liked a page",
        visibility: "public",
        idempotency_key: "feed:like:1",
      },
      store,
    );

    const payload = await buildActivityFeed(store);
    expect(isActivityFeedPayload(payload)).toBe(true);
    expect(payload.events).toHaveLength(1);
    expect(payload.events[0]).toEqual(
      expect.objectContaining({ type: "like", summary: "Someone liked a page" }),
    );
    expect(payload.count).toBe(1);
  });

  test("requests ACTIVITY_STREAM_MAXLEN events from the store", async () => {
    const store = createMemoryActivityStore();
    const requested: number[] = [];
    const getTail = store.getTail.bind(store);
    store.getTail = async (limit) => {
      requested.push(limit);
      return getTail(limit);
    };

    for (let i = 0; i < 101; i++) {
      await ingestActivityEvent(
        {
          source: "brios",
          type: "like",
          speed: "event",
          summary: `Someone liked page ${i}`,
          visibility: "public",
          idempotency_key: `feed:like:window:${i}`,
        },
        store,
      );
    }

    const payload = await buildActivityFeed(store);
    expect(requested).toEqual([ACTIVITY_STREAM_MAXLEN]);
    expect(payload.events).toHaveLength(101);
    expect(payload.count).toBe(101);
  });
});

describe("activityFeedRefreshInterval", () => {
  test("polls every 2s when visible and pauses when hidden", () => {
    expect(ACTIVITY_FEED_POLL_MS).toBe(2000);
    expect(ACTIVITY_FEED_DEDUPING_MS).toBeGreaterThanOrEqual(1000);
    expect(activityFeedRefreshInterval("visible")).toBe(ACTIVITY_FEED_POLL_MS);
    expect(activityFeedRefreshInterval("hidden")).toBe(0);
    expect(activityFeedRefreshInterval("prerender")).toBe(0);
    expect(activityFeedRefreshInterval(undefined)).toBe(0);
  });
});

describe("activity poll routes", () => {
  test("GET /api/activity/feed returns the combined payload and cache headers", async () => {
    const res = await getFeed();
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe(ACTIVITY_FEED_CACHE_CONTROL);
    expect(res.headers.get("CDN-Cache-Control")).toBe(ACTIVITY_FEED_CACHE_CONTROL);
    expect(res.headers.get("Vary")).toBeNull();
    const body = await res.json();
    expect(isActivityFeedPayload(body)).toBe(true);
  });

  test("legacy tail and totals routes keep their payloads and stay cacheable", async () => {
    const tail = await getTail();
    const totals = await getTotals();
    expect(tail.headers.get("Cache-Control")).toBe(ACTIVITY_FEED_CACHE_CONTROL);
    expect(totals.headers.get("CDN-Cache-Control")).toBe(ACTIVITY_FEED_CACHE_CONTROL);
    expect(await tail.json()).toEqual({ events: expect.any(Array) });
    expect(await totals.json()).toEqual({ count: expect.any(Number) });
  });
});
