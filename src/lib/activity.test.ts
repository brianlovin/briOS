import { describe, expect, test } from "bun:test";

import {
  activityEnterStaggerDelays,
  type ActivityEvent,
  activityStackReactKey,
  ANONYMOUS_VISIT_SUMMARY,
  countryCodeToFlag,
  countryCodeToName,
  createMemoryActivityStore,
  findForbiddenPii,
  formatVisitSummary,
  getActivityRow,
  getRequestCountry,
  getRequestGeo,
  hashDigestSubscriber,
  inferTitleFromPath,
  ingestActivityEvent,
  likeActivityPayload,
  likeMetaFromRequest,
  looksLikeIdentifier,
  looksLikeShortId,
  recordDigestSubscribed,
  recordLike,
  recordVisit,
  rollupActivityEvents,
  shouldPulseActivityRollup,
  shouldRecordVisit,
  stripTrailingShortIdToken,
  visibleLifetimeTotals,
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

  test("rejects a raw IP if someone puts one in visit meta", () => {
    expect(
      findForbiddenPii({
        type: "visit",
        summary: "Visit from Russia",
        meta: { country: "RU", city: "203.0.113.10" },
      }),
    ).toBe("meta.city: ip");
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

  test("does not increment lifetime totals for visit_country_first", async () => {
    const store = createMemoryActivityStore();
    const result = await ingestActivityEvent(
      baseEvent({
        type: "visit_country_first",
        speed: "signal",
        summary: "First visit from Russia",
      }),
      store,
    );

    expect(result.ok).toBe(true);
    expect(await store.getStreamLength()).toBe(1);
    expect(await store.getTotals()).toEqual([]);
    expect(visibleLifetimeTotals(await store.getTotals())).toEqual([]);
    expect(
      visibleLifetimeTotals([
        { source: "brios", type: "visit", count: 10, first_seen: "2026-08-16T00:00:00.000Z" },
        {
          source: "brios",
          type: "visit_country_first",
          count: 3,
          first_seen: "2026-08-16T00:00:00.000Z",
        },
        { source: "brios", type: "like", count: 1, first_seen: "2026-08-16T00:00:00.000Z" },
      ]),
    ).toEqual([
      expect.objectContaining({ type: "visit" }),
      expect.objectContaining({ type: "like" }),
    ]);
  });

  test("still increments lifetime totals for other types", async () => {
    const store = createMemoryActivityStore();
    await ingestActivityEvent(baseEvent({ type: "ama_asked", summary: "Someone asked" }), store);
    expect(await store.getTotals()).toEqual([
      expect.objectContaining({ source: "brios", type: "ama_asked", count: 1 }),
    ]);
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

describe("countryCodeToFlag", () => {
  test("maps ISO 3166-1 alpha-2 codes to regional indicator flags", () => {
    expect(countryCodeToFlag("IN")).toBe("🇮🇳");
    expect(countryCodeToFlag("us")).toBe("🇺🇸");
    expect(countryCodeToFlag("DE")).toBe("🇩🇪");
  });

  test("returns no flag for invalid, unknown, XX, and T1", () => {
    expect(countryCodeToFlag("XX")).toBe("");
    expect(countryCodeToFlag("T1")).toBe("");
    expect(countryCodeToFlag("USA")).toBe("");
    expect(countryCodeToFlag("1A")).toBe("");
    expect(countryCodeToFlag("")).toBe("");
    expect(countryCodeToFlag(undefined)).toBe("");
  });
});

describe("countryCodeToName", () => {
  test("maps common ISO 3166-1 alpha-2 codes to English names", () => {
    expect(countryCodeToName("US")).toBe("United States");
    expect(countryCodeToName("RU")).toBe("Russia");
    expect(countryCodeToName("IN")).toBe("India");
    expect(countryCodeToName("GB")).toBe("United Kingdom");
  });

  test("keeps an unknown code", () => {
    expect(countryCodeToName("ZZ")).toBe("ZZ");
    expect(countryCodeToName("xx")).toBe("XX");
  });
});

describe("formatVisitSummary", () => {
  test("uses the most specific location available", () => {
    expect(
      formatVisitSummary({
        country: "US",
        countryName: "United States",
        region: "CA",
        regionName: "California",
        city: "San Francisco",
      }),
    ).toBe("🇺🇸 Visit from San Francisco, California, United States");
    expect(
      formatVisitSummary({
        country: "IN",
        countryName: "India",
        city: "Bengaluru",
      }),
    ).toBe("🇮🇳 Visit from Bengaluru, India");
    expect(formatVisitSummary({ country: "RU" })).toBe("🇷🇺 Visit from Russia");
    expect(formatVisitSummary({})).toBe(ANONYMOUS_VISIT_SUMMARY);
  });

  test("keeps an unknown country code", () => {
    expect(formatVisitSummary({ country: "ZZ" })).toBe(`${countryCodeToFlag("ZZ")} Visit from ZZ`);
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

  test("stores a page subject and prefixes a country flag on the summary", async () => {
    const store = createMemoryActivityStore();
    const result = await recordVisit(
      { path: "/writing/grok-bot-first-impressions", country: "IN" },
      store,
    );
    expect("ok" in result && result.ok).toBe(true);

    const [event] = await store.getTail(1);
    expect(event?.type).toBe("visit");
    expect(event?.summary).toBe("🇮🇳 Visit from India");
    expect(event?.subject).toEqual({
      kind: "writing",
      label: "grok bot first impressions",
      href: "/writing/grok-bot-first-impressions",
    });
    expect(event?.subject?.href).toBe("/writing/grok-bot-first-impressions");
    expect(event?.meta).toEqual({
      country: "IN",
      country_name: "India",
      path: "/writing/grok-bot-first-impressions",
      title: "grok bot first impressions",
    });
    expect(getActivityRow(event!)).toEqual({
      summary: "Visit from India",
      flag: "🇮🇳",
      href: "/writing/grok-bot-first-impressions",
      label: "grok bot first impressions",
    });
  });

  test("stores a contextual phrase for an HN story id at ingest", async () => {
    const store = createMemoryActivityStore();
    await recordVisit({ path: "/hn/46993596", country: "CN" }, store);
    const [event] = await store.getTail(1);
    expect(event?.subject).toEqual({
      kind: "page",
      label: "a Hacker News story",
      href: "/hn/46993596",
    });
    expect(event?.meta).toEqual(expect.objectContaining({ title: "a Hacker News story" }));
    expect(getActivityRow(event!).label).toBe("a Hacker News story");
  });

  test("strips a trailing short id from the visit title at ingest", async () => {
    const store = createMemoryActivityStore();
    await recordVisit(
      { path: "/writing/grok-bot-first-impressions-kcJun01", country: "IN" },
      store,
    );
    const [event] = await store.getTail(1);
    expect(event?.subject).toEqual({
      kind: "writing",
      label: "grok bot first impressions",
      href: "/writing/grok-bot-first-impressions-kcJun01",
    });
    expect(event?.meta).toEqual(expect.objectContaining({ title: "grok bot first impressions" }));
  });

  test("prefers city and region in the visit summary", async () => {
    const store = createMemoryActivityStore();
    await recordVisit(
      {
        path: "/",
        country: "US",
        countryName: "United States",
        region: "CA",
        regionName: "California",
        city: "San Francisco",
      },
      store,
    );
    const [event] = await store.getTail(1);
    expect(event?.type).toBe("visit");
    expect(event?.summary).toBe("🇺🇸 Visit from San Francisco, California, United States");
    expect(event?.meta).toEqual({
      country: "US",
      country_name: "United States",
      region: "CA",
      region_name: "California",
      city: "San Francisco",
      path: "/",
      title: "Home",
    });
  });

  test("uses mysterious-place copy when geo is missing", async () => {
    const store = createMemoryActivityStore();
    const result = await recordVisit({ path: "/writing" }, store);
    expect("ok" in result && result.ok).toBe(true);

    const [event] = await store.getTail(1);
    expect(event?.type).toBe("visit");
    expect(event?.summary).toBe(ANONYMOUS_VISIT_SUMMARY);
    expect(event?.meta).toEqual({ path: "/writing", title: "Writing" });
    expect(getActivityRow(event!)).toEqual({
      summary: ANONYMOUS_VISIT_SUMMARY,
      href: "/writing",
      label: "Writing",
    });
  });

  test("rewrites a stored Visit row that has no country", () => {
    const row = getActivityRow({
      v: 1,
      id: "old-anon",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "visit",
      speed: "signal",
      summary: "Visit",
      visibility: "public",
      idempotency_key: "old-anon",
      subject: { kind: "home", label: "Home", href: "/" },
    });
    expect(row).toEqual({
      summary: ANONYMOUS_VISIT_SUMMARY,
      href: "/",
      label: "Home",
    });
    expect(row.flag).toBeUndefined();
  });

  test("keeps a located visit stored only in the summary", () => {
    const row = getActivityRow({
      v: 1,
      id: "old-located",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "visit",
      speed: "signal",
      summary: "🇫🇷 Visit from France",
      visibility: "public",
      idempotency_key: "old-located",
      subject: { kind: "writing", label: "Writing", href: "/writing" },
    });
    expect(row.summary).toBe("Visit from France");
    expect(row.flag).toBe("🇫🇷");
  });

  test("keeps the existing summary when the country has no flag", async () => {
    const store = createMemoryActivityStore();
    await recordVisit({ path: "/", country: "XX" }, store);
    const [event] = await store.getTail(1);
    expect(event?.summary).toBe("Visit from XX");
    expect(event?.subject?.href).toBe("/");
    expect(event?.subject?.label).toBe("Home");
    expect(event?.meta).toEqual({ country: "XX", path: "/", title: "Home" });
  });

  test("prefixes a flag in getActivityRow for older visits that lack the emoji", () => {
    const row = getActivityRow({
      v: 1,
      id: "old-visit",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "visit",
      speed: "signal",
      summary: "Visit from IN",
      visibility: "public",
      idempotency_key: "old",
      meta: { country: "IN" },
    });
    expect(row).toEqual({
      summary: "Visit from India",
      flag: "🇮🇳",
    });
  });

  test("still flags leftover first-country stream rows", () => {
    const row = getActivityRow({
      v: 1,
      id: "old-first",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "visit_country_first",
      speed: "event",
      summary: "First visit from IN",
      visibility: "public",
      idempotency_key: "old-first",
      meta: { country: "IN" },
    });
    expect(row).toEqual({
      summary: "First visit from IN",
      flag: "🇮🇳",
    });
  });

  test("does not emit a first-country event", async () => {
    const store = createMemoryActivityStore();
    await recordVisit({ path: "/writing", country: "FR" }, store);
    await recordVisit({ path: "/writing", country: "FR" }, store);
    await recordVisit({ path: "/til", country: "JP" }, store);

    const events = await store.getTail(20);
    expect(events).toHaveLength(3);
    expect(events.every((event) => event.type === "visit")).toBe(true);
    expect(events.some((event) => event.type === "visit_country_first")).toBe(false);
    expect(await store.getTotals()).toEqual([
      expect.objectContaining({ source: "brios", type: "visit", count: 3 }),
    ]);
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
    expect(totals).toContainEqual(
      expect.objectContaining({ source: "brios", type: "visit", count: burst }),
    );
    expect(totals.find((total) => total.type === "visit_country_first")).toBeUndefined();
    expect(await store.getStreamLength()).toBe(ACTIVITY_VISIT_STREAM_MAX_PER_SEC);
    expect(await store.getStreamLength()).toBeLessThan(ACTIVITY_STREAM_MAXLEN);
  });
});

describe("recordDigestSubscribed", () => {
  test("does not leak the email in the event payload or meta", async () => {
    const store = createMemoryActivityStore();
    const email = "person@example.com";

    const result = await recordDigestSubscribed({ email }, store);
    expect(result.ok && !result.duplicate).toBe(true);

    const [event] = await store.getTail(1);
    const serialized = JSON.stringify(event);
    expect(serialized).not.toContain(email);
    expect(serialized).not.toContain("person");
    expect(serialized.toLowerCase()).not.toContain("example.com");
    expect(event?.type).toBe("digest_subscribed");
    expect(event?.source).toBe("brios");
    expect(event?.visibility).toBe("public");
    expect(event?.meta).toBeUndefined();
    expect(event?.idempotency_key).toBe(`brios:digest_subscribed:${hashDigestSubscriber(email)}`);
  });

  test("is idempotent per email hash, not the raw address", async () => {
    const store = createMemoryActivityStore();
    const first = await recordDigestSubscribed({ email: "Alex@Example.com" }, store);
    const second = await recordDigestSubscribed({ email: "alex@example.com" }, store);
    const other = await recordDigestSubscribed({ email: "other@example.org" }, store);

    expect(first.ok && !first.duplicate).toBe(true);
    expect(second.ok && second.duplicate).toBe(true);
    expect(other.ok && !other.duplicate).toBe(true);
    expect(await store.getStreamLength()).toBe(2);
    expect(await store.getTotals()).toEqual([
      expect.objectContaining({ source: "brios", type: "digest_subscribed", count: 2 }),
    ]);
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

  test("keeps a stack item name instead of the list page title", async () => {
    const store = createMemoryActivityStore();
    const result = await recordLike(
      {
        title: "Cursor",
        href: "https://cursor.com",
        content_type: "stack",
        pageId: "stack-cursor",
      },
      store,
    );
    expect("ok" in result && result.ok).toBe(true);
    const [event] = await store.getTail(1);
    expect(event?.summary).toBe("Someone liked Cursor");
    expect(event?.subject).toEqual({
      kind: "stack",
      label: "Cursor",
      href: "https://cursor.com",
    });
    expect(getActivityRow(event!)).toEqual({
      summary: "Someone liked Cursor",
      href: "https://cursor.com",
      label: "Cursor",
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

describe("getRequestGeo", () => {
  test("decodes a Vercel city and maps a US region", () => {
    const geo = getRequestGeo(
      new Headers({
        "x-vercel-ip-country": "US",
        "x-vercel-ip-country-region": "CA",
        "x-vercel-ip-city": "San%20Francisco",
      }),
    );
    expect(geo).toEqual({
      country: "US",
      countryName: "United States",
      region: "CA",
      regionName: "California",
      city: "San Francisco",
    });
  });

  test("prefers Cloudflare city/region headers and never reads IP headers", () => {
    const geo = getRequestGeo(
      new Headers({
        "cf-ipcountry": "in",
        "cf-ipcity": "Bengaluru",
        "cf-region": "Karnataka",
        "cf-region-code": "KA",
        "cf-connecting-ip": "203.0.113.10",
        "x-forwarded-for": "203.0.113.10",
        "x-vercel-ip-country": "US",
      }),
    );
    expect(geo).toEqual({
      country: "IN",
      countryName: "India",
      region: "KA",
      regionName: "Karnataka",
      city: "Bengaluru",
    });
    expect(JSON.stringify(geo)).not.toContain("203.0.113");
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

describe("inferTitleFromPath", () => {
  test("maps known section routes to nav labels", () => {
    expect(inferTitleFromPath("/")).toBe("Home");
    expect(inferTitleFromPath("/writing")).toBe("Writing");
    expect(inferTitleFromPath("/til")).toBe("TIL");
    expect(inferTitleFromPath("/stack")).toBe("Stack");
    expect(inferTitleFromPath("/hn")).toBe("Hacker News");
    expect(inferTitleFromPath("/app-dissection")).toBe("App Dissection");
    expect(inferTitleFromPath("/design-details")).toBe("Design Details");
    expect(inferTitleFromPath("/bookmarks")).toBe("Bookmarks");
  });

  test("strips trailing Notion short ids from slugs", () => {
    expect(inferTitleFromPath("/writing/grok-bot-first-impressions-kcJun01")).toBe(
      "grok bot first impressions",
    );
    expect(inferTitleFromPath("/til/cache-headers-B57IXLJ")).toBe("cache headers");
  });

  test("leaves no-id slugs and real words unchanged", () => {
    expect(inferTitleFromPath("/writing/hello-world")).toBe("hello world");
    expect(inferTitleFromPath("/writing/grok-bot-first-impressions")).toBe(
      "grok bot first impressions",
    );
    expect(looksLikeShortId("writing")).toBe(false);
    expect(looksLikeShortId("stack")).toBe(false);
    expect(looksLikeShortId("kcJun01")).toBe(true);
    expect(looksLikeShortId("B57IXLJ")).toBe(true);
    expect(stripTrailingShortIdToken("grok bot first impressions kcJun01")).toBe(
      "grok bot first impressions",
    );
  });

  test("never returns a page for an unknown or empty path", () => {
    expect(inferTitleFromPath("/mystery")).toBe("mystery");
    expect(inferTitleFromPath("")).toBe("Home");
  });

  test("uses a contextual phrase for identifier routes instead of the raw id", () => {
    expect(inferTitleFromPath("/hn/46993596")).toBe("a Hacker News story");
    expect(inferTitleFromPath("/ama/2f2c711c-0ceb-810d-899d-e5feb99e70f4")).toBe("an AMA question");
    expect(inferTitleFromPath("/bookmarks/2f2c711c-0ceb-810d-899d-e5feb99e70f4")).toBe("Bookmarks");
    expect(inferTitleFromPath("/design-details/2f2c711c0ceb810d899de5feb99e70f4")).toBe(
      "Design Details",
    );
    expect(looksLikeIdentifier("46993596")).toBe(true);
    expect(looksLikeIdentifier("2f2c711c-0ceb-810d-899d-e5feb99e70f4")).toBe(true);
    expect(looksLikeIdentifier("2f2c711c 0ceb 810d 899d e5feb99e70f4")).toBe(true);
    expect(looksLikeIdentifier("grok bot first impressions")).toBe(false);
  });

  test("never returns a bare number or uuid as the page name", () => {
    const titles = [
      inferTitleFromPath("/hn/46993596"),
      inferTitleFromPath("/hn/38084098"),
      inferTitleFromPath("/ama/2f2c711c-0ceb-810d-899d-e5feb99e70f4"),
      inferTitleFromPath("/mystery/12345"),
    ];
    for (const title of titles) {
      expect(title).not.toMatch(/^\d+$/);
      expect(looksLikeIdentifier(title)).toBe(false);
    }
    expect(inferTitleFromPath("/mystery/12345")).toBe("mystery");
  });
});

describe("getActivityRow page titles", () => {
  test("rewrites a stored a page label when href is home", () => {
    const row = getActivityRow({
      v: 1,
      id: "old-home",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "visit",
      speed: "signal",
      summary: "Visit from France",
      visibility: "public",
      idempotency_key: "old-home",
      subject: { kind: "home", label: "a page", href: "/" },
      meta: { path: "/", title: "a page", country: "FR" },
    });
    expect(row.label).toBe("Home");
    expect(row.href).toBe("/");
  });

  test("strips a stored short id from a writing visit without rewriting Redis", () => {
    const row = getActivityRow({
      v: 1,
      id: "old-writing",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "visit",
      speed: "signal",
      summary: "Visit from India",
      visibility: "public",
      idempotency_key: "old-writing",
      subject: {
        kind: "writing",
        label: "grok bot first impressions kcJun01",
        href: "/writing/grok-bot-first-impressions-kcJun01",
      },
    });
    expect(row.label).toBe("grok bot first impressions");
    expect(row.href).toBe("/writing/grok-bot-first-impressions-kcJun01");
  });

  test("rewrites a stored HN story id to a Hacker News story", () => {
    const row = getActivityRow({
      v: 1,
      id: "old-hn",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "visit",
      speed: "signal",
      summary: "Visit from China",
      visibility: "public",
      idempotency_key: "old-hn",
      subject: {
        kind: "page",
        label: "46993596",
        href: "/hn/46993596",
      },
    });
    expect(row.label).toBe("a Hacker News story");
    expect(row.href).toBe("/hn/46993596");
  });

  test("rewrites a stored AMA UUID label to an AMA question", () => {
    const row = getActivityRow({
      v: 1,
      id: "old-ama",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "visit",
      speed: "signal",
      summary: "Visit from United States",
      visibility: "public",
      idempotency_key: "old-ama",
      subject: {
        kind: "ama",
        label: "2f2c711c 0ceb 810d 899d e5feb99e70f4",
        href: "/ama/2f2c711c-0ceb-810d-899d-e5feb99e70f4",
      },
    });
    expect(row.label).toBe("an AMA question");
    expect(row.href).toBe("/ama/2f2c711c-0ceb-810d-899d-e5feb99e70f4");
  });

  test("keeps a liked stack item name instead of rewriting it to Stack", () => {
    const row = getActivityRow({
      v: 1,
      id: "like-cursor",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "like",
      speed: "event",
      summary: "Someone liked Cursor",
      visibility: "public",
      idempotency_key: "like-cursor",
      subject: { kind: "stack", label: "Cursor", href: "/stack" },
      meta: { content_type: "stack", title: "Cursor", href: "/stack" },
    });
    expect(row).toEqual({
      summary: "Someone liked Cursor",
      href: "/stack",
      label: "Cursor",
    });
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

  test("uses a passed item title instead of falling back to Stack", () => {
    const request = new Request("https://brianlovin.com/api/likes/1", {
      headers: { referer: "https://brianlovin.com/stack" },
    });

    expect(
      likeMetaFromRequest(request, {
        title: "Cursor",
        href: "https://cursor.com",
        content_type: "stack",
      }),
    ).toEqual({
      title: "Cursor",
      href: "https://cursor.com",
      content_type: "stack",
    });

    expect(
      likeMetaFromRequest(request, {
        title: "Cursor",
        href: "/stack",
        content_type: "stack",
      }),
    ).toEqual({
      title: "Cursor",
      href: "/stack",
      content_type: "stack",
    });
  });
});

describe("likeActivityPayload", () => {
  test("uses passed title and href instead of page fallbacks", () => {
    expect(
      likeActivityPayload(
        { title: "Cursor", href: "https://cursor.com", contentType: "stack" },
        { title: "Stack", href: "/stack" },
      ),
    ).toEqual({
      title: "Cursor",
      href: "https://cursor.com",
      content_type: "stack",
    });
  });

  test("does not fall back to Stack when a stack item name is provided", () => {
    expect(
      likeActivityPayload(
        { title: "Cursor", href: "/stack", contentType: "stack" },
        {
          title: "Stack",
          href: "/stack",
        },
      ),
    ).toEqual({
      title: "Cursor",
      href: "/stack",
      content_type: "stack",
    });
  });

  test("falls back to the page title and path when no target is passed", () => {
    expect(likeActivityPayload({}, { title: "Stack", href: "/stack" })).toEqual({
      title: "Stack",
      href: "/stack",
      content_type: "stack",
    });
  });
});

function feedEvent(
  overrides: Partial<ActivityEvent> & Pick<ActivityEvent, "id" | "type">,
): ActivityEvent {
  return {
    v: 1,
    ts: "2026-08-16T00:00:00.000Z",
    received_at: "2026-08-16T00:00:00.000Z",
    source: "brios",
    speed: overrides.type === "visit" ? "signal" : "event",
    summary: "Visit from Spring Lake, North Carolina, United States",
    visibility: "public",
    idempotency_key: overrides.id,
    ...overrides,
  };
}

function springLakeVisit(id: string, href: string, label?: string): ActivityEvent {
  return feedEvent({
    id,
    type: "visit",
    summary: "Visit from Spring Lake, North Carolina, United States",
    subject: {
      kind: "page",
      label: label ?? href.split("/").pop() ?? "page",
      href,
    },
    meta: {
      country: "US",
      country_name: "United States",
      region: "NC",
      region_name: "North Carolina",
      city: "Spring Lake",
      path: href,
    },
  });
}

describe("rollupActivityEvents", () => {
  test("stacks six consecutive AMA visits from the same geo into one row", () => {
    const events = [
      springLakeVisit("ama-1", "/ama/2f2c711c-0ceb-810d-899d-e5feb99e70f4"),
      springLakeVisit("ama-2", "/ama/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"),
      springLakeVisit("ama-3", "/ama/11111111-2222-3333-4444-555555555555"),
      springLakeVisit("ama-4", "/ama/abcdef12-3456-7890-abcd-ef1234567890"),
      springLakeVisit("ama-5", "/ama/99999999-8888-7777-6666-555555555555"),
      springLakeVisit("ama-6", "/ama/00000000-0000-0000-0000-000000000001"),
    ];

    const stacks = rollupActivityEvents(events);
    expect(stacks).toHaveLength(1);
    expect(stacks[0]?.count).toBe(6);
    expect(stacks[0]?.latest.id).toBe("ama-1");
    expect(stacks[0]?.anchorId).toBe("ama-6");
    expect(stacks[0]?.sectionLabel).toBe("an AMA question");
    expect(stacks[0]?.key).toBe("visit:spring lake, north carolina, united states:ama");
    expect(stacks[0]?.href).toBe("/ama");
  });

  test("keeps a stable React key when a matching event is prepended", () => {
    const events = [
      springLakeVisit("ama-1", "/ama/2f2c711c-0ceb-810d-899d-e5feb99e70f4"),
      springLakeVisit("ama-2", "/ama/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"),
    ];
    const first = rollupActivityEvents(events);
    const next = rollupActivityEvents([
      springLakeVisit("ama-0", "/ama/00000000-0000-0000-0000-000000000099"),
      ...events,
    ]);

    expect(next[0]?.count).toBe(3);
    expect(next[0]?.latest.id).toBe("ama-0");
    expect(next[0]?.anchorId).toBe(first[0]?.anchorId);
    expect(activityStackReactKey(next[0]!)).toBe(activityStackReactKey(first[0]!));
  });

  test("does not stack an AMA visit with a writing visit from the same geo", () => {
    const stacks = rollupActivityEvents([
      springLakeVisit("ama-1", "/ama/2f2c711c-0ceb-810d-899d-e5feb99e70f4"),
      springLakeVisit(
        "writing-1",
        "/writing/grok-bot-first-impressions",
        "grok bot first impressions",
      ),
    ]);

    expect(stacks).toHaveLength(2);
    expect(stacks[0]?.count).toBe(1);
    expect(stacks[0]?.sectionLabel).toBe("an AMA question");
    expect(stacks[1]?.count).toBe(1);
    expect(stacks[1]?.sectionLabel).toBe("grok bot first impressions");
  });

  test("stacks consecutive Shiori link_saved events, then a like as its own row", () => {
    const shiori = (id: string): ActivityEvent =>
      feedEvent({
        id,
        source: "shiori",
        type: "link_saved",
        summary: "Someone saved a link on Shiori",
      });
    const like = feedEvent({
      id: "like-1",
      type: "like",
      summary: "Someone liked Stack",
      subject: { kind: "stack", label: "Stack", href: "/stack" },
    });

    const stacks = rollupActivityEvents([shiori("s1"), shiori("s2"), shiori("s3"), like]);
    expect(stacks).toHaveLength(2);
    expect(stacks[0]?.count).toBe(3);
    expect(stacks[0]?.key).toBe("shiori:link_saved");
    expect(stacks[0]?.latest.id).toBe("s1");
    expect(stacks[1]?.count).toBe(1);
    expect(stacks[1]?.key).toBe("like:/stack");
  });

  test("does not stack likes for different apps", () => {
    const stacks = rollupActivityEvents([
      feedEvent({
        id: "like-cursor",
        type: "like",
        summary: "Someone liked Cursor",
        subject: { kind: "stack", label: "Cursor", href: "https://cursor.com" },
      }),
      feedEvent({
        id: "like-raycast",
        type: "like",
        summary: "Someone liked Raycast",
        subject: { kind: "stack", label: "Raycast", href: "https://www.raycast.com" },
      }),
    ]);

    expect(stacks).toHaveLength(2);
    expect(stacks[0]?.key).toBe("like:https://cursor.com");
    expect(stacks[1]?.key).toBe("like:https://www.raycast.com");
    expect(getActivityRow(stacks[0]!.latest).summary).toBe("Someone liked Cursor");
    expect(getActivityRow(stacks[1]!.latest).summary).toBe("Someone liked Raycast");
  });

  test("does not merge the same type across a different intervening event", () => {
    const stacks = rollupActivityEvents([
      springLakeVisit("ama-1", "/ama/2f2c711c-0ceb-810d-899d-e5feb99e70f4"),
      feedEvent({
        id: "like-1",
        type: "like",
        summary: "Someone liked Stack",
        subject: { kind: "stack", label: "Stack", href: "/stack" },
      }),
      springLakeVisit("ama-2", "/ama/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"),
    ]);

    expect(stacks).toHaveLength(3);
    expect(stacks.map((stack) => stack.count)).toEqual([1, 1, 1]);
    expect(stacks[0]?.key).toBe(stacks[2]?.key);
  });

  test("staggers only newly inserted keys, newest first, and caps the delay", () => {
    expect(activityEnterStaggerDelays(["a", "b"], null).size).toBe(0);

    const previous = new Set(["old-1", "old-2"]);
    const delays = activityEnterStaggerDelays(
      ["new-1", "new-2", "new-3", "new-4", "new-5", "old-1", "old-2"],
      previous,
    );
    expect([...delays.entries()]).toEqual([
      ["new-1", 0],
      ["new-2", 0.1],
      ["new-3", 0.2],
      ["new-4", 0.3],
      ["new-5", 0.4],
    ]);

    const many = Array.from({ length: 16 }, (_, index) => `n-${index}`);
    const capped = activityEnterStaggerDelays(many, new Set());
    expect(capped.get("n-0")).toBe(0);
    expect(capped.get("n-10")).toBe(1);
    expect(capped.get("n-15")).toBe(1);
    expect(capped.has("old-1")).toBe(false);
  });

  test("only pulses when the top stack count increments", () => {
    const top = { key: "visit:spring lake, north carolina, united states:ama", count: 3 };
    expect(shouldPulseActivityRollup(null, { ...top, count: 1 })).toBe(false);
    expect(shouldPulseActivityRollup(top, { ...top, count: 4 })).toBe(true);
    expect(shouldPulseActivityRollup(top, { ...top, count: 3 })).toBe(false);
    expect(shouldPulseActivityRollup(top, { key: "like:/stack", count: 1 })).toBe(false);
  });
});
