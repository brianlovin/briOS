/**
 * Fake activity events for the /activity/sandbox page.
 * Display-only — never written to Redis.
 */

import { activityGeoToMeta, formatVisitSummary } from "./activity-geo";
import type { ActivityEvent, ActivityRef } from "./activity-shared";
import { ACTIVITY_ENVELOPE_VERSION } from "./activity-shared";

export type SandboxPlace = {
  city?: string;
  region?: string;
  regionName?: string;
  country: string;
  countryName: string;
  latitude?: number;
  longitude?: number;
};

export type SandboxPage = {
  path: string;
  label: string;
  kind?: string;
  source?: string;
};

export const SANDBOX_PLACES = {
  sf: {
    city: "San Francisco",
    region: "CA",
    regionName: "California",
    country: "US",
    countryName: "United States",
    latitude: 37.77,
    longitude: -122.42,
  },
  london: {
    city: "London",
    country: "GB",
    countryName: "United Kingdom",
    latitude: 51.51,
    longitude: -0.13,
  },
  tokyo: {
    city: "Tokyo",
    country: "JP",
    countryName: "Japan",
    latitude: 35.68,
    longitude: 139.69,
  },
  sydney: {
    city: "Sydney",
    region: "NSW",
    regionName: "New South Wales",
    country: "AU",
    countryName: "Australia",
    latitude: -33.87,
    longitude: 151.21,
  },
  berlin: {
    city: "Berlin",
    country: "DE",
    countryName: "Germany",
    latitude: 52.52,
    longitude: 13.4,
  },
  singapore: {
    city: "Singapore",
    country: "SG",
    countryName: "Singapore",
    latitude: 1.35,
    longitude: 103.82,
  },
  nairobi: {
    city: "Nairobi",
    country: "KE",
    countryName: "Kenya",
    latitude: -1.29,
    longitude: 36.82,
  },
  recife: {
    city: "Recife",
    country: "BR",
    countryName: "Brazil",
    latitude: -8.05,
    longitude: -34.9,
  },
} as const satisfies Record<string, SandboxPlace>;

export const SANDBOX_PAGES = {
  home: { path: "/", label: "the site", kind: "home" },
  ama: { path: "/ama", label: "AMA", kind: "page" },
  listening: { path: "/listening", label: "Listening", kind: "page" },
  writing: {
    path: "/writing/how-im-feeling-about-ai-in-august-2026-O7e1TFS",
    label: "How I'm Feeling About AI in August 2026",
    kind: "writing",
  },
  stack: { path: "/stack", label: "Stack", kind: "page" },
  hn: { path: "/hn", label: "Hacker News", kind: "page" },
  staffHome: {
    path: "/",
    label: "Staff.design",
    kind: "page",
    source: "staff-design",
  },
  staffInterview: {
    path: "/interviews/rasmus-andersson",
    label: "Rasmus Andersson",
    kind: "page",
    source: "staff-design",
  },
} as const satisfies Record<string, SandboxPage>;

let sandboxSeq = 0;

export function resetSandboxIds(): void {
  sandboxSeq = 0;
}

function nextSandboxId(prefix: string): string {
  sandboxSeq += 1;
  return `${prefix}-${sandboxSeq}`;
}

function nowIso(offsetMs = 0): string {
  return new Date(Date.now() + offsetMs).toISOString();
}

function baseEvent(
  overrides: Partial<ActivityEvent> & Pick<ActivityEvent, "type" | "summary">,
): ActivityEvent {
  const id = overrides.id ?? nextSandboxId(overrides.type);
  const ts = overrides.ts ?? nowIso();
  return {
    v: ACTIVITY_ENVELOPE_VERSION,
    id,
    ts,
    received_at: overrides.received_at ?? ts,
    source: "brios",
    speed: overrides.type === "visit" ? "signal" : "event",
    visibility: "public",
    idempotency_key: overrides.idempotency_key ?? id,
    ...overrides,
  };
}

export function sandboxVisit(
  place: SandboxPlace,
  page: SandboxPage = SANDBOX_PAGES.home,
  overrides: Partial<ActivityEvent> = {},
): ActivityEvent {
  const source = page.source ?? "brios";
  const summary = formatVisitSummary({
    country: place.country,
    countryName: place.countryName,
    region: place.region,
    regionName: place.regionName,
    city: place.city,
  });
  const subject: ActivityRef = {
    kind: page.kind ?? "page",
    label: page.label,
    href: page.path,
  };

  return baseEvent({
    type: "visit",
    source,
    summary,
    subject,
    meta: {
      ...activityGeoToMeta(place),
      path: page.path,
      title: page.label,
    },
    ...overrides,
  });
}

export function sandboxMysteriousVisit(
  page: SandboxPage = SANDBOX_PAGES.home,
  overrides: Partial<ActivityEvent> = {},
): ActivityEvent {
  return baseEvent({
    type: "visit",
    summary: "Visit",
    subject: { kind: page.kind ?? "page", label: page.label, href: page.path },
    meta: { path: page.path, title: page.label },
    ...overrides,
  });
}

export function sandboxLike(
  title: string,
  href: string,
  overrides: Partial<ActivityEvent> = {},
): ActivityEvent {
  return baseEvent({
    type: "like",
    summary: `Someone liked ${title}`,
    subject: { kind: "page", label: title, href },
    meta: { title, href },
    ...overrides,
  });
}

export function sandboxPullMerged(overrides: Partial<ActivityEvent> = {}): ActivityEvent {
  return baseEvent({
    type: "pr_merged",
    source: "github",
    summary: "Merged a pull request on brios",
    subject: {
      kind: "pull_request",
      label: "Scale down the activity globe",
      href: "https://github.com/brianlovin/brios/pull/412",
    },
    meta: {
      repo: "brios",
      number: 412,
      href: "https://github.com/brianlovin/brios/pull/412",
      additions: 48,
      deletions: 12,
    },
    ...overrides,
  });
}

