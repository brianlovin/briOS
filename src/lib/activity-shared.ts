/**
 * Shared activity-feed types and pure helpers.
 * Safe to import from client components (no Redis / Node crypto).
 */

import {
  ANONYMOUS_VISIT_SUMMARY,
  countryCodeToFlag,
  formatVisitSummary,
  geoFromVisitMeta,
  normalizeCountryCode,
  splitVisitSummaryFlag,
} from "./activity-geo";

export { countryCodeToFlag, normalizeCountryCode } from "./activity-geo";

export const ACTIVITY_ENVELOPE_VERSION = 1;
export const ACTIVITY_STREAM_MAXLEN = 1500;
export const ACTIVITY_VISIT_STREAM_MAX_PER_SEC = 10;
export const ACTIVITY_IDEMPOTENCY_TTL_SECONDS = 6 * 60 * 60;
export const ACTIVITY_META_MAX_BYTES = 2048;
export const ACTIVITY_BODY_MAX_BYTES = 8192;
export const ACTIVITY_SOURCE_BRIOS = "brios";

/** CDN + browser cache for the public activity poll blob. */
export const ACTIVITY_FEED_CACHE_CONTROL = "public, s-maxage=2, stale-while-revalidate=30";
export const ACTIVITY_FEED_POLL_MS = 2000;
export const ACTIVITY_FEED_DEDUPING_MS = 1000;

export type ActivitySpeed = "event" | "signal";
export type ActivityVisibility = "public" | "private";

export type ActivityRef = {
  kind: string;
  label: string;
  href?: string;
};

export type ActivityEvent = {
  v: number;
  id: string;
  ts: string;
  received_at: string;
  source: string;
  type: string;
  speed: ActivitySpeed;
  summary: string;
  visibility: ActivityVisibility;
  idempotency_key: string;
  actor?: ActivityRef;
  subject?: ActivityRef;
  meta?: Record<string, unknown>;
};

export type ActivityTotal = {
  source: string;
  type: string;
  count: number;
  first_seen: string;
};

export type ActivityFeedPayload = {
  events: ActivityEvent[];
  totals: ActivityTotal[];
};

/** SWR refreshInterval: poll while the tab is visible, pause when hidden. */
export function activityFeedRefreshInterval(visibilityState: string | null | undefined): number {
  return visibilityState === "visible" ? ACTIVITY_FEED_POLL_MS : 0;
}

export function isActivityFeedPayload(value: unknown): value is ActivityFeedPayload {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return Array.isArray(record.events) && Array.isArray(record.totals);
}

export type ActivityIngestInput = {
  v?: number;
  id?: string;
  ts?: string;
  source: string;
  type: string;
  speed: ActivitySpeed;
  summary: string;
  visibility?: ActivityVisibility;
  idempotency_key: string;
  actor?: ActivityRef;
  subject?: ActivityRef;
  meta?: Record<string, unknown>;
  /** When false, increment totals only (used for sampled visits). */
  writeToStream?: boolean;
  /** Override idempotency TTL. `0` keeps the key forever (publish / first-seen events). */
  idempotencyTtlSeconds?: number;
};

const ACTIVITY_PATH = /^\/activity(?:\/|$)/;

export function isActivityPath(pathname: string): boolean {
  const path = pathname.split("?")[0] ?? pathname;
  return ACTIVITY_PATH.test(path);
}

export function shouldRecordVisit(pathname: string): boolean {
  if (!pathname || pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    return false;
  }
  return !isActivityPath(pathname);
}

export function inferContentTypeFromPath(pathname: string): string {
  if (pathname.startsWith("/writing")) return "writing";
  if (pathname.startsWith("/til")) return "til";
  if (pathname.startsWith("/stack")) return "stack";
  if (pathname.startsWith("/sites")) return "site";
  if (pathname.startsWith("/ama")) return "ama";
  if (pathname.startsWith("/app-dissection")) return "app_dissection";
  if (pathname.startsWith("/design-details")) return "design_details";
  if (pathname.startsWith("/listening")) return "listening";
  if (pathname === "/") return "home";
  return "page";
}

