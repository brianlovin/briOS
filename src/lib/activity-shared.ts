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
export const ACTIVITY_SOURCE_GITHUB = "github";
export const ACTIVITY_VISIT_TITLE_MAX = 200;

export const ACTIVITY_SOURCE_LABELS: Record<string, string> = {
  [ACTIVITY_SOURCE_BRIOS]: "briOS",
  "tax-ui": "Tax UI",
  "staff-design": "Staff Design",
  "design-details": "Design Details",
  shiori: "Shiori",
  [ACTIVITY_SOURCE_GITHUB]: "GitHub",
};

const ACTIVITY_SOURCE_FAVICONS: Record<string, string> = {
  [ACTIVITY_SOURCE_BRIOS]: "/activity/favicons/brios.png",
  "tax-ui": "/activity/favicons/tax-ui.png",
  "staff-design": "/activity/favicons/staff-design.png",
  "design-details": "/activity/favicons/design-details.png",
  shiori: "/img/shiori-icon.png",
};

const ACTIVITY_SOURCE_URLS: Record<string, string> = {
  "tax-ui": "https://tax-ui.brianlovin.com/",
  "staff-design": "https://staff.design",
  "design-details": "https://designdetails.fm",
  shiori: "https://www.shiori.sh",
  github: "https://github.com/brianlovin",
};

const ABSOLUTE_HTTP_URL_RE = /^https?:\/\//i;

export function activitySourceLabel(source: string): string {
  return ACTIVITY_SOURCE_LABELS[source] ?? source;
}

export function activitySourceUrl(source: string): string | undefined {
  return ACTIVITY_SOURCE_URLS[source];
}

export function resolveActivitySourceHref(
  source: string,
  href?: string | null,
): string | undefined {
  const trimmed = href?.trim();
  if (!trimmed) return undefined;
  if (ABSOLUTE_HTTP_URL_RE.test(trimmed)) {
    return trimmed;
  }
  const home = activitySourceUrl(source);
  if (home && trimmed.startsWith("/")) {
    const base = home.endsWith("/") ? home : `${home}/`;
    return new URL(trimmed, base).href;
  }
  return trimmed;
}

export function formatDownloadSummary(source: string, label?: string): string {
  return `Someone downloaded ${label?.trim() || activitySourceLabel(source)}`;
}

export function activitySourceFaviconSrc(source: string): string | undefined {
  return ACTIVITY_SOURCE_FAVICONS[source];
}

export function resolveVisitTitle(path: string, title?: string): string {
  return sanitizeActivityTitle(title, path).slice(0, ACTIVITY_VISIT_TITLE_MAX);
}

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

export const ACTIVITY_TRACKED_SINCE = "August 16, 2026";
export const ACTIVITY_TRACKED_SINCE_TOOLTIP = `Tracked since ${ACTIVITY_TRACKED_SINCE}`;

export type ActivityFeedPayload = {
  events: ActivityEvent[];
  count: number;
};

export function formatTrackedEventsLabel(count: number): string {
  return count === 1 ? "1 event tracked" : `${count.toLocaleString("en-US")} events tracked`;
}

/** SWR refreshInterval: poll while the tab is visible, pause when hidden. */
export function activityFeedRefreshInterval(visibilityState: string | null | undefined): number {
  return visibilityState === "visible" ? ACTIVITY_FEED_POLL_MS : 0;
}

export function isActivityFeedPayload(value: unknown): value is ActivityFeedPayload {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    Array.isArray(record.events) &&
    typeof record.count === "number" &&
    Number.isFinite(record.count)
  );
}

