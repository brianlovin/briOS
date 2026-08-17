/**
 * Shared activity-feed types and pure helpers.
 * Safe to import from client components (no Redis / Node crypto).
 */

import {
  ANONYMOUS_VISIT_SUMMARY,
  formatVisitSummary,
  geoFromVisitMeta,
  normalizeCountryCode,
  visitDisplaySummary,
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
const PROTOCOL_SEGMENT_RE = /^https?:$/i;

export function isAbsoluteHttpUrl(value: string): boolean {
  return ABSOLUTE_HTTP_URL_RE.test(value);
}

/** Pathname for site helpers. Absolute http(s) → `new URL(value).pathname`; relative stays as-is. */
export function pathnameFromHref(value: string): string {
  if (isAbsoluteHttpUrl(value)) {
    try {
      return new URL(value).pathname;
    } catch {
      return value;
    }
  }
  return value;
}

function isProtocolSegment(value: string): boolean {
  return PROTOCOL_SEGMENT_RE.test(value.trim());
}

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

function normalizeHrefForCompare(href: string): string {
  return href.trim().replace(/\/+$/, "");
}

function isSourceHomeHref(source: string, href: string | undefined): boolean {
  const trimmed = href?.trim();
  if (!trimmed || trimmed === "/") return true;
  const home = activitySourceUrl(source);
  if (!home) return false;
  return normalizeHrefForCompare(trimmed) === normalizeHrefForCompare(home);
}

function hasSpecificSubjectHref(source: string, href: string | undefined): boolean {
  return Boolean(href?.trim()) && !isSourceHomeHref(source, href);
}

/** Lift a trailing source name so the feed can link it. Keep on/for so "on {source}" still reads as a sentence. */
function stripSourceNameFromSummary(summary: string, sourceLabel: string): string {
  const escaped = sourceLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const trimmed = summary.trim();
  const withoutName = trimmed.replace(new RegExp(`\\s+${escaped}$`, "i"), "").trim();
  return withoutName || summary;
}

function attachSourceMetadata(
  event: ActivityEvent,
  row: {
    summary: string;
    flag?: string;
    icon?: string;
    href?: string;
    label?: string;
  },
): {
  summary: string;
  flag?: string;
  icon?: string;
  href?: string;
  label?: string;
} {
  if (event.type === "like" || event.source === ACTIVITY_SOURCE_BRIOS) {
    return row;
  }

  const sourceLabel = activitySourceLabel(event.source);
  const sourceUrl = activitySourceUrl(event.source);
  if (hasSpecificSubjectHref(event.source, row.href)) {
    return row;
  }
  if (!sourceUrl) return row;

  return {
    ...row,
    summary: stripSourceNameFromSummary(row.summary, sourceLabel),
    label: sourceLabel,
    href: sourceUrl,
  };
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
export const ACTIVITY_TRACKED_SINCE_TOOLTIP = `Events tracked since ${ACTIVITY_TRACKED_SINCE}`;

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

const CRAWLER_PROBE_PATHS = new Set(["/robots.txt", "/sitemap.xml", "/favicon.ico"]);

function isCrawlerProbePath(pathname: string): boolean {
  if (CRAWLER_PROBE_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/apple-touch-icon")) return true;
  return pathname === "/.well-known" || pathname.startsWith("/.well-known/");
}

export function shouldRecordVisit(pathname: string): boolean {
  const path = pathname.split("?")[0] ?? pathname;
  if (!path || path.startsWith("/api/") || path.startsWith("/_next/")) {
    return false;
  }
  if (isCrawlerProbePath(path)) {
    return false;
  }
  return !isActivityPath(path);
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

export function isKnownActivitySection(section: string): boolean {
  if (!section || section === "home") return true;
  return Object.prototype.hasOwnProperty.call(KNOWN_PATH_TITLES, `/${section}`);
}

/** Identifier child routes → a phrase, never the raw id. */
const ID_ROUTE_PHRASES: { prefix: string; label: string }[] = [
  { prefix: "/hn/", label: "a Hacker News story" },
  { prefix: "/ama/", label: "an AMA question" },
];

/** Child routes that should keep their section name after `stripSiteTitleSuffix`. */
const CHILD_ROUTE_SECTION_SUFFIXES: { prefix: string; suffix: string }[] = [
  { prefix: "/app-dissection/", suffix: "App Dissection" },
  { prefix: "/design-details/", suffix: "Design Details" },
];

const GENERIC_HN_STORY_TITLES = new Set([
  "a page",
  "hacker news",
  "a hacker news story",
  "hacker news post",
  "hacker news post not found",
]);

const HN_STORY_PATH_RE = /^\/hn\/(\d+)$/;
const CMS_POST_PATH_RE = /^\/(writing|til)\/([^/]+)$/;

/** Story id from `/hn/{id}` (and absolute briOS URLs). Index `/hn` is undefined. */
export function hnStoryIdFromPath(pathname: string): string | undefined {
  const path = normalizeActivityPath(pathnameFromHref(pathname));
  const match = HN_STORY_PATH_RE.exec(path);
  return match?.[1];
}

/** Writing/TIL child slug from `/writing/{slug}` or `/til/{slug}` (and absolute URLs). */
export function cmsPostRefFromPath(
  pathname: string,
): { kind: "writing" | "til"; slug: string } | undefined {
  const path = normalizeActivityPath(pathnameFromHref(pathname));
  const match = CMS_POST_PATH_RE.exec(path);
  if (!match) return undefined;
  return { kind: match[1] as "writing" | "til", slug: match[2] };
}

/** Missing, generic, or identifier titles that should not win over a real HN story name. */
export function isGenericHnStoryTitle(title: string | undefined, storyId?: string): boolean {
  const trimmed = title?.trim();
  if (!trimmed) return true;
  if (storyId && trimmed === storyId) return true;
  if (looksLikeIdentifier(trimmed)) return true;
  return GENERIC_HN_STORY_TITLES.has(trimmed.toLowerCase());
}

function childRouteSectionTitle(pathname: string): string | undefined {
  const path = normalizeActivityPath(pathnameFromHref(pathname));
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) return undefined;
  return KNOWN_PATH_TITLES[`/${segments[0]}`];
}

/** Section index title used on a child route (e.g. "App Dissection" on `/app-dissection/foo`). */
function isGenericSectionTitle(title: string, pathname: string): boolean {
  const section = childRouteSectionTitle(pathname);
  if (!section) return false;
  return title.trim().toLowerCase() === section.toLowerCase();
}

/**
 * Stored/client titles that are not a real page name: empty, "a page", raw ids,
 * a section index title on a child route, or a generic HN phrase.
 */
export function isUnusableActivityTitle(title: string | undefined, pathname: string): boolean {
  const stored = title?.trim();
  if (!stored) return true;
  if (stored === "a page") return true;
  if (looksLikeIdentifier(stored)) return true;
  if (isProtocolSegment(stored)) return true;
  if (isAbsoluteHttpUrl(stored)) return true;
  if (isGenericHnStoryTitle(stored, hnStoryIdFromPath(pathname))) return true;
  if (isGenericSectionTitle(stored, pathname)) return true;
  return false;
}

/** `{Post name} App Dissection` — format the name first, then append so title-case still runs. */
export function appendKnownSectionSuffix(label: string, pathname: string): string {
  const path = normalizeActivityPath(pathnameFromHref(pathname));
  const trimmed = label.trim();
  if (!trimmed) return trimmed;

  for (const { prefix, suffix } of CHILD_ROUTE_SECTION_SUFFIXES) {
    if (!path.startsWith(prefix)) continue;
    if (trimmed.toLowerCase() === suffix.toLowerCase()) return suffix;
    if (trimmed.toLowerCase().endsWith(` ${suffix.toLowerCase()}`)) return trimmed;
    return `${trimmed} ${suffix}`;
  }
  return trimmed;
}

function formatSubjectLabel(label: string, pathname: string): string {
  return appendKnownSectionSuffix(formatActivityTitle(label), pathname);
}

/** Keep a real mixed-case title as-is; title-case only slug leftovers. */
function preserveOrFormatSubjectLabel(label: string, pathname: string): string {
  if (!looksLikeDehyphenatedSlug(label)) {
    return appendKnownSectionSuffix(label, pathname);
  }
  return formatSubjectLabel(label, pathname);
}

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
  const path = normalizeActivityPath(pathnameFromHref(pathname));
  if (path === "/") return "home";
  const section = path.split("/").filter(Boolean)[0] ?? "";
  return isProtocolSegment(section) ? "" : section;
}

/** Smart section phrase for stacked visit subtitles — never a raw id. */
export function activitySectionPhrase(section: string): string {
  if (!section || section === "home" || isProtocolSegment(section)) return "Home";
  if (section === "ama") return "an AMA question";
  const known = KNOWN_PATH_TITLES[`/${section}`];
  if (known) return known;
  return inferTitleFromPath(`/${section}`);
}

export function inferTitleFromPath(pathname: string): string {
  const path = normalizeActivityPath(pathnameFromHref(pathname));
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
  const fallback = formatSubjectLabel(inferTitleFromPath(path), path);
  const trimmed = title?.trim();
  if (!trimmed) return fallback;

  const stripped = stripSiteTitleSuffix(trimmed);
  if (!stripped || /^brian lovin$/i.test(stripped)) return fallback;
  if (findForbiddenPii(stripped)) return fallback;
  if (isUnusableActivityTitle(stripped, path)) return fallback;
  return preserveOrFormatSubjectLabel(stripped, path);
}

export const sanitizeVisitTitle = sanitizeActivityTitle;

/** De-hyphenated slugs are all lowercase (no original caps). */
export function looksLikeDehyphenatedSlug(label: string): boolean {
  const trimmed = label.trim();
  if (!trimmed || !/[a-z]/i.test(trimmed)) return false;
  return !/[A-Z]/.test(trimmed);
}

/**
 * True when `title` is the path slug (raw, de-hyphenated, or title-cased).
 * Real CMS titles that differ (apostrophes, `AI`) return false.
 */
export function isSlugLikeActivityTitle(title: string | undefined, pathname: string): boolean {
  const trimmed = title?.trim();
  if (!trimmed) return true;
  if (looksLikeDehyphenatedSlug(trimmed)) return true;

  const inferred = inferTitleFromPath(pathname);
  const normalized = stripTrailingShortIdToken(trimmed)
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
  if (normalized === inferred.toLowerCase()) return true;
  return trimmed === formatActivityTitle(inferred);
}

/** Missing, generic, or slug-derived titles that should lose to a CMS lookup. */
export function shouldLookupCmsPostTitle(title: string | undefined, pathname: string): boolean {
  if (!cmsPostRefFromPath(pathname)) return false;
  const trimmed = title?.trim();
  if (!trimmed) return true;
  const stripped = stripSiteTitleSuffix(trimmed);
  if (!stripped || /^brian lovin$/i.test(stripped)) return true;
  if (isUnusableActivityTitle(stripped, pathname)) return true;
  return isSlugLikeActivityTitle(stripped, pathname);
}

/** Title-case a slug-like label. Leaves already-capped titles alone. */
export function formatActivityTitle(label: string): string {
  if (isProtocolSegment(label)) return label;
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
    const stored = label?.trim();
    if (!stored || isUnusableActivityTitle(stored, href)) {
      return isProtocolSegment(inferred) ? undefined : formatSubjectLabel(inferred, href);
    }

    const path = normalizeActivityPath(pathnameFromHref(href));
    // List-page hrefs like `/stack` must not replace a specific item name ("Cursor").
    // Absolute URLs keep the stored title; infer from pathname only when stored is unusable.
    if (!options?.preferStored && !isAbsoluteHttpUrl(href) && KNOWN_PATH_TITLES[path]) {
      return KNOWN_PATH_TITLES[path];
    }

    const cleaned = stripTrailingShortIdToken(stored);
    if (isUnusableActivityTitle(cleaned, href)) {
      return isProtocolSegment(inferred) ? undefined : formatSubjectLabel(inferred, href);
    }
    return preserveOrFormatSubjectLabel(cleaned || inferred, href);
  }

  if (!label) return undefined;
  if (label === "a page") return "Home";
  if (looksLikeIdentifier(label)) return undefined;
  const cleaned = stripTrailingShortIdToken(label);
  return looksLikeIdentifier(cleaned) ? undefined : formatActivityTitle(cleaned);
}

function likedTitleFromSummary(summary: string): string | undefined {
  const trimmed = summary.trim();
  if (/^someone liked$/i.test(trimmed)) return undefined;
  const rest = trimmed.replace(/^Someone liked\s+/i, "").trim();
  if (!rest) return undefined;
  if (rest === "a page") return "Home";
  return rest;
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

const PRIVATE_PULL_REQUEST_DUMMY_LABEL = "a pull request";

export function privatePullRequestSummary(type: "pr_opened" | "pr_merged"): string {
  return type === "pr_opened"
    ? "Opened a pull request in a private repo"
    : "Merged a pull request in a private repo";
}

function isPrivatePullRequestEvent(
  event: ActivityEvent,
): event is ActivityEvent & { type: "pr_opened" | "pr_merged" } {
  if (event.type !== "pr_opened" && event.type !== "pr_merged") return false;
  if (event.meta?.private === true) return true;
  return event.subject?.label === PRIVATE_PULL_REQUEST_DUMMY_LABEL && !event.subject.href;
}

function publicPullRequestHref(event: ActivityEvent): string | undefined {
  if (event.subject?.href) return event.subject.href;
  const metaHref = event.meta?.href;
  return typeof metaHref === "string" && metaHref ? metaHref : undefined;
}

/** Real PR title, or `repo#number` / “a pull request”. Never a site path title. */
function publicPullRequestLabel(event: ActivityEvent): string {
  const stored =
    event.subject?.label?.trim() ||
    (typeof event.meta?.title === "string" ? event.meta.title.trim() : "");
  if (stored && stored !== PRIVATE_PULL_REQUEST_DUMMY_LABEL) return stored;

  const repo = typeof event.meta?.repo === "string" ? event.meta.repo.trim() : "";
  const number = event.meta?.number;
  if (repo && typeof number === "number") return `${repo}#${number}`;
  return PRIVATE_PULL_REQUEST_DUMMY_LABEL;
}

export function getActivityRow(event: ActivityEvent): {
  summary: string;
  flag?: string;
  icon?: string;
  href?: string;
  label?: string;
} {
  if (isPrivatePullRequestEvent(event)) {
    return { summary: privatePullRequestSummary(event.type) };
  }

  if (event.type === "pr_opened" || event.type === "pr_merged") {
    const href = publicPullRequestHref(event);
    return {
      summary: event.summary,
      ...(href ? { href } : {}),
      label: publicPullRequestLabel(event),
    };
  }

  if (event.type === "caffeinated") {
    return attachSourceMetadata(event, {
      summary: event.summary,
      icon: getCaffeineIcon(caffeineDrinkFromEvent(event)),
      href: event.subject?.href,
      label: event.subject?.label,
    });
  }

  if (event.type === "visit") {
    const geo = geoFromVisitMeta(event.meta);
    const hasLocation = Boolean(geo.country || geo.city || geo.countryName);
    const storedText = visitDisplaySummary(event.summary);
    const summary = hasLocation
      ? visitDisplaySummary(formatVisitSummary(geo))
      : !storedText || storedText === "Visit"
        ? ANONYMOUS_VISIT_SUMMARY
        : storedText;
    return attachSourceMetadata(event, {
      summary,
      href: event.subject?.href,
      label: displaySubjectLabel(event.subject?.label, event.subject?.href),
    });
  }

  if (event.type === "visit_country_first") {
    return attachSourceMetadata(event, {
      summary: visitDisplaySummary(event.summary),
      href: event.subject?.href,
      label: displaySubjectLabel(event.subject?.label, event.subject?.href),
    });
  }

  if (event.type === "like") {
    const label = displaySubjectLabel(event.subject?.label, event.subject?.href, {
      preferStored: true,
    });
    const fromSummary = likedTitleFromSummary(event.summary);
    const name = label || fromSummary || "Home";
    return attachSourceMetadata(event, {
      summary: "Someone liked",
      href: event.subject?.href || (name === "Home" ? "/" : undefined),
      label: name,
    });
  }

  if (event.source === "shiori" && (event.type === "link_saved" || event.type === "link_clicked")) {
    return attachSourceMetadata(event, { summary: event.summary });
  }

  return attachSourceMetadata(event, {
    summary: event.summary,
    href: event.subject?.href,
    label: displaySubjectLabel(event.subject?.label, event.subject?.href),
  });
}

export function getRequestCountry(headers: Headers): string | undefined {
  return normalizeCountryCode(
    headers.get("cf-ipcountry") ??
      headers.get("CF-IPCountry") ??
      headers.get("x-vercel-ip-country") ??
      headers.get("x-country"),
  );
}