/** Exact routes → site nav labels. Used at ingest and when rendering stored events. */
const KNOWN_PATH_TITLES: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/activity": "Activity",
  "/writing": "Writing",
  "/til": "TIL",
  "/stack": "Stack",
  "/sites": "Sites",
  "/ama": "AMA",
  "/listening": "Listening",
  "/hn": "Hacker News",
  "/app-dissection": "App Dissection",
  "/design-details": "Design Details",
  "/bookmarks": "Bookmarks",
};

/** Identifier child routes → a phrase, never the raw id. */
const ID_ROUTE_PHRASES: { prefix: string; label: string }[] = [
  { prefix: "/hn/", label: "a Hacker News story" },
  { prefix: "/ama/", label: "an AMA question" },
];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UUID_COMPACT_RE = /^[0-9a-f]{32}$/i;
const UUID_SPACED_RE = /^[0-9a-f]{8}\s+[0-9a-f]{4}\s+[0-9a-f]{4}\s+[0-9a-f]{4}\s+[0-9a-f]{12}$/i;
const DIGITS_RE = /^\d+$/;

function normalizeActivityPath(pathname: string): string {
  const path = pathname.split("?")[0] ?? pathname;
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

/**
 * Trailing slug tokens that look like Notion short ids (e.g. `kcJun01`, `B57IXLJ`).
 * Keeps real words (`writing`, `stack`) and Title Case words (`World`).
 */
export function looksLikeShortId(token: string): boolean {
  if (token.length < 5 || token.length > 12) return false;
  if (!/^[A-Za-z0-9]+$/.test(token)) return false;

  const hasDigit = /\d/.test(token);
  const hasUpper = /[A-Z]/.test(token);
  const hasLower = /[a-z]/.test(token);
  const isTitleCase = /^[A-Z][a-z]+$/.test(token);
  const isUpperWord = /^[A-Z]+$/.test(token);

  // Keep real words, Title Case words, and lowercase hex (AMA UUIDs).
  if (isTitleCase || (isUpperWord && !hasDigit) || !hasUpper) return false;
  return hasLower || hasDigit;
}

/** Digits, UUIDs (hyphenated, compact, or spaced), or a bare short id. */
export function looksLikeIdentifier(value: string): boolean {
  const token = value.trim();
  if (!token) return false;
  if (DIGITS_RE.test(token)) return true;
  if (UUID_RE.test(token) || UUID_COMPACT_RE.test(token) || UUID_SPACED_RE.test(token)) {
    return true;
  }
  return !/[\s-]/.test(token) && looksLikeShortId(token);
}

function labelForIdentifierPath(path: string, segments: string[]): string {
  const phrase = ID_ROUTE_PHRASES.find((entry) => path.startsWith(entry.prefix));
  if (phrase) return phrase.label;

  const parent = segments.length > 1 ? `/${segments.slice(0, -1).join("/")}` : "/";
  if (KNOWN_PATH_TITLES[parent]) return KNOWN_PATH_TITLES[parent];

  const parentSegment = segments[segments.length - 2];
  if (parentSegment) return titleFromLastSegment(parentSegment);
  return "Home";
}

export function stripTrailingShortIdToken(value: string): string {
  const hyphenParts = value.split("-");
  if (hyphenParts.length > 1 && looksLikeShortId(hyphenParts[hyphenParts.length - 1] ?? "")) {
    return hyphenParts.slice(0, -1).join("-");
  }

  const spaceParts = value.split(/\s+/);
  if (spaceParts.length > 1 && looksLikeShortId(spaceParts[spaceParts.length - 1] ?? "")) {
    return spaceParts.slice(0, -1).join(" ");
  }

  return value;
}

function titleFromLastSegment(segment: string): string {
  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    decoded = segment;
  }
  return stripTrailingShortIdToken(decoded).replace(/-/g, " ");
}