export function sandboxCaffeinated(
  drink = "Latte",
  overrides: Partial<ActivityEvent> = {},
): ActivityEvent {
  return baseEvent({
    type: "caffeinated",
    summary: `Drank a ${drink.toLowerCase()}`,
    subject: { kind: "drink", label: drink },
    meta: { drink },
    ...overrides,
  });
}

export function sandboxShioriSave(overrides: Partial<ActivityEvent> = {}): ActivityEvent {
  return baseEvent({
    type: "link_saved",
    source: "shiori",
    summary: "Someone saved a link on Shiori",
    ...overrides,
  });
}

/** Newest-first, with slightly older timestamps further down the list. */
export function stampBatch(events: ActivityEvent[]): ActivityEvent[] {
  const newest = Date.now();
  return events.map((event, index) => {
    const ts = new Date(newest - index * 1000).toISOString();
    return { ...event, ts, received_at: ts };
  });
}

export const SANDBOX_SCENARIOS = {
  "batch-fetch": {
    label: "Batch fetch",
    hint: "Several new rows stagger in",
    build: (): ActivityEvent[] =>
      stampBatch([
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.writing),
        sandboxLike("Cursor", "/stack"),
        sandboxVisit(SANDBOX_PLACES.london, SANDBOX_PAGES.ama),
        sandboxCaffeinated("Flat white"),
        sandboxVisit(SANDBOX_PLACES.tokyo, SANDBOX_PAGES.listening),
        sandboxPullMerged(),
      ]),
  },
  "sf-cluster": {
    label: "SF cluster",
    hint: "Same location, different pages — rail",
    build: (): ActivityEvent[] =>
      stampBatch([
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.staffInterview),
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.staffHome),
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.writing),
      ]),
  },
  "same-page-rollup": {
    label: "Same-page ×N",
    hint: "Four AMA visits from SF stack",
    build: (): ActivityEvent[] =>
      stampBatch([
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.ama),
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.ama),
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.ama),
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.ama),
      ]),
  },
  "globe-burst": {
    label: "Globe burst",
    hint: "New dots in many cities",
    build: (): ActivityEvent[] =>
      stampBatch([
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.home),
        sandboxVisit(SANDBOX_PLACES.london, SANDBOX_PAGES.home),
        sandboxVisit(SANDBOX_PLACES.tokyo, SANDBOX_PAGES.home),
        sandboxVisit(SANDBOX_PLACES.sydney, SANDBOX_PAGES.home),
        sandboxVisit(SANDBOX_PLACES.berlin, SANDBOX_PAGES.home),
        sandboxVisit(SANDBOX_PLACES.singapore, SANDBOX_PAGES.home),
        sandboxVisit(SANDBOX_PLACES.nairobi, SANDBOX_PAGES.home),
        sandboxVisit(SANDBOX_PLACES.recife, SANDBOX_PAGES.home),
      ]),
  },
  "location-hop": {
    label: "Location hop",
    hint: "SF → London → Tokyo clusters",
    build: (): ActivityEvent[] =>
      stampBatch([
        sandboxVisit(SANDBOX_PLACES.tokyo, SANDBOX_PAGES.hn),
        sandboxVisit(SANDBOX_PLACES.london, SANDBOX_PAGES.listening),
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.ama),
      ]),
  },
  interrupt: {
    label: "Interrupted cluster",
    hint: "SF visits split by a like",
    build: (): ActivityEvent[] =>
      stampBatch([
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.stack),
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.listening),
        sandboxLike("How I'm Feeling About AI in August 2026", SANDBOX_PAGES.writing.path),
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.ama),
        sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.home),
      ]),
  },
  likes: {
    label: "Like stack",
    hint: "Three likes roll into + others",
    build: (): ActivityEvent[] =>
      stampBatch([
        sandboxLike("Cursor", "/stack"),
        sandboxLike("Listening", "/listening"),
        sandboxLike("AMA", "/ama"),
      ]),
  },
  "shiori-burst": {
    label: "Shiori ×N",
    hint: "Consecutive saves stack",
    build: (): ActivityEvent[] => stampBatch(Array.from({ length: 8 }, () => sandboxShioriSave())),
  },
  "grow-cluster": {
    label: "Grow cluster",
    hint: "Another SF visit — pulse, no enter",
    build: (): ActivityEvent[] => [sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.hn)],
  },
} as const;

export type SandboxScenarioId = keyof typeof SANDBOX_SCENARIOS;

export const SANDBOX_SINGLES = [
  {
    id: "visit-sf",
    label: "SF visit",
    build: () => sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.writing),
  },
  {
    id: "visit-london",
    label: "London visit",
    build: () => sandboxVisit(SANDBOX_PLACES.london, SANDBOX_PAGES.ama),
  },
  {
    id: "visit-tokyo",
    label: "Tokyo visit",
    build: () => sandboxVisit(SANDBOX_PLACES.tokyo, SANDBOX_PAGES.listening),
  },
  { id: "visit-mystery", label: "Mystery visit", build: () => sandboxMysteriousVisit() },
  { id: "like", label: "Like", build: () => sandboxLike("Cursor", "/stack") },
  { id: "pr", label: "PR merged", build: () => sandboxPullMerged() },
  { id: "coffee", label: "Coffee", build: () => sandboxCaffeinated("Latte") },
  { id: "shiori", label: "Shiori save", build: () => sandboxShioriSave() },
] as const;
