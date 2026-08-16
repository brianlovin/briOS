/**
 * Shared activity-feed types and pure helpers.
 * Safe to import from client components (no Redis / Node crypto).
 */

import {
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

export function inferTitleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (!last) return "a page";
  try {
    return decodeURIComponent(last).replace(/-/g, " ");
  } catch {
    return last;
  }
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
    const full =
      geo.country || geo.city || geo.countryName ? formatVisitSummary(geo) : event.summary;
    const split = splitVisitSummaryFlag(full);
    const flag = split.flag || countryCodeToFlag(geo.country);
    return {
      summary: split.text,
      ...(flag ? { flag } : {}),
      href: event.subject?.href,
      label: event.subject?.label,
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
      label: event.subject?.label,
    };
  }

  return {
    summary: event.summary,
    href: event.subject?.href,
    label: event.subject?.label,
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
    case "pr_opened":
      return "PRs opened";
    case "pr_merged":
      return "PRs merged";
    case "repo_starred":
      return "Stars";
    case "caffeinated":
      return "Caffeinated";
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