/** First path segment for visit rollups (`/` → `home`). */
export function activitySectionFromPath(pathname: string | undefined): string {
  if (!pathname) return "";
  const path = normalizeActivityPath(pathname);
  if (path === "/") return "home";
  return path.split("/").filter(Boolean)[0] ?? "";
}

/** Smart section phrase for stacked visit subtitles — never a raw id. */
export function activitySectionPhrase(section: string): string {
  if (!section || section === "home") return "Home";
  if (section === "ama") return "an AMA question";
  if (section === "hn") return "a Hacker News story";
  const known = KNOWN_PATH_TITLES[`/${section}`];
  if (known) return known;
  return inferTitleFromPath(`/${section}`);
}

export function inferTitleFromPath(pathname: string): string {
  const path = normalizeActivityPath(pathname);
  const known = KNOWN_PATH_TITLES[path];
  if (known) return known;

  const segments = path.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (!last) return "Home";

  let decodedLast = last;
  try {
    decodedLast = decodeURIComponent(last);
  } catch {
    decodedLast = last;
  }
  if (looksLikeIdentifier(decodedLast)) {
    return labelForIdentifierPath(path, segments);
  }
  return titleFromLastSegment(last);
}

export type LikeActivityTarget = {
  title?: string;
  href?: string;
  contentType?: string;
};

export type LikeActivityPayload = {
  title: string;
  href: string;
  content_type: string;
};

/** Resolve the like/activity body. Passed title/href win over document/path fallbacks. */
export function likeActivityPayload(
  target: LikeActivityTarget = {},
  fallback: { title?: string; href?: string } = {},
): LikeActivityPayload {
  const href = target.href?.trim() || fallback.href?.trim() || "/";
  const title = target.title?.trim() || fallback.title?.trim() || inferTitleFromPath(href);
  const content_type = target.contentType?.trim() || inferContentTypeFromPath(href);
  return { title, href, content_type };
}

export function isKnownActivityTitle(label: string): boolean {
  return Object.values(KNOWN_PATH_TITLES).includes(label);
}

function displaySubjectLabel(
  label: string | undefined,
  href: string | undefined,
  options?: { preferStored?: boolean },
): string | undefined {
  if (href) {
    const inferred = inferTitleFromPath(href);
    if (!label || label === "a page" || looksLikeIdentifier(label)) return inferred;

    const path = normalizeActivityPath(href);
    // List-page hrefs like `/stack` must not replace a specific item name ("Cursor").
    if (!options?.preferStored && KNOWN_PATH_TITLES[path]) return KNOWN_PATH_TITLES[path];

    const cleaned = stripTrailingShortIdToken(label);
    if (looksLikeIdentifier(cleaned)) return inferred;
    return cleaned || inferred;
  }

  if (!label) return undefined;
  if (label === "a page") return "Home";
  if (looksLikeIdentifier(label)) return undefined;
  const cleaned = stripTrailingShortIdToken(label);
  return looksLikeIdentifier(cleaned) ? undefined : cleaned;
}

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const IPV4_RE = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
const IPV6_RE = /\b(?:[0-9a-f]{1,4}:){2,7}[0-9a-f]{1,4}\b/i;
const FORBIDDEN_KEY_RE =
  /^(email|e-mail|cookie|cookies|authorization|cf-connecting-ip|set-cookie)$/i;
const FORBIDDEN_SUBSTRINGS = ["cf-connecting-ip", "authorization:", "cookie:"];

export type PiiRejection = { ok: false; reason: string };
export type PiiAcceptance = { ok: true };

export function findForbiddenPii(value: unknown): string | null {
  return scanPii(value, "");
}

