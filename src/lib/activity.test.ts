import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";

import {
  activityEnterStaggerDelays,
  type ActivityEvent,
  activityRollupKey,
  activitySectionFromPath,
  activitySourceFaviconSrc,
  activitySourceUrl,
  activityStackReactKey,
  ANONYMOUS_VISIT_SUMMARY,
  countryCodeToFlag,
  countryCodeToName,
  createMemoryActivityStore,
  findForbiddenPii,
  formatActivityTitle,
  formatDownloadSummary,
  formatVisitSummary,
  getActivityRow,
  getCaffeineIcon,
  getRequestCountry,
  getRequestGeo,
  hashDigestSubscriber,
  inferTitleFromPath,
  ingestActivityEvent,
  likeActivityPayload,
  likeMetaFromRequest,
  looksLikeIdentifier,
  looksLikeShortId,
  nextActivityEnterState,
  pathnameFromHref,
  recordCaffeine,
  recordDigestSubscribed,
  recordLike,
  recordVisit,
  resolveActivitySourceHref,
  resolveIngestVisitTitle,
  rollupActivityEvents,
  sanitizeVisitTitle,
  shouldPulseActivityRollup,
  shouldRecordVisit,
  stripSiteTitleSuffix,
  stripTrailingShortIdToken,
} from "@/lib/activity";
import { geoFromVisitMeta, normalizeRegionCode, visitDisplaySummary } from "@/lib/activity-geo";
import * as activityHn from "@/lib/activity-hn";
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

let lookupHnStoryTitleSpy: ReturnType<typeof spyOn>;

beforeEach(() => {
  lookupHnStoryTitleSpy = spyOn(activityHn, "lookupHnStoryTitle").mockResolvedValue(null);
});

afterEach(() => {
  lookupHnStoryTitleSpy.mockRestore();
});

function visitRowEvent(
  subject: { kind: string; label: string; href: string },
  overrides: Record<string, unknown> = {},
): ActivityEvent {
  return {
    v: 1,
    id: "visit-row",
    ts: "2026-08-16T00:00:00.000Z",
    received_at: "2026-08-16T00:00:00.000Z",
    source: "brios",
    type: "visit",
    speed: "signal",
    summary: "Visit from United States",
    visibility: "public",
    idempotency_key: "visit-row",
    subject,
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
    expect(await store.getCount()).toBe(0);
  });

  test("idempotent retry does not double-count", async () => {
    const store = createMemoryActivityStore();
    const input = baseEvent({ idempotency_key: "like:page:1" });

    const first = await ingestActivityEvent(input, store);
    const second = await ingestActivityEvent({ ...input, id: crypto.randomUUID() }, store);

    expect(first.ok && !first.duplicate).toBe(true);
    expect(second.ok && second.duplicate).toBe(true);
    expect(await store.getStreamLength()).toBe(1);
    expect(await store.getCount()).toBe(1);
  });

  test("rejects an unregistered type even when summary is present", async () => {
    const store = createMemoryActivityStore();
    const result = await ingestActivityEvent(
      baseEvent({
        type: "weird_new_thing",
        summary: "A brand new event happened",
        subject: { kind: "page", label: "Hello", href: "/hello" },
      }),
      store,
    );

    expect(result).toEqual({ ok: false, error: "unregistered source/type", status: 400 });
    expect(await store.getStreamLength()).toBe(0);
  });

  test("HMAC ingest of staff-design + visit succeeds and fills the visit shape", async () => {
    const store = createMemoryActivityStore();
    const result = await ingestActivityEvent(
      {
        source: "staff-design",
        type: "visit",
        idempotency_key: "hmac:staff-design:visit:1",
        meta: { path: "/karla-mickens-cole", title: "Karla Mickens Cole", country: "DE" },
      },
      store,
    );

    expect(result.ok && !result.duplicate).toBe(true);
    const [event] = await store.getTail(1);
    expect(event?.source).toBe("staff-design");
    expect(event?.type).toBe("visit");
    expect(event?.speed).toBe("signal");
    expect(event?.summary).toBe("🇩🇪 Visit from Germany");
    expect(event?.subject).toEqual({
      kind: "page",
      label: "Karla Mickens Cole",
      href: "/karla-mickens-cole",
    });
    expect(event?.meta).toEqual(
      expect.objectContaining({
        path: "/karla-mickens-cole",
        title: "Karla Mickens Cole",
        country: "DE",
        country_name: "Germany",
      }),
    );
  });

  test("decodes percent-encoded HMAC visit city before storing", async () => {
    const store = createMemoryActivityStore();
    const result = await ingestActivityEvent(
      {
        source: "tax-ui",
        type: "visit",
        idempotency_key: "hmac:tax-ui:visit:encoded-city",
        meta: { path: "/", city: "San%20Francisco", region: "CA", country: "US" },
      },
      store,
    );

    expect(result.ok && !result.duplicate).toBe(true);
    const [event] = await store.getTail(1);
    expect(event?.meta?.city).toBe("San Francisco");
    expect(event?.summary).toContain("San Francisco");
    expect(event?.summary).not.toContain("San%20Francisco");
    expect(JSON.stringify(event?.meta)).not.toContain("San%20Francisco");
  });

  test("HMAC ingest of staff-design + like is rejected", async () => {
    const store = createMemoryActivityStore();
    const result = await ingestActivityEvent(
      baseEvent({
        source: "staff-design",
        type: "like",
        summary: "Someone liked a page",
      }),
      store,
    );
    expect(result).toEqual({ ok: false, error: "unregistered source/type", status: 400 });
    expect(await store.getStreamLength()).toBe(0);
  });

  test("HMAC ingest of an unknown source is rejected", async () => {
    const store = createMemoryActivityStore();
    const result = await ingestActivityEvent(
      baseEvent({
        source: "evil",
        type: "visit",
        summary: "Visit from Germany",
      }),
      store,
    );
    expect(result).toEqual({ ok: false, error: "unregistered source/type", status: 400 });
    expect(await store.getStreamLength()).toBe(0);
  });

  test("increments the lifetime count for ingested events", async () => {
    const store = createMemoryActivityStore();
    await ingestActivityEvent(baseEvent({ type: "ama_asked", summary: "Someone asked" }), store);
    expect(await store.getCount()).toBe(1);
  });

  test("stream MAXLEN drops the oldest events but the lifetime count keeps growing", async () => {
    const store = createMemoryActivityStore({ maxLen: 5 });
    for (let i = 0; i < 12; i++) {
      await ingestActivityEvent(baseEvent({ summary: `event ${i}` }), store);
    }
    expect(await store.getStreamLength()).toBe(5);
    expect(await store.getCount()).toBe(12);
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

  test("decodes percent-encoded city from HMAC visit meta", () => {
    const summary = formatVisitSummary(
      geoFromVisitMeta({
        city: "San%20Francisco",
        region: "CA",
        country: "US",
      }),
    );
    expect(summary).toContain("San Francisco");
    expect(summary).not.toContain("San%20Francisco");
  });

  test("omits placeholder region 00 so Belgrade is city + country", () => {
    const summary = formatVisitSummary({
      city: "Belgrade",
      region: "00",
      country: "RS",
    });
    expect(summary).toContain("Belgrade");
    expect(summary).toContain("Serbia");
    expect(summary).not.toContain("00");

    const fromStoredMeta = formatVisitSummary(
      geoFromVisitMeta({
        city: "Belgrade",
        region: "00",
        region_name: "00",
        country: "RS",
      }),
    );
    expect(fromStoredMeta).toContain("Belgrade");
    expect(fromStoredMeta).toContain("Serbia");
    expect(fromStoredMeta).not.toContain("00");
  });

  test("still includes a mapped US region for San Francisco", () => {
    const summary = formatVisitSummary({
      city: "San Francisco",
      region: "CA",
      country: "US",
    });
    expect(summary).toContain("San Francisco");
    expect(summary).toMatch(/California|\bCA\b/);
    expect(summary).not.toContain("00");
  });
});