export type ActivityIngestInput = {
  v?: number;
  id?: string;
  ts?: string;
  source: string;
  type: string;
  speed?: ActivitySpeed;
  summary?: string;
  visibility?: ActivityVisibility;
  idempotency_key: string;
  actor?: ActivityRef;
  subject?: ActivityRef;
  meta?: Record<string, unknown>;
  /** When false, increment the lifetime count only (used for sampled visits). */
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

const TITLE_SMALL_WORDS = new Set(["for", "of", "the", "a", "an", "and", "or", "in", "on"]);
const TITLE_ACRONYMS: Record<string, string> = {
  ios: "iOS",
  macos: "macOS",
  api: "API",
  ama: "AMA",
  hn: "HN",
  til: "TIL",
  pdf: "PDF",
  url: "URL",
  id: "ID",
};

const SITE_TITLE_SUFFIX_RE = new RegExp(
  `\\s+[\\u2013\\u2014|-]\\s+(?:${["Brian Lovin", ...Object.values(KNOWN_PATH_TITLES)]
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\s*$`,
  "i",
);

/** Drop ` | Brian Lovin`, ` - App Dissection`, and the same with en/em dashes. */
export function stripSiteTitleSuffix(title: string): string {
  let result = title.trim();
  for (let i = 0; i < 3; i++) {
    const next = result.replace(SITE_TITLE_SUFFIX_RE, "").trim();
    if (next === result) break;
    result = next;
  }
  return result;
}

/**
 * Prefer a real page title. Strip the site suffix, reject PII, and format
 * slug-like leftovers. Falls back to the smart route map — never invents a name.
 */
export function sanitizeActivityTitle(title: string | undefined, path: string): string {
  const fallback = formatActivityTitle(inferTitleFromPath(path));
  const trimmed = title?.trim();
  if (!trimmed) return fallback;

  const stripped = stripSiteTitleSuffix(trimmed);
  if (!stripped || /^brian lovin$/i.test(stripped)) return fallback;
  if (findForbiddenPii(stripped)) return fallback;
  return formatActivityTitle(stripped);
}

export const sanitizeVisitTitle = sanitizeActivityTitle;

/** De-hyphenated slugs are all lowercase (no original caps). */
export function looksLikeDehyphenatedSlug(label: string): boolean {
  const trimmed = label.trim();
  if (!trimmed || !/[a-z]/i.test(trimmed)) return false;
  return !/[A-Z]/.test(trimmed);
}

/** Title-case a slug-like label. Leaves already-capped titles alone. */
export function formatActivityTitle(label: string): string {
  if (!looksLikeDehyphenatedSlug(label)) return label;

  return label
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (TITLE_ACRONYMS[lower]) return TITLE_ACRONYMS[lower];
      if (index > 0 && TITLE_SMALL_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
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
  const title = sanitizeActivityTitle(target.title || fallback.title, href);
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
    if (!label || label === "a page" || looksLikeIdentifier(label)) {
      return formatActivityTitle(inferred);
    }

    const path = normalizeActivityPath(href);
    // List-page hrefs like `/stack` must not replace a specific item name ("Cursor").
    if (!options?.preferStored && KNOWN_PATH_TITLES[path]) return KNOWN_PATH_TITLES[path];

    const cleaned = stripTrailingShortIdToken(label);
    if (looksLikeIdentifier(cleaned)) return formatActivityTitle(inferred);
    return formatActivityTitle(cleaned || inferred);
  }

  if (!label) return undefined;
  if (label === "a page") return "Home";
  if (looksLikeIdentifier(label)) return undefined;
  const cleaned = stripTrailingShortIdToken(label);
  return looksLikeIdentifier(cleaned) ? undefined : formatActivityTitle(cleaned);
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

function visitSummaryWithFlag(summary: string, meta: Record<string, unknown> | undefined): string {
  const split = splitVisitSummaryFlag(summary);
  if (split.flag) return summary;
  const flag = countryCodeToFlag(geoFromVisitMeta(meta).country);
  return flag ? `${flag} ${summary}` : summary;
}

export function getMergedPullRequestDiff(
  meta: Record<string, unknown> | undefined,
): { additions: number; deletions: number } | null {
  if (!meta) return null;
  if (typeof meta.additions !== "number" || typeof meta.deletions !== "number") return null;
  if (!Number.isFinite(meta.additions) || !Number.isFinite(meta.deletions)) return null;
  return { additions: meta.additions, deletions: meta.deletions };
}

export const CAFFEINE_DRINK_MAX_LENGTH = 40;
export const CAFFEINE_COFFEE_ICON = "☕";
export const CAFFEINE_OTHER_ICON = "🥤";

/** Coffee-family drinks render ☕; everything else caffeinated is 🥤. */
const COFFEE_FAMILY_TERMS = [
  "pour over",
  "cold brew",
  "flat white",
  "cappuccino",
  "cappucino",
  "americano",
  "macchiato",
  "gibraltar",
  "affogato",
  "espresso",
  "cortado",
  "coffee",
  "mocha",
  "latte",
  "nitro",
  "drip",
];

export function titleCaseWords(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function normalizeCaffeineDrink(drink: string): string | null {
  const collapsed = drink.trim().replace(/\s+/g, " ");
  if (!collapsed || collapsed.length > CAFFEINE_DRINK_MAX_LENGTH) return null;
  return titleCaseWords(collapsed);
}

export function isCoffeeFamilyDrink(drink: string): boolean {
  const normalized = drink.toLowerCase().trim();
  if (!normalized) return false;
  return COFFEE_FAMILY_TERMS.some((term) => normalized === term || normalized.includes(term));
}

export function getCaffeineIcon(drink: string | null | undefined): string {
  return drink && isCoffeeFamilyDrink(drink) ? CAFFEINE_COFFEE_ICON : CAFFEINE_OTHER_ICON;
}

export function caffeineDrinkFromEvent(event: ActivityEvent): string {
  if (typeof event.meta?.drink === "string") return event.meta.drink;
  if (event.subject?.kind === "drink") return event.subject.label;
  return "";
}

export function getActivityRow(event: ActivityEvent): {
  summary: string;
  flag?: string;
  icon?: string;
  href?: string;
  label?: string;
} {
  if (event.type === "caffeinated") {
    return {
      summary: event.summary,
      icon: getCaffeineIcon(caffeineDrinkFromEvent(event)),
      href: event.subject?.href,
      label: event.subject?.label,
    };
  }

  if (event.type === "visit") {
    const geo = geoFromVisitMeta(event.meta);
    const hasLocation = Boolean(geo.country || geo.city || geo.countryName);
    const storedText = splitVisitSummaryFlag(event.summary).text.trim();
    const summary = hasLocation
      ? formatVisitSummary(geo)
      : !storedText || storedText === "Visit"
        ? ANONYMOUS_VISIT_SUMMARY
        : visitSummaryWithFlag(event.summary, event.meta);
    return {
      summary,
      href: event.subject?.href,
      label: displaySubjectLabel(event.subject?.label, event.subject?.href),
    };
  }

  if (event.type === "visit_country_first") {
    return {
      summary: visitSummaryWithFlag(event.summary, event.meta),
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

  if (event.source === "shiori" && (event.type === "link_saved" || event.type === "link_clicked")) {
    return { summary: event.summary };
  }

  return {
    summary: event.summary,
    href: event.subject?.href,
    label: displaySubjectLabel(event.subject?.label, event.subject?.href),
  };
}

export function getRequestCountry(headers: Headers): string | undefined {
  return normalizeCountryCode(
    headers.get("cf-ipcountry") ??
      headers.get("CF-IPCountry") ??
      headers.get("x-vercel-ip-country") ??
      headers.get("x-country"),
  );
}