function scanPii(value: unknown, path: string): string | null {
  if (value == null) return null;

  if (typeof value === "string") {
    if (EMAIL_RE.test(value)) return path ? `${path}: email` : "email";
    if (IPV4_RE.test(value) || IPV6_RE.test(value)) return path ? `${path}: ip` : "ip";
    const lower = value.toLowerCase();
    for (const token of FORBIDDEN_SUBSTRINGS) {
      if (lower.includes(token)) return path ? `${path}: ${token}` : token;
    }
    return null;
  }

  if (typeof value === "number" || typeof value === "boolean") return null;

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const hit = scanPii(value[i], path ? `${path}[${i}]` : `[${i}]`);
      if (hit) return hit;
    }
    return null;
  }

  if (typeof value === "object") {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (FORBIDDEN_KEY_RE.test(key) || key.toLowerCase().includes("cf-connecting-ip")) {
        return `key:${key}`;
      }
      const hit = scanPii(child, path ? `${path}.${key}` : key);
      if (hit) return hit;
    }
  }

  return null;
}

const HIDDEN_LIFETIME_TYPES = new Set(["visit_country_first"]);

export function shouldCountLifetimeTotal(type: string): boolean {
  return !HIDDEN_LIFETIME_TYPES.has(type);
}

export function visibleLifetimeTotals(totals: ActivityTotal[]): ActivityTotal[] {
  return totals.filter((total) => shouldCountLifetimeTotal(total.type));
}

export function getActivityRow(event: ActivityEvent): {
  summary: string;
  flag?: string;
  href?: string;
  label?: string;
} {
  if (event.type === "visit") {
    const geo = geoFromVisitMeta(event.meta);
    const hasLocation = Boolean(geo.country || geo.city || geo.countryName);
    const storedText = splitVisitSummaryFlag(event.summary).text.trim();
    const full = hasLocation
      ? formatVisitSummary(geo)
      : !storedText || storedText === "Visit"
        ? ANONYMOUS_VISIT_SUMMARY
        : event.summary;
    const split = splitVisitSummaryFlag(full);
    const flag = split.flag || countryCodeToFlag(geo.country);
    return {
      summary: split.text,
      ...(flag ? { flag } : {}),
      href: event.subject?.href,
      label: displaySubjectLabel(event.subject?.label, event.subject?.href),
    };
  }

  if (event.type === "visit_country_first") {
    const geo = geoFromVisitMeta(event.meta);
    const split = splitVisitSummaryFlag(event.summary);
    const flag = split.flag || countryCodeToFlag(geo.country);
    return {
      summary: split.text,
      ...(flag ? { flag } : {}),
      href: event.subject?.href,
      label: displaySubjectLabel(event.subject?.label, event.subject?.href),
    };
  }

  if (event.type === "like") {
    const label = displaySubjectLabel(event.subject?.label, event.subject?.href, {
      preferStored: true,
    });
    const name = label || "a page";
    return {
      summary: `Someone liked ${name}`,
      href: event.subject?.href,
      label,
    };
  }

  return {
    summary: event.summary,
    href: event.subject?.href,
    label: displaySubjectLabel(event.subject?.label, event.subject?.href),
  };
}

export function formatTotalLabel(type: string): string {
  switch (type) {
    case "like":
      return "Likes";
    case "visit":
      return "Visits";
    case "ama_asked":
      return "AMA questions";
    case "ama_answered":
      return "AMA answers";
    case "digest_subscribed":
      return "Digest subscribers";
    case "digest_sent":
      return "Digests sent";
    case "writing_published":
      return "Writing";
    case "til_published":
      return "TILs";
    case "stack_added":
      return "Stack";
    case "site_added":
      return "Sites";
    case "design_details_added":
      return "Design Details";
    case "app_dissection_published":
      return "App dissections";
    default:
      return type.replace(/_/g, " ");
  }
}

export function getRequestCountry(headers: Headers): string | undefined {
  return normalizeCountryCode(
    headers.get("cf-ipcountry") ??
      headers.get("CF-IPCountry") ??
      headers.get("x-vercel-ip-country") ??
      headers.get("x-country"),
  );
}