describe("visitDisplaySummary", () => {
  test("drops a leading flag emoji and keeps the location text", () => {
    expect(visitDisplaySummary("🇺🇸 Visit from San Francisco, California, United States")).toBe(
      "Visit from San Francisco, California, United States",
    );
    expect(visitDisplaySummary("🇮🇳Visit from India")).toBe("Visit from India");
    expect(visitDisplaySummary("Visit from India")).toBe("Visit from India");
    expect(visitDisplaySummary(ANONYMOUS_VISIT_SUMMARY)).toBe(ANONYMOUS_VISIT_SUMMARY);
  });
});

describe("normalizeRegionCode", () => {
  test("returns undefined for placeholder all-zero codes", () => {
    expect(normalizeRegionCode("00")).toBeUndefined();
    expect(normalizeRegionCode("0")).toBeUndefined();
    expect(normalizeRegionCode("000")).toBeUndefined();
  });

  test("keeps a real ISO-3166-2 region code", () => {
    expect(normalizeRegionCode("CA")).toBe("CA");
    expect(normalizeRegionCode("nsw")).toBe("NSW");
  });
});

describe("recordVisit", () => {
  test("does not ingest a visit for /activity", async () => {
    const store = createMemoryActivityStore();
    const result = await recordVisit(
      { path: "/activity", title: "Activity | Brian Lovin", country: "US" },
      store,
    );
    expect(result).toEqual({ skipped: true, reason: "activity_path" });
    expect(await store.getStreamLength()).toBe(0);
    expect(await store.getCount()).toBe(0);
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
      label: "Grok Bot First Impressions",
      href: "/writing/grok-bot-first-impressions",
    });
    expect(event?.subject?.href).toBe("/writing/grok-bot-first-impressions");
    expect(event?.meta).toEqual({
      country: "IN",
      country_name: "India",
      path: "/writing/grok-bot-first-impressions",
      title: "Grok Bot First Impressions",
    });
    expect(getActivityRow(event!)).toEqual({
      summary: "Visit from India",
      href: "/writing/grok-bot-first-impressions",
      label: "Grok Bot First Impressions",
    });
    expect(event?.source).toBe("brios");
  });

  test("uses a provided title instead of inferring from the path", async () => {
    const store = createMemoryActivityStore();
    const result = await recordVisit(
      {
        path: "/writing/grok-bot-first-impressions",
        title: "  Grok Bot first impressions  ",
        country: "US",
      },
      store,
    );
    expect("ok" in result && result.ok).toBe(true);

    const [event] = await store.getTail(1);
    expect(event?.source).toBe("brios");
    expect(event?.subject).toEqual({
      kind: "writing",
      label: "Grok Bot first impressions",
      href: "/writing/grok-bot-first-impressions",
    });
    expect(event?.meta).toEqual(
      expect.objectContaining({
        path: "/writing/grok-bot-first-impressions",
        title: "Grok Bot first impressions",
      }),
    );
  });

  test("uses a client document title and strips the site suffix", async () => {
    const store = createMemoryActivityStore();
    const result = await recordVisit(
      {
        path: "/app-dissection/secret-for-ios",
        title: "Secret for iOS | Brian Lovin",
        country: "US",
      },
      store,
    );
    expect("ok" in result && result.ok).toBe(true);

    const [event] = await store.getTail(1);
    expect(event?.subject).toEqual({
      kind: "app_dissection",
      label: "Secret for iOS App Dissection",
      href: "/app-dissection/secret-for-ios",
    });
    expect(event?.meta).toEqual(
      expect.objectContaining({
        path: "/app-dissection/secret-for-ios",
        title: "Secret for iOS App Dissection",
      }),
    );
    expect(getActivityRow(event!).label).toBe("Secret for iOS App Dissection");
  });

  test("uses a client title for writing, home, HN, and TIL", async () => {
    const store = createMemoryActivityStore();

    await recordVisit(
      { path: "/writing/grok-bot-first-impressions", title: "Grok Bot first impressions" },
      store,
    );
    await recordVisit({ path: "/", title: "Brian Lovin" }, store);
    await recordVisit({ path: "/hn/46993596", title: "A story about iOS | Brian Lovin" }, store);
    await recordVisit(
      { path: "/til/cache-headers-B57IXLJ", title: "Cache Headers | Brian Lovin" },
      store,
    );

    const events = await store.getTail(4);
    expect(events.map((event) => event.subject?.label)).toEqual([
      "Cache Headers",
      "A story about iOS",
      "Home",
      "Grok Bot first impressions",
    ]);
  });

  test("does not accept a visit title that looks like PII", async () => {
    const store = createMemoryActivityStore();
    await recordVisit(
      {
        path: "/app-dissection/secret-for-ios",
        title: "email me at test@example.com | Brian Lovin",
        country: "US",
      },
      store,
    );
    const [event] = await store.getTail(1);
    expect(event?.subject?.label).toBe("Secret for iOS App Dissection");
    expect(event?.meta).toEqual(
      expect.objectContaining({ title: "Secret for iOS App Dissection" }),
    );
    expect(getActivityRow(event!).label).toBe("Secret for iOS App Dissection");
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
    expect(lookupHnStoryTitleSpy).toHaveBeenCalledWith("46993596");
  });

  test("looks up an HN story title at ingest when the client title is generic or empty", async () => {
    lookupHnStoryTitleSpy.mockResolvedValue("Some HN Story");

    const store = createMemoryActivityStore();
    await recordVisit({ path: "/hn/42991019", title: "Hacker News" }, store);
    await recordVisit({ path: "/hn/42991019" }, store);

    const events = await store.getTail(2);
    expect(events.map((event) => event.subject?.label)).toEqual(["Some HN Story", "Some HN Story"]);
    expect(lookupHnStoryTitleSpy).toHaveBeenCalledWith("42991019");
    expect(getActivityRow(events[0]!).label).toBe("Some HN Story");
    expect(getActivityRow(events[0]!).label).not.toBe("a Hacker News story");
  });

  test("does not look up an HN story when the client already sent a real title", async () => {
    lookupHnStoryTitleSpy.mockResolvedValue("Ignored lookup title");
    const store = createMemoryActivityStore();
    await recordVisit({ path: "/hn/42991019", title: "A story about iOS | Brian Lovin" }, store);
    const [event] = await store.getTail(1);
    expect(event?.subject?.label).toBe("A story about iOS");
    expect(lookupHnStoryTitleSpy).not.toHaveBeenCalled();
  });

  test("resolveIngestVisitTitle uses the mocked HN helper for a generic title", async () => {
    lookupHnStoryTitleSpy.mockResolvedValue("Some HN Story");
    await expect(resolveIngestVisitTitle("/hn/42991019", "Hacker News")).resolves.toBe(
      "Some HN Story",
    );
    await expect(resolveIngestVisitTitle("/hn/42991019", "")).resolves.toBe("Some HN Story");
    await expect(resolveIngestVisitTitle("/hn/42991019", "42991019")).resolves.toBe(
      "Some HN Story",
    );
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
      label: "Grok Bot First Impressions",
      href: "/writing/grok-bot-first-impressions-kcJun01",
    });
    expect(event?.meta).toEqual(expect.objectContaining({ title: "Grok Bot First Impressions" }));
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

  test("does not prefix a flag in getActivityRow for older visits that lack the emoji", () => {
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
    });
    expect(row.summary).not.toMatch(/\p{Regional_Indicator}/u);
  });

  test("strips a stored flag from leftover first-country stream rows", () => {
    const row = getActivityRow({
      v: 1,
      id: "old-first",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "visit_country_first",
      speed: "event",
      summary: "🇮🇳 First visit from IN",
      visibility: "public",
      idempotency_key: "old-first",
      meta: { country: "IN" },
    });
    expect(row).toEqual({
      summary: "First visit from IN",
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
    expect(await store.getCount()).toBe(3);
  });

  test("does not ingest a visit for /activity/nested", async () => {
    const store = createMemoryActivityStore();
    await recordVisit({ path: "/activity/nested" }, store);
    expect(await store.getCount()).toBe(0);
  });

  test("increments the count for every visit but samples stream inserts", async () => {
    const store = createMemoryActivityStore();
    const now = new Date("2026-08-16T12:00:00.000Z");
    const burst = ACTIVITY_VISIT_STREAM_MAX_PER_SEC + 25;

    for (let i = 0; i < burst; i++) {
      const result = await recordVisit({ path: "/writing", country: "DE" }, store, now);
      expect("ok" in result && result.ok).toBe(true);
    }

    expect(await store.getCount()).toBe(burst);
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
    expect(await store.getCount()).toBe(2);
  });
});

