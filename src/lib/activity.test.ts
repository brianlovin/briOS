import { describe, expect, test } from "bun:test";

import {
  createMemoryActivityStore,
  findForbiddenPii,
  getActivityRow,
  getRequestCountry,
  ingestActivityEvent,
  likeMetaFromRequest,
  recordLike,
  recordVisit,
  shouldRecordVisit,
} from "@/lib/activity";
import { parseActivityStreamFields } from "@/lib/activity-redis";
import { ACTIVITY_STREAM_MAXLEN, ACTIVITY_VISIT_STREAM_MAX_PER_SEC } from "@/lib/activity-shared";

function baseEvent(overrides: Record<string, unknown> = {}) {
  return {
    source: "brios",
    type: "like",
    speed: "event" as const,
    summary: "Someone liked a page",
    visibility: "public" as const,
    idempotency_key: `test:${crypto.randomUUID()}`,
    ...overrides,
  };
}

describe("findForbiddenPii", () => {
  test("rejects an email in a nested value", () => {
    expect(findForbiddenPii({ summary: "hi a@b.com" })).toBe("summary: email");
  });

  test("rejects a raw IPv4 address", () => {
    expect(findForbiddenPii({ meta: { host: "203.0.113.10" } })).toBe("meta.host: ip");
  });

  test("rejects cookie, authorization, and cf-connecting-ip keys", () => {
    expect(findForbiddenPii({ cookie: "a=b" })).toBe("key:cookie");
    expect(findForbiddenPii({ authorization: "Bearer x" })).toBe("key:authorization");
    expect(findForbiddenPii({ "cf-connecting-ip": "1.1.1.1" })).toBe("key:cf-connecting-ip");
  });

  test("rejects cf-connecting-ip in a string value", () => {
    expect(findForbiddenPii({ note: "header cf-connecting-ip leaked" })).toContain(
      "cf-connecting-ip",
    );
  });

  test("allows a public like payload", () => {
    expect(
      findForbiddenPii({
        source: "brios",
        type: "like",
        summary: "Someone liked Stack",
        subject: { kind: "stack", label: "Stack", href: "/stack" },
        meta: { content_type: "stack", title: "Stack", href: "/stack" },
      }),
    ).toBeNull();
  });
});

