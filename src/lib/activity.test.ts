import { describe, expect, test } from "bun:test";

import {
  countryCodeToFlag,
  countryCodeToName,
  createMemoryActivityStore,
  findForbiddenPii,
  formatVisitSummary,
  getActivityRow,
  getCaffeineIcon,
  getRequestCountry,
  getRequestGeo,
  hashDigestSubscriber,
  ingestActivityEvent,
  likeMetaFromRequest,
  recordCaffeine,
  recordDigestSubscribed,
  recordLike,
  recordVisit,
  shouldRecordVisit,
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
    expect(formatVisitSummary({})).toBe("Visit");
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
      title: "a page",
    });
  });

  test("keeps the existing summary when the country has no flag", async () => {
    const store = createMemoryActivityStore();
    await recordVisit({ path: "/", country: "XX" }, store);
    const [event] = await store.getTail(1);
    expect(event?.summary).toBe("Visit from XX");
    expect(event?.subject?.href).toBe("/");
    expect(event?.meta).toEqual({ country: "XX", path: "/", title: "a page" });
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

describe("recordCaffeine", () => {
  test("writes a public caffeinated event with title-cased summary and drink-only meta", async () => {
    const store = createMemoryActivityStore();
    const now = new Date("2026-08-16T15:04:05.000Z");
    const result = await recordCaffeine({ drink: "cortado" }, store, now);

    expect(result.ok && !result.duplicate).toBe(true);
    const [event] = await store.getTail(1);
    expect(event?.source).toBe("brios");
    expect(event?.type).toBe("caffeinated");
    expect(event?.speed).toBe("event");
    expect(event?.visibility).toBe("public");
    expect(event?.summary).toBe("Caffeinated with Cortado");
    expect(event?.subject).toEqual({ kind: "drink", label: "Cortado" });
    expect(event?.meta).toEqual({ drink: "Cortado" });
    expect(event?.idempotency_key).toMatch(/^brios:caffeinated:2026-08-16:cortado:[0-9a-f-]{36}$/);
    expect(getActivityRow(event!)).toEqual({
      summary: "Caffeinated with Cortado",
      icon: "☕",
      label: "Cortado",
    });
    expect(findForbiddenPii(event)).toBeNull();
    expect(JSON.stringify(event)).not.toContain("@");
    expect(event?.meta).not.toHaveProperty("email");
    expect(event?.meta).not.toHaveProperty("authorization");
    expect(event?.actor).toBeUndefined();
  });

  test("counts two of the same drink on the same day as separate events", async () => {
    const store = createMemoryActivityStore();
    const now = new Date("2026-08-16T15:04:05.000Z");
    const first = await recordCaffeine({ drink: "coffee" }, store, now);
    const second = await recordCaffeine({ drink: "coffee" }, store, now);

    expect(first.ok && !first.duplicate).toBe(true);
    expect(second.ok && !second.duplicate).toBe(true);
    expect(await store.getStreamLength()).toBe(2);
    expect(await store.getTotals()).toEqual([
      expect.objectContaining({ source: "brios", type: "caffeinated", count: 2 }),
    ]);
  });

  test("rejects an empty drink and an email drink before writing", async () => {
    const store = createMemoryActivityStore();
    expect(await recordCaffeine({ drink: "   " }, store)).toEqual({
      ok: false,
      error: "drink is required",
      status: 400,
    });

    const pii = await recordCaffeine({ drink: "hi@example.com" }, store);
    expect(pii.ok).toBe(false);
    if (!pii.ok) expect(pii.error).toContain("forbidden");
    expect(await store.getStreamLength()).toBe(0);
  });
});

describe("getCaffeineIcon", () => {
  test("uses a coffee cup for coffee-family drinks", () => {
    for (const drink of [
      "coffee",
      "Espresso",
      "latte",
      "cappuccino",
      "cappucino",
      "cortado",
      "macchiato",
      "mocha",
      "americano",
      "flat white",
      "drip",
      "pour over",
      "cold brew",
      "nitro",
      "affogato",
      "gibraltar",
      "iced latte",
    ]) {
      expect(getCaffeineIcon(drink)).toBe("☕");
    }
  });

  test("uses a cup for other caffeinated drinks and unknowns", () => {
    for (const drink of [
      "celsius",
      "tea",
      "matcha",
      "energy",
      "soda",
      "coke",
      "yerba",
      "preworkout",
      "unknown",
    ]) {
      expect(getCaffeineIcon(drink)).toBe("🥤");
    }
  });
});