describe("HMAC download ingest", () => {
  test("fills a missing download summary from the source label", async () => {
    const store = createMemoryActivityStore();
    const result = await ingestActivityEvent(
      {
        source: "tax-ui",
        type: "download",
        idempotency_key: "hmac:tax-ui:download:1",
        meta: { platform: "mac" },
      },
      store,
    );
    expect(result.ok && !result.duplicate).toBe(true);

    const [event] = await store.getTail(1);
    expect(event?.type).toBe("download");
    expect(event?.speed).toBe("event");
    expect(event?.visibility).toBe("public");
    expect(event?.source).toBe("tax-ui");
    expect(event?.summary).toBe("Someone downloaded Tax UI");
    expect(event?.subject).toEqual({ kind: "download", label: "Tax UI" });
    expect(event?.meta).toEqual({ platform: "mac" });
    expect(JSON.stringify(event)).not.toMatch(/https?:\/\//);
  });

  test("counts HMAC-ingested download events toward the lifetime count", async () => {
    const store = createMemoryActivityStore();
    const result = await ingestActivityEvent(
      {
        source: "shiori",
        type: "download",
        speed: "event",
        summary: "Someone downloaded Shiori",
        visibility: "public",
        idempotency_key: "hmac:download:1",
        subject: { kind: "download", label: "Shiori" },
      },
      store,
    );
    expect(result.ok && !result.duplicate).toBe(true);
    expect(await store.getCount()).toBe(1);
    expect(getActivityRow((await store.getTail(1))[0]!)).toEqual({
      summary: "Someone downloaded",
      href: "https://www.shiori.sh",
      label: "Shiori",
    });
  });

  test("accepts HMAC Shiori link_clicked without subject, url, or meta", async () => {
    const store = createMemoryActivityStore();
    const result = await ingestActivityEvent(
      {
        source: "shiori",
        type: "link_clicked",
        idempotency_key: "hmac:shiori:link_clicked:1",
      },
      store,
    );

    expect(result.ok && !result.duplicate).toBe(true);
    const [event] = await store.getTail(1);
    expect(event?.source).toBe("shiori");
    expect(event?.type).toBe("link_clicked");
    expect(event?.speed).toBe("event");
    expect(event?.summary).toBe("Someone clicked a link on Shiori");
    expect(event?.subject).toBeUndefined();
    expect(event?.meta).toBeUndefined();
    expect(event?.actor).toBeUndefined();
    expect(JSON.stringify(event)).not.toMatch(/https?:\/\//);
    expect(getActivityRow(event!)).toEqual({
      summary: "Someone clicked a link",
      href: "https://www.shiori.sh",
      label: "Shiori",
    });
  });

  test("does not leak a subject URL from a Shiori link_clicked row", async () => {
    const store = createMemoryActivityStore();
    const result = await ingestActivityEvent(
      {
        source: "shiori",
        type: "link_clicked",
        summary: "Someone clicked a link on Shiori",
        idempotency_key: "hmac:shiori:link_clicked:url",
        subject: { kind: "link", label: "A saved page", href: "https://example.com/secret" },
      },
      store,
    );

    expect(result.ok && !result.duplicate).toBe(true);
    const row = getActivityRow((await store.getTail(1))[0]!);
    expect(row).toEqual({
      summary: "Someone clicked a link",
      href: "https://www.shiori.sh",
      label: "Shiori",
    });
    expect(JSON.stringify(row)).not.toContain("example.com");
  });
});

describe("activity source helpers", () => {
  test("maps sources to favicon paths", () => {
    expect(activitySourceFaviconSrc("brios")).toBe("/activity/favicons/brios.png");
    expect(activitySourceFaviconSrc("tax-ui")).toBe("/activity/favicons/tax-ui.png");
    expect(activitySourceFaviconSrc("staff-design")).toBe("/activity/favicons/staff-design.png");
    expect(activitySourceFaviconSrc("design-details")).toBe(
      "/activity/favicons/design-details.png",
    );
    expect(activitySourceFaviconSrc("shiori")).toBe("/img/shiori-icon.png");
    expect(activitySourceFaviconSrc("github")).toBeUndefined();
  });

  test("formats download summary copy from the source slug", () => {
    expect(formatDownloadSummary("tax-ui")).toBe("Someone downloaded Tax UI");
    expect(formatDownloadSummary("shiori")).toBe("Someone downloaded Shiori");
    expect(formatDownloadSummary("staff-design")).toBe("Someone downloaded Staff Design");
    expect(formatDownloadSummary("design-details")).toBe("Someone downloaded Design Details");
  });

  test("maps external sources to home URLs", () => {
    expect(activitySourceUrl("tax-ui")).toBe("https://tax-ui.brianlovin.com/");
    expect(activitySourceUrl("staff-design")).toBe("https://staff.design");
    expect(activitySourceUrl("design-details")).toBe("https://designdetails.fm");
    expect(activitySourceUrl("shiori")).toBe("https://www.shiori.sh");
    expect(activitySourceUrl("github")).toBe("https://github.com/brianlovin");
    expect(activitySourceUrl("brios")).toBeUndefined();
  });

  test("resolves relative subject hrefs against the source home", () => {
    expect(resolveActivitySourceHref("design-details", "/episodes/1")).toBe(
      "https://designdetails.fm/episodes/1",
    );
    expect(resolveActivitySourceHref("github", "https://github.com/brianlovin/briOS/pull/1")).toBe(
      "https://github.com/brianlovin/briOS/pull/1",
    );
    expect(resolveActivitySourceHref("brios", "/writing/a-post")).toBe("/writing/a-post");
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
    expect(await store.getCount()).toBe(0);
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
      summary: "Someone liked",
      href: "https://cursor.com",
      label: "Cursor",
    });
  });

  test("formats a slug-like like title and strips a site suffix", async () => {
    const store = createMemoryActivityStore();
    const result = await recordLike(
      {
        title: "secret for ios | Brian Lovin",
        href: "/app-dissection/secret-for-ios",
        content_type: "app_dissection",
      },
      store,
    );
    expect("ok" in result && result.ok).toBe(true);
    const [event] = await store.getTail(1);
    expect(event?.summary).toBe("Someone liked Secret for iOS App Dissection");
    expect(event?.subject?.label).toBe("Secret for iOS App Dissection");
    expect(getActivityRow(event!).summary).toBe("Someone liked");
    expect(getActivityRow(event!).label).toBe("Secret for iOS App Dissection");
  });

  test("does not store a like title that looks like PII", async () => {
    const store = createMemoryActivityStore();
    await recordLike(
      {
        title: "email me at test@example.com",
        href: "/writing/hello-world",
        content_type: "writing",
      },
      store,
    );
    const [event] = await store.getTail(1);
    expect(event?.summary).toBe("Someone liked Hello World");
    expect(event?.subject?.label).toBe("Hello World");
    expect(event?.summary).not.toContain("@");
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

  test("omits placeholder Vercel region 00", () => {
    const geo = getRequestGeo(
      new Headers({
        "x-vercel-ip-country": "RS",
        "x-vercel-ip-country-region": "00",
        "x-vercel-ip-city": "Belgrade",
      }),
    );
    expect(geo).toEqual({
      country: "RS",
      countryName: "Serbia",
      city: "Belgrade",
    });
    expect(geo).not.toHaveProperty("region");
    expect(geo).not.toHaveProperty("regionName");
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

  test("parses absolute http(s) URLs instead of treating the scheme as a path", () => {
    const title = inferTitleFromPath("https://github.com/foo/bar/pull/1");
    expect(title).not.toBe("https:");
    expect(title).not.toMatch(/^https?:/i);
    expect(inferTitleFromPath("https://brianlovin.com/writing/foo")).toBe("foo");
    expect(inferTitleFromPath("https://brianlovin.com/writing")).toBe("Writing");
  });
});

describe("pathnameFromHref", () => {
  test("returns the URL pathname for absolute http(s) hrefs", () => {
    expect(pathnameFromHref("https://brianlovin.com/writing/foo")).toBe("/writing/foo");
    expect(pathnameFromHref("https://github.com/foo/bar/pull/1")).toBe("/foo/bar/pull/1");
    expect(pathnameFromHref("/writing/foo")).toBe("/writing/foo");
  });
});

describe("activitySectionFromPath", () => {
  test("maps site paths to the first segment", () => {
    expect(activitySectionFromPath("/")).toBe("home");
    expect(activitySectionFromPath("/ama/2f2c711c-0ceb-810d-899d-e5feb99e70f4")).toBe("ama");
    expect(activitySectionFromPath(undefined)).toBe("");
  });

  test("uses the URL pathname for absolute GitHub hrefs, never https:", () => {
    const section = activitySectionFromPath("https://github.com/foo/bar/pull/1");
    expect(["foo", "bar", "pull"]).toContain(section);
    expect(section).not.toBe("https:");
  });

  test("uses the URL pathname for absolute briOS visit hrefs, never https:", () => {
    expect(activitySectionFromPath("https://brianlovin.com/writing/foo")).toBe("writing");
    expect(activitySectionFromPath("https://brianlovin.com/writing/foo")).not.toBe("https:");
  });
});

describe("sanitizeVisitTitle / formatActivityTitle", () => {
  test("client title wins over the slug and strips Brian Lovin suffixes", () => {
    expect(
      sanitizeVisitTitle("Secret for iOS | Brian Lovin", "/app-dissection/secret-for-ios"),
    ).toBe("Secret for iOS App Dissection");
    expect(
      sanitizeVisitTitle("Secret for iOS – Brian Lovin", "/app-dissection/secret-for-ios"),
    ).toBe("Secret for iOS App Dissection");
    expect(
      sanitizeVisitTitle("Secret for iOS — Brian Lovin", "/app-dissection/secret-for-ios"),
    ).toBe("Secret for iOS App Dissection");
    expect(
      sanitizeVisitTitle("Secret for iOS - App Dissection", "/app-dissection/secret-for-ios"),
    ).toBe("Secret for iOS App Dissection");
  });

  test("falls back to the path title when the client title is missing or PII", () => {
    expect(sanitizeVisitTitle(undefined, "/app-dissection/secret-for-ios")).toBe(
      "Secret for iOS App Dissection",
    );
    expect(sanitizeVisitTitle("   ", "/app-dissection/secret-for-ios")).toBe(
      "Secret for iOS App Dissection",
    );
    expect(sanitizeVisitTitle("a@b.com", "/app-dissection/secret-for-ios")).toBe(
      "Secret for iOS App Dissection",
    );
    expect(sanitizeVisitTitle("Brian Lovin", "/")).toBe("Home");
    expect(sanitizeVisitTitle("Home | Brian Lovin", "/")).toBe("Home");
    expect(shouldRecordVisit("/activity")).toBe(false);
  });

  test("puts App Dissection back on child routes after stripping the site suffix", () => {
    expect(
      sanitizeVisitTitle(
        "Instagram – App Dissection | Brian Lovin",
        "/app-dissection/instagram-ios",
      ),
    ).toBe("Instagram App Dissection");
    expect(sanitizeVisitTitle(undefined, "/app-dissection/instagram-ios")).toBe(
      "Instagram iOS App Dissection",
    );
    expect(sanitizeVisitTitle("App Dissection", "/app-dissection")).toBe("App Dissection");
    expect(sanitizeVisitTitle("Hacker News", "/hn")).toBe("Hacker News");
    expect(sanitizeVisitTitle("Hacker News", "/hn/42991019")).toBe("a Hacker News story");
    expect(sanitizeVisitTitle("Some HN Story", "/hn/42991019")).toBe("Some HN Story");
  });

  test("strips a site suffix from a document title", () => {
    expect(stripSiteTitleSuffix("Secret for iOS | Brian Lovin")).toBe("Secret for iOS");
    expect(stripSiteTitleSuffix("Writing | Brian Lovin")).toBe("Writing");
  });

  test("title-cases a de-hyphenated slug and leaves a capped title alone", () => {
    expect(formatActivityTitle("secret for ios")).toBe("Secret for iOS");
    expect(formatActivityTitle("grok bot first impressions")).toBe("Grok Bot First Impressions");
    expect(formatActivityTitle("Secret for iOS")).toBe("Secret for iOS");
    expect(formatActivityTitle("https:")).toBe("https:");
    expect(formatActivityTitle("https:")).not.toBe("Https:");
  });
});

describe("getActivityRow page titles", () => {
  test("infers a writing visit title from an absolute briOS href", () => {
    const stored = getActivityRow({
      v: 1,
      id: "abs-writing",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "visit",
      speed: "signal",
      summary: "Visit from San Francisco, California, United States",
      visibility: "public",
      idempotency_key: "abs-writing",
      subject: {
        kind: "writing",
        label: "Grok Bot First Impressions",
        href: "https://brianlovin.com/writing/foo",
      },
      meta: { path: "https://brianlovin.com/writing/foo", country: "US", city: "San Francisco" },
    });
    expect(activitySectionFromPath(stored.href)).toBe("writing");
    expect(stored.label).toBe("Grok Bot First Impressions");
    expect(stored.label).not.toBe("Https:");
    expect(stored.label).not.toBe("https:");

    const inferred = getActivityRow({
      v: 1,
      id: "abs-writing-page",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "visit",
      speed: "signal",
      summary: "Visit from San Francisco, California, United States",
      visibility: "public",
      idempotency_key: "abs-writing-page",
      subject: {
        kind: "writing",
        label: "a page",
        href: "https://brianlovin.com/writing/foo",
      },
    });
    expect(inferred.label).toBe("Foo");
    expect(inferred.label).not.toMatch(/^https?:/i);

    const sectionRoot = getActivityRow({
      v: 1,
      id: "abs-writing-root",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "visit",
      speed: "signal",
      summary: "Visit from San Francisco, California, United States",
      visibility: "public",
      idempotency_key: "abs-writing-root",
      subject: { kind: "writing", label: "https:", href: "https://brianlovin.com/writing" },
    });
    expect(sectionRoot.label).toBe("Writing");
    expect(sectionRoot.label).not.toBe("Https:");
  });

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
    expect(row.label).toBe("Grok Bot First Impressions");
    expect(row.href).toBe("/writing/grok-bot-first-impressions-kcJun01");
  });

  test("title-cases a stored de-hyphenated slug without rewriting Redis", () => {
    const row = getActivityRow({
      v: 1,
      id: "old-dissection",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "visit",
      speed: "signal",
      summary: "Visit from France",
      visibility: "public",
      idempotency_key: "old-dissection",
      subject: {
        kind: "app_dissection",
        label: "secret for ios",
        href: "/app-dissection/secret-for-ios",
      },
    });
    expect(row.label).toBe("Secret for iOS App Dissection");
    expect(row.href).toBe("/app-dissection/secret-for-ios");
  });

  test("labels an HN index visit as Hacker News, not a story", () => {
    for (const href of ["/hn", "/hn/"]) {
      const row = getActivityRow({
        v: 1,
        id: "hn-index",
        ts: "2026-08-16T00:00:00.000Z",
        received_at: "2026-08-16T00:00:00.000Z",
        source: "brios",
        type: "visit",
        speed: "signal",
        summary: "Visit from San Francisco, California, United States",
        visibility: "public",
        idempotency_key: "hn-index",
        subject: { kind: "page", label: "a page", href },
        meta: { path: href, country: "US", city: "San Francisco" },
      });
      expect(row.label).toBe("Hacker News");
      expect(row.href).toBe(href);
      expect(row.label).not.toBe("a Hacker News story");
    }
  });

  test("labels an app dissection post as the post name plus App Dissection", () => {
    const fromSlug = getActivityRow(
      visitRowEvent({
        kind: "app_dissection",
        label: "a page",
        href: "/app-dissection/instagram-ios",
      }),
    );
    expect(fromSlug.label).toBe("Instagram iOS App Dissection");
    expect(fromSlug.href).toBe("/app-dissection/instagram-ios");
    expect(fromSlug.label).not.toBe("Instagram");

    const fromStored = getActivityRow(
      visitRowEvent({
        kind: "app_dissection",
        label: "Instagram",
        href: "/app-dissection/instagram-ios",
      }),
    );
    expect(fromStored.label).toBe("Instagram App Dissection");
    expect(fromStored.href).toBe("/app-dissection/instagram-ios");
    expect(fromStored.label).not.toBe("Instagram");

    const alreadySuffixed = getActivityRow(
      visitRowEvent({
        kind: "app_dissection",
        label: "Instagram iOS App Dissection",
        href: "/app-dissection/instagram-ios",
      }),
    );
    expect(alreadySuffixed.label).toBe("Instagram iOS App Dissection");

    const index = getActivityRow(
      visitRowEvent({ kind: "app_dissection", label: "a page", href: "/app-dissection" }),
    );
    expect(index.label).toBe("App Dissection");
    expect(index.href).toBe("/app-dissection");
  });

  test("uses a stored HN story title instead of the generic phrase", () => {
    const row = getActivityRow(
      visitRowEvent({
        kind: "page",
        label: "Some HN Story",
        href: "/hn/42991019",
      }),
    );
    expect(row.label).toBe("Some HN Story");
    expect(row.href).toBe("/hn/42991019");
    expect(row.label).not.toBe("a Hacker News story");
    expect(row.label).not.toBe("42991019");
  });

  test("falls back to a Hacker News story when the stored title is generic", () => {
    for (const label of ["Hacker News", "a Hacker News story", "a page", ""]) {
      const row = getActivityRow(
        visitRowEvent({
          kind: "page",
          label,
          href: "/hn/42991019",
        }),
      );
      expect(row.label).toBe("a Hacker News story");
      expect(row.href).toBe("/hn/42991019");
      expect(row.label).not.toBe("42991019");
    }
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

  test("splits a stored Home like into Someone liked plus a Home label", () => {
    const row = getActivityRow({
      v: 1,
      id: "like-home",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "like",
      speed: "event",
      summary: "Someone liked a page",
      visibility: "public",
      idempotency_key: "like-home",
      subject: { kind: "home", label: "a page", href: "/" },
    });
    expect(row).toEqual({
      summary: "Someone liked",
      href: "/",
      label: "Home",
    });
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
      summary: "Someone liked",
      href: "/stack",
      label: "Cursor",
    });
  });

  test("title-cases a stored like slug without rewriting Redis", () => {
    const row = getActivityRow({
      v: 1,
      id: "like-slug",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "brios",
      type: "like",
      speed: "event",
      summary: "Someone liked grok bot first impressions",
      visibility: "public",
      idempotency_key: "like-slug",
      subject: {
        kind: "writing",
        label: "grok bot first impressions",
        href: "/writing/grok-bot-first-impressions",
      },
    });
    expect(row).toEqual({
      summary: "Someone liked",
      href: "/writing/grok-bot-first-impressions",
      label: "Grok Bot First Impressions",
    });
  });
});

describe("getActivityRow source metadata", () => {
  function rowEvent(overrides: Partial<ActivityEvent>): ActivityEvent {
    return {
      v: 1,
      id: "src-row",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "shiori",
      type: "link_saved",
      speed: "event",
      summary: "Someone saved a link on Shiori",
      visibility: "public",
      idempotency_key: "src-row",
      ...overrides,
    };
  }

  test("lifts Shiori out of save/click/signup/subscribe/download summaries", () => {
    expect(getActivityRow(rowEvent({ type: "link_saved" }))).toEqual({
      summary: "Someone saved a link",
      href: "https://www.shiori.sh",
      label: "Shiori",
    });
    expect(
      getActivityRow(
        rowEvent({
          type: "link_clicked",
          summary: "Someone clicked a link on Shiori",
          subject: { kind: "link", label: "A saved page", href: "https://example.com/secret" },
        }),
      ),
    ).toEqual({
      summary: "Someone clicked a link",
      href: "https://www.shiori.sh",
      label: "Shiori",
    });
    expect(
      getActivityRow(
        rowEvent({
          type: "signed_up",
          summary: "Someone signed up for Shiori",
        }),
      ),
    ).toEqual({
      summary: "Someone signed up",
      href: "https://www.shiori.sh",
      label: "Shiori",
    });
    expect(
      getActivityRow(
        rowEvent({
          type: "subscription_started",
          summary: "Someone subscribed on Shiori",
        }),
      ),
    ).toEqual({
      summary: "Someone subscribed",
      href: "https://www.shiori.sh",
      label: "Shiori",
    });
    expect(
      getActivityRow(
        rowEvent({
          type: "download",
          summary: "Someone downloaded Shiori",
          subject: { kind: "download", label: "Shiori" },
        }),
      ),
    ).toEqual({
      summary: "Someone downloaded",
      href: "https://www.shiori.sh",
      label: "Shiori",
    });
  });

  test("uses the product home for an external visit without a better page href", () => {
    expect(
      getActivityRow(
        rowEvent({
          source: "design-details",
          type: "visit",
          speed: "signal",
          summary: "🇺🇸 Visit from United States",
          subject: { kind: "home", label: "Home", href: "/" },
          meta: { country: "US", path: "/", title: "Home" },
        }),
      ),
    ).toEqual({
      summary: "Visit from United States",
      href: "https://designdetails.fm",
      label: "Design Details",
    });
  });

  test("keeps a more specific staff.design page href instead of the product home", () => {
    expect(
      getActivityRow(
        rowEvent({
          source: "staff-design",
          type: "visit",
          speed: "signal",
          summary: "🇩🇪 Visit from Germany",
          subject: {
            kind: "page",
            label: "Karla Mickens Cole",
            href: "/karla-mickens-cole",
          },
          meta: { country: "DE", path: "/karla-mickens-cole", title: "Karla Mickens Cole" },
        }),
      ),
    ).toEqual({
      summary: "Visit from Germany",
      href: "/karla-mickens-cole",
      label: "Karla Mickens Cole",
    });
  });

  test("keeps a public GitHub PR href instead of github.com/brianlovin", () => {
    expect(
      getActivityRow(
        rowEvent({
          source: "github",
          type: "pr_opened",
          summary: "Opened a pull request on briOS",
          subject: {
            kind: "pull_request",
            label: "Add activity feed",
            href: "https://github.com/brianlovin/briOS/pull/42",
          },
        }),
      ),
    ).toEqual({
      summary: "Opened a pull request on briOS",
      href: "https://github.com/brianlovin/briOS/pull/42",
      label: "Add activity feed",
    });
  });

  test("does not rewrite a first-party like or visit to briOS", () => {
    expect(
      getActivityRow(
        rowEvent({
          source: "brios",
          type: "like",
          summary: "Someone liked Cursor",
          subject: { kind: "stack", label: "Cursor", href: "https://cursor.com" },
        }),
      ),
    ).toEqual({
      summary: "Someone liked",
      href: "https://cursor.com",
      label: "Cursor",
    });
    expect(
      getActivityRow(
        rowEvent({
          source: "brios",
          type: "visit",
          speed: "signal",
          summary: "🇮🇳 Visit from India",
          subject: {
            kind: "writing",
            label: "Grok Bot first impressions",
            href: "/writing/grok-bot-first-impressions",
          },
          meta: { country: "IN", path: "/writing/grok-bot-first-impressions" },
        }),
      ),
    ).toEqual({
      summary: "Visit from India",
      href: "/writing/grok-bot-first-impressions",
      label: "Grok Bot first impressions",
    });
  });
});

describe("getActivityRow private pull requests", () => {
  function prEvent(overrides: Partial<ActivityEvent> = {}): ActivityEvent {
    return {
      v: 1,
      id: "pr",
      ts: "2026-08-16T00:00:00.000Z",
      received_at: "2026-08-16T00:00:00.000Z",
      source: "github",
      type: "pr_opened",
      speed: "event",
      summary: "Opened a pull request",
      visibility: "public",
      idempotency_key: "pr",
      ...overrides,
    };
  }

  test("rewrites a stored private opened PR to a single phrase", () => {
    const row = getActivityRow(
      prEvent({
        subject: { kind: "pull_request", label: "a pull request" },
        meta: { private: true, number: 1 },
      }),
    );
    expect(row).toEqual({ summary: "Opened a pull request in a private repo" });
    expect(JSON.stringify(row)).not.toContain("A Pull Request");
  });

  test("rewrites a stored private merged PR to a single phrase", () => {
    const row = getActivityRow(
      prEvent({
        type: "pr_merged",
        summary: "Merged a pull request",
        subject: { kind: "pull_request", label: "a pull request" },
        meta: { private: true, number: 2, additions: 12, deletions: 3 },
      }),
    );
    expect(row).toEqual({ summary: "Merged a pull request in a private repo" });
    expect(JSON.stringify(row)).not.toContain("A Pull Request");
  });

  test("rewrites a new private PR that has no subject", () => {
    const row = getActivityRow(
      prEvent({
        summary: "Opened a pull request in a private repo",
        meta: { private: true, number: 1 },
      }),
    );
    expect(row).toEqual({ summary: "Opened a pull request in a private repo" });
  });

  test("rewrites a dummy subject even without meta.private", () => {
    const row = getActivityRow(
      prEvent({
        subject: { kind: "pull_request", label: "a pull request" },
      }),
    );
    expect(row).toEqual({ summary: "Opened a pull request in a private repo" });
  });

  test("keeps a public PR repo name and real title", () => {
    const row = getActivityRow(
      prEvent({
        summary: "Opened a pull request on briOS",
        subject: {
          kind: "pull_request",
          label: "Add activity feed",
          href: "https://github.com/brianlovin/briOS/pull/42",
        },
        meta: {
          repo: "briOS",
          title: "Add activity feed",
          number: 42,
          href: "https://github.com/brianlovin/briOS/pull/42",
        },
      }),
    );
    expect(row).toEqual({
      summary: "Opened a pull request on briOS",
      href: "https://github.com/brianlovin/briOS/pull/42",
      label: "Add activity feed",
    });
  });

  test("does not invent a site-path title from a GitHub html_url", () => {
    const row = getActivityRow(
      prEvent({
        summary: "Merged a pull request on designdetails",
        subject: {
          kind: "pull_request",
          label: "Fix player skip",
          href: "https://github.com/designdetails/designdetails/pull/719",
        },
        meta: {
          repo: "designdetails",
          title: "Fix player skip",
          number: 719,
          href: "https://github.com/designdetails/designdetails/pull/719",
        },
      }),
    );
    expect(row.label).toBe("Fix player skip");
    expect(row.href).toBe("https://github.com/designdetails/designdetails/pull/719");
    expect(row.label).not.toBe("https:");
    expect(JSON.stringify(row)).not.toContain("/https:");
  });

  test("falls back to repo#number when the public PR title is missing", () => {
    const row = getActivityRow(
      prEvent({
        summary: "Opened a pull request on briOS",
        subject: {
          kind: "pull_request",
          label: "a pull request",
          href: "https://github.com/brianlovin/briOS/pull/42",
        },
        meta: { repo: "briOS", number: 42, href: "https://github.com/brianlovin/briOS/pull/42" },
      }),
    );
    expect(row).toEqual({
      summary: "Opened a pull request on briOS",
      href: "https://github.com/brianlovin/briOS/pull/42",
      label: "briOS#42",
    });
  });

  test("falls back to a pull request when title and repo number are missing", () => {
    const row = getActivityRow(
      prEvent({
        summary: "Opened a pull request on briOS",
        subject: {
          kind: "pull_request",
          label: "",
          href: "https://github.com/brianlovin/briOS/pull/42",
        },
      }),
    );
    expect(row.label).toBe("a pull request");
    expect(row.href).toBe("https://github.com/brianlovin/briOS/pull/42");
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
      title: "Hello World",
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

  test("strips a document title suffix and formats a slug fallback", () => {
    expect(
      likeActivityPayload(
        {},
        { title: "Grok Bot first impressions | Brian Lovin", href: "/writing/hello-world" },
      ),
    ).toEqual({
      title: "Grok Bot first impressions",
      href: "/writing/hello-world",
      content_type: "writing",
    });

    expect(likeActivityPayload({}, { href: "/writing/hello-world" })).toEqual({
      title: "Hello World",
      href: "/writing/hello-world",
      content_type: "writing",
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

  test("stacks two SF visits to the HN index as Hacker News", () => {
    const sfHn = (id: string, href = "/hn"): ActivityEvent =>
      feedEvent({
        id,
        type: "visit",
        summary: "Visit from San Francisco, California, United States",
        subject: { kind: "page", label: "a page", href },
        meta: {
          country: "US",
          country_name: "United States",
          region: "CA",
          region_name: "California",
          city: "San Francisco",
          path: href,
        },
      });

    const stacks = rollupActivityEvents([sfHn("hn-1"), sfHn("hn-2")]);
    expect(stacks).toHaveLength(1);
    expect(stacks[0]?.count).toBe(2);
    expect(stacks[0]?.sectionLabel).toBe("Hacker News");
    expect(stacks[0]?.sectionLabel).not.toBe("a Hacker News story");
    expect(stacks[0]?.href).toBe("/hn");
    expect(getActivityRow(stacks[0]!.latest).label).toBe("Hacker News");

    const mixed = rollupActivityEvents([sfHn("hn-index", "/hn"), sfHn("hn-story", "/hn/123")]);
    expect(mixed).toHaveLength(1);
    expect(mixed[0]?.count).toBe(2);
    expect(mixed[0]?.sectionLabel).toBe("Hacker News");
    expect(mixed[0]?.href).toBe("/hn");
    expect(getActivityRow(sfHn("hn-story", "/hn/123")).label).toBe("a Hacker News story");
  });

  test("does not show Https: when stacking SF visits with different absolute URLs", () => {
    const sfVisit = (id: string, href: string, label: string): ActivityEvent =>
      feedEvent({
        id,
        type: "visit",
        summary: "Visit from San Francisco, California, United States",
        subject: { kind: "page", label, href },
        meta: {
          country: "US",
          country_name: "United States",
          region: "CA",
          region_name: "California",
          city: "San Francisco",
          path: href,
        },
      });

    const sameSection = rollupActivityEvents([
      sfVisit("sf-1", "https://brianlovin.com/writing/foo", "Foo"),
      sfVisit("sf-2", "https://brianlovin.com/writing/bar", "Bar"),
    ]);
    expect(sameSection).toHaveLength(1);
    expect(sameSection[0]?.key).toBe("visit:san francisco, california, united states:writing");
    expect(sameSection[0]?.sectionLabel).toBe("Writing");
    expect(sameSection[0]?.sectionLabel).not.toBe("Https:");
    expect(sameSection[0]?.sectionLabel).not.toBe("https:");
    expect(sameSection[0]?.href).toBe("https://brianlovin.com/writing/foo");
    expect(sameSection[0]?.href).not.toBe("/https:");

    const mixedSection = rollupActivityEvents([
      sfVisit("sf-w", "https://brianlovin.com/writing/foo", "Foo"),
      sfVisit("sf-t", "https://brianlovin.com/til/cache-headers", "cache headers"),
    ]);
    expect(mixedSection).toHaveLength(2);
    for (const stack of mixedSection) {
      expect(stack.sectionLabel).not.toBe("Https:");
      expect(stack.sectionLabel).not.toBe("https:");
      expect(stack.href).not.toBe("/https:");
    }
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
    expect(stacks[1]?.sectionLabel).toBe("Grok Bot First Impressions");
  });

  test("starts a fresh Shiori stack after an interrupting visit", () => {
    const shiori = (id: string): ActivityEvent =>
      feedEvent({
        id,
        source: "shiori",
        type: "link_saved",
        summary: "Someone saved a link on Shiori",
      });
    const visit = springLakeVisit("visit-sf", "/");
    const older = Array.from({ length: 15 }, (_, index) => shiori(`old-${index + 1}`));

    expect(rollupActivityEvents(older).map((stack) => stack.count)).toEqual([15]);

    const afterVisit = rollupActivityEvents([visit, ...older]);
    expect(afterVisit.map((stack) => stack.count)).toEqual([1, 15]);
    expect(afterVisit[0]?.key).toBe("visit:spring lake, north carolina, united states:home");
    expect(afterVisit[1]?.key).toBe("shiori:link_saved");

    const afterSave = rollupActivityEvents([shiori("new-1"), visit, ...older]);
    expect(afterSave.map((stack) => stack.count)).toEqual([1, 1, 15]);
    expect(afterSave[0]?.key).toBe("shiori:link_saved");
    expect(afterSave[0]?.latest.id).toBe("new-1");
    expect(afterSave[2]?.latest.id).toBe("old-1");
    expect(activityStackReactKey(afterSave[0]!)).not.toBe(activityStackReactKey(afterSave[2]!));
  });

  test("16 / visit / 15 is only correct when those runs were actually consecutive", () => {
    const shiori = (id: string): ActivityEvent =>
      feedEvent({
        id,
        source: "shiori",
        type: "link_saved",
        summary: "Someone saved a link on Shiori",
      });
    const visit = springLakeVisit("visit-sf", "/");
    const newest = Array.from({ length: 16 }, (_, index) => shiori(`new-${index + 1}`));
    const older = Array.from({ length: 15 }, (_, index) => shiori(`old-${index + 1}`));

    const stacks = rollupActivityEvents([...newest, visit, ...older]);
    expect(stacks.map((stack) => stack.count)).toEqual([16, 1, 15]);
    expect(activityStackReactKey(stacks[0]!)).not.toBe(activityStackReactKey(stacks[2]!));
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

  test("stacks consecutive Shiori link_clicked events separately from saves", () => {
    const click = (id: string): ActivityEvent =>
      feedEvent({
        id,
        source: "shiori",
        type: "link_clicked",
        summary: "Someone clicked a link on Shiori",
      });
    const save = feedEvent({
      id: "save-1",
      source: "shiori",
      type: "link_saved",
      summary: "Someone saved a link on Shiori",
    });

    const stacks = rollupActivityEvents([click("c1"), click("c2"), save]);
    expect(stacks).toHaveLength(2);
    expect(stacks[0]?.count).toBe(2);
    expect(stacks[0]?.key).toBe("shiori:link_clicked");
    expect(stacks[1]?.count).toBe(1);
    expect(stacks[1]?.key).toBe("shiori:link_saved");
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
    expect(getActivityRow(stacks[0]!.latest).summary).toBe("Someone liked");
    expect(getActivityRow(stacks[0]!.latest).label).toBe("Cursor");
    expect(getActivityRow(stacks[1]!.latest).summary).toBe("Someone liked");
    expect(getActivityRow(stacks[1]!.latest).label).toBe("Raycast");
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
      ["new-2", 0.05],
      ["new-3", 0.1],
      ["new-4", 0.15],
      ["new-5", 0.2],
    ]);

    const many = Array.from({ length: 16 }, (_, index) => `n-${index}`);
    const capped = activityEnterStaggerDelays(many, new Set());
    expect(capped.get("n-0")).toBe(0);
    expect(capped.get("n-8")).toBe(0.4);
    expect(capped.get("n-15")).toBe(0.4);
    expect(capped.has("old-1")).toBe(false);
  });

  test("first committed paint of N stacks has no enter delays", () => {
    const keys = ["a", "b", "c", "d", "e"];
    const first = nextActivityEnterState(keys, null);
    expect(first.delays.size).toBe(0);
    expect(first.seen).toEqual(new Set(keys));
    expect(nextActivityEnterState(keys, first.seen).delays.size).toBe(0);
  });

  test("only a newly prepended stack gets an enter delay", () => {
    const previous = new Set(["old-1", "old-2"]);
    const next = nextActivityEnterState(["new-1", "old-1", "old-2"], previous);
    expect([...next.delays.entries()]).toEqual([["new-1", 0]]);
    expect(next.delays.has("old-1")).toBe(false);
    expect(next.delays.has("old-2")).toBe(false);
    expect(next.seen).toEqual(new Set(["new-1", "old-1", "old-2"]));
  });

  test("keeps two public PR merges on the same repo as separate rows", () => {
    const merge = (id: string, number: number, title: string): ActivityEvent =>
      feedEvent({
        id,
        source: "github",
        type: "pr_merged",
        summary: "Merged a pull request on designdetails",
        subject: {
          kind: "pull_request",
          label: title,
          href: `https://github.com/designdetails/designdetails/pull/${number}`,
        },
        meta: {
          repo: "designdetails",
          title,
          number,
          href: `https://github.com/designdetails/designdetails/pull/${number}`,
          additions: 13,
          deletions: 2,
        },
      });

    const first = merge("pr-719", 719, "Fix player skip");
    const second = merge("pr-720", 720, "Tweak chapter marks");
    const stacks = rollupActivityEvents([first, second]);

    expect(stacks).toHaveLength(2);
    expect(activityRollupKey(first)).not.toBe(activityRollupKey(second));
    expect(stacks[0]?.count).toBe(1);
    expect(stacks[1]?.count).toBe(1);
    expect(stacks[0]?.href).toBe("https://github.com/designdetails/designdetails/pull/719");
    expect(stacks[1]?.href).toBe("https://github.com/designdetails/designdetails/pull/720");
    expect(stacks[0]?.sectionLabel).toBe("Fix player skip");
    expect(stacks[1]?.sectionLabel).toBe("Tweak chapter marks");
    expect(stacks[0]?.href).not.toBe("/https:");
    expect(stacks[1]?.href).not.toBe("/https:");
    expect(stacks[0]?.sectionLabel).not.toBe("https:");
    expect(stacks[1]?.sectionLabel).not.toBe("https:");

    const rows = stacks.map((stack) => getActivityRow(stack.latest));
    expect(rows[0]).toEqual({
      summary: "Merged a pull request on designdetails",
      href: "https://github.com/designdetails/designdetails/pull/719",
      label: "Fix player skip",
    });
    expect(rows[1]).toEqual({
      summary: "Merged a pull request on designdetails",
      href: "https://github.com/designdetails/designdetails/pull/720",
      label: "Tweak chapter marks",
    });
  });

  test("still stacks the same public PR when it appears twice", () => {
    const event = (id: string): ActivityEvent =>
      feedEvent({
        id,
        source: "github",
        type: "pr_merged",
        summary: "Merged a pull request on designdetails",
        subject: {
          kind: "pull_request",
          label: "Fix player skip",
          href: "https://github.com/designdetails/designdetails/pull/719",
        },
        meta: {
          repo: "designdetails",
          title: "Fix player skip",
          number: 719,
          href: "https://github.com/designdetails/designdetails/pull/719",
        },
      });

    const stacks = rollupActivityEvents([event("pr-719-a"), event("pr-719-b")]);
    expect(stacks).toHaveLength(1);
    expect(stacks[0]?.count).toBe(2);
    expect(stacks[0]?.href).toBe("https://github.com/designdetails/designdetails/pull/719");
    expect(stacks[0]?.sectionLabel).toBe("Fix player skip");
  });

  test("uses the latest absolute href when a stacked run has mixed GitHub URLs", () => {
    const stacked = (id: string, path: string, label: string): ActivityEvent =>
      feedEvent({
        id,
        source: "github",
        type: "pr_merged",
        summary: "Merged a pull request on designdetails",
        subject: { kind: "pull_request", label },
        meta: { repo: "designdetails", number: 1, path },
      });

    const stacks = rollupActivityEvents([
      stacked("pr-new", "https://github.com/designdetails/designdetails/pull/2", "Newer title"),
      stacked("pr-old", "https://github.com/designdetails/designdetails/pull/1", "Older title"),
    ]);
    expect(stacks).toHaveLength(1);
    expect(stacks[0]?.href).toBe("https://github.com/designdetails/designdetails/pull/2");
    expect(stacks[0]?.href).not.toBe("/https:");
    expect(stacks[0]?.sectionLabel).not.toBe("https:");
  });

  test("only pulses when the same run's count increments", () => {
    const top = { key: "visit:sf:ama:oldest", count: 3 };
    expect(shouldPulseActivityRollup(null, { ...top, count: 1 })).toBe(false);
    expect(shouldPulseActivityRollup(top, { ...top, count: 4 })).toBe(true);
    expect(shouldPulseActivityRollup(top, { ...top, count: 3 })).toBe(false);
    expect(shouldPulseActivityRollup(top, { key: "like:/stack:other", count: 1 })).toBe(false);
  });

  test("does not pulse a new independent run that shares a rollup key", () => {
    expect(
      shouldPulseActivityRollup(
        { key: "shiori:link_saved:old-anchor", count: 15 },
        { key: "shiori:link_saved:new-anchor", count: 1 },
      ),
    ).toBe(false);
    expect(
      shouldPulseActivityRollup(
        { key: "shiori:link_saved:old-anchor", count: 15 },
        { key: "shiori:link_saved:old-anchor", count: 16 },
      ),
    ).toBe(true);
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
    expect(await store.getCount()).toBe(2);
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