describe("ingestActivityEvent", () => {
  test("rejects PII before writing", async () => {
    const store = createMemoryActivityStore();
    const result = await ingestActivityEvent(
      baseEvent({ summary: "email me at test@example.com" }),
      store,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("forbidden");
    expect(await store.getStreamLength()).toBe(0);
    expect(await store.getTotals()).toEqual([]);
  });

  test("idempotent retry does not double-count totals", async () => {
    const store = createMemoryActivityStore();
    const input = baseEvent({ idempotency_key: "like:page:1" });

    const first = await ingestActivityEvent(input, store);
    const second = await ingestActivityEvent({ ...input, id: crypto.randomUUID() }, store);

    expect(first.ok && !first.duplicate).toBe(true);
    expect(second.ok && second.duplicate).toBe(true);
    expect(await store.getStreamLength()).toBe(1);
    expect(await store.getTotals()).toEqual([
      expect.objectContaining({ source: "brios", type: "like", count: 1 }),
    ]);
  });

  test("unknown type is valid when summary is present", async () => {
    const store = createMemoryActivityStore();
    const result = await ingestActivityEvent(
      baseEvent({
        type: "weird_new_thing",
        summary: "A brand new event happened",
        subject: { kind: "page", label: "Hello", href: "/hello" },
      }),
      store,
    );

    expect(result.ok).toBe(true);
    const [event] = await store.getTail(10);
    expect(event?.type).toBe("weird_new_thing");
    expect(getActivityRow(event!)).toEqual({
      summary: "A brand new event happened",
      href: "/hello",
      label: "Hello",
    });
  });

  test("stream MAXLEN drops the oldest events", async () => {
    const store = createMemoryActivityStore({ maxLen: 5 });
    for (let i = 0; i < 12; i++) {
      await ingestActivityEvent(baseEvent({ summary: `event ${i}` }), store);
    }
    expect(await store.getStreamLength()).toBe(5);
    const tail = await store.getTail(10);
    expect(tail[0]?.summary).toBe("event 11");
    expect(tail[4]?.summary).toBe("event 7");
  });
});

describe("recordVisit", () => {
  test("does not ingest a visit for /activity", async () => {
    const store = createMemoryActivityStore();
    const result = await recordVisit({ path: "/activity", country: "US" }, store);
    expect(result).toEqual({ skipped: true, reason: "activity_path" });
    expect(await store.getStreamLength()).toBe(0);
    expect(await store.getTotals()).toEqual([]);
  });

  test("does not ingest a visit for /activity/nested", async () => {
    const store = createMemoryActivityStore();
    await recordVisit({ path: "/activity/nested" }, store);
    expect(await store.getTotals()).toEqual([]);
  });

  test("increments totals for every visit but samples stream inserts", async () => {
    const store = createMemoryActivityStore();
    const now = new Date("2026-08-16T12:00:00.000Z");
    const burst = ACTIVITY_VISIT_STREAM_MAX_PER_SEC + 25;

    for (let i = 0; i < burst; i++) {
      const result = await recordVisit({ path: "/writing", country: "DE" }, store, now);
      expect("ok" in result && result.ok).toBe(true);
    }

    const totals = await store.getTotals();
    expect(totals).toEqual([
      expect.objectContaining({ source: "brios", type: "visit", count: burst }),
    ]);
    expect(await store.getStreamLength()).toBe(ACTIVITY_VISIT_STREAM_MAX_PER_SEC);
    expect(await store.getStreamLength()).toBeLessThan(ACTIVITY_STREAM_MAXLEN);
  });
});

describe("recordLike", () => {
  test("does not record a like on /activity", async () => {
    const store = createMemoryActivityStore();
    const result = await recordLike(
      { title: "Activity", href: "/activity", content_type: "page" },
      store,
    );
    expect(result).toEqual({ skipped: true, reason: "activity_path" });
    expect(await store.getTotals()).toEqual([]);
  });

  test("writes a public like with subject + meta and no actor", async () => {
    const store = createMemoryActivityStore();
    const result = await recordLike(
      { title: "A post", href: "/writing/a-post", content_type: "writing", pageId: "abc" },
      store,
    );
    expect("ok" in result && result.ok).toBe(true);
    const [event] = await store.getTail(1);
    expect(event?.actor).toBeUndefined();
    expect(event?.subject).toEqual({
      kind: "writing",
      label: "A post",
      href: "/writing/a-post",
    });
    expect(event?.meta).toEqual({
      content_type: "writing",
      title: "A post",
      href: "/writing/a-post",
    });
  });
});

describe("parseActivityStreamFields", () => {
  const event = {
    v: 1,
    id: "evt_1",
    ts: "2026-08-16T00:00:00.000Z",
    received_at: "2026-08-16T00:00:00.000Z",
    source: "brios",
    type: "like",
    speed: "event" as const,
    summary: "Someone liked a page",
    visibility: "public" as const,
    idempotency_key: "k1",
  };

  test("parses Upstash auto-decoded stream fields", () => {
    expect(parseActivityStreamFields({ e: event })?.id).toBe("evt_1");
  });

  test("parses a JSON string payload", () => {
    expect(parseActivityStreamFields({ e: JSON.stringify(event) })?.summary).toBe(
      "Someone liked a page",
    );
  });
});

describe("getRequestCountry", () => {
  test("prefers Cloudflare country and never reads IP headers", () => {
    const headers = new Headers({
      "cf-ipcountry": "de",
      "x-vercel-ip-country": "US",
      "cf-connecting-ip": "203.0.113.10",
      "x-forwarded-for": "203.0.113.10",
    });
    expect(getRequestCountry(headers)).toBe("DE");
  });

  test("falls back to the Vercel country header", () => {
    expect(getRequestCountry(new Headers({ "x-vercel-ip-country": "jp" }))).toBe("JP");
  });

  test("ignores Cloudflare unknown / tor codes", () => {
    expect(getRequestCountry(new Headers({ "cf-ipcountry": "XX" }))).toBeUndefined();
    expect(getRequestCountry(new Headers({ "cf-ipcountry": "T1" }))).toBeUndefined();
  });
});

describe("shouldRecordVisit / likeMetaFromRequest", () => {
  test("skips the activity page and API routes", () => {
    expect(shouldRecordVisit("/activity")).toBe(false);
    expect(shouldRecordVisit("/writing")).toBe(true);
    expect(shouldRecordVisit("/api/activity/tail")).toBe(false);
  });

  test("builds like meta from the referer and skips /activity", () => {
    const writing = likeMetaFromRequest(
      new Request("https://brianlovin.com/api/likes/1", {
        headers: { referer: "https://brianlovin.com/writing/hello-world" },
      }),
    );
    expect(writing).toEqual({
      href: "/writing/hello-world",
      title: "hello world",
      content_type: "writing",
    });

    const activity = likeMetaFromRequest(
      new Request("https://brianlovin.com/api/likes/1", {
        headers: { referer: "https://brianlovin.com/activity" },
      }),
    );
    expect(activity).toBeNull();
  });
});
