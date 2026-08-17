/**
 * Client-side consecutive rollup for the activity feed.
 * Display-only — does not change Redis or ingest.
 */

import { formatVisitSummary, geoFromVisitMeta, splitVisitSummaryFlag } from "./activity-geo";
import {
  type ActivityEvent,
  activitySectionFromPath,
  activitySectionPhrase,
  getActivityRow,
  isAbsoluteHttpUrl,
  isHiddenLikeEvent,
  isHomeLikeTitle,
  isKnownActivitySection,
  visitLocationClusterKey,
} from "./activity-shared";

export type ActivityLikeTarget = {
  title: string;
  href?: string;
};

export type ActivityRollup = {
  key: string;
  count: number;
  latest: ActivityEvent;
  /** Oldest event in the run — stable as newer siblings prepend. */
  anchorId: string;
  sectionLabel: string;
  href?: string;
  likeTargets?: ActivityLikeTarget[];
  /** Older same-location visit in a consecutive run — omit the someone/location prefix. */
  omitVisitLocation?: boolean;
};

export function activityStackReactKey(stack: Pick<ActivityRollup, "key" | "anchorId">): string {
  return `${stack.key}:${stack.anchorId}`;
}

export const ACTIVITY_ENTER_STAGGER_STEP = 0.05;
export const ACTIVITY_ENTER_STAGGER_MAX = 0.4;

/**
 * Enter delays for keys that were not on screen last paint. First paint (`previous` null) is empty.
 * `keys` is newest-first; the oldest incoming key gets delay 0 so the batch streams in chronologically.
 */
export function activityEnterStaggerDelays(
  keys: string[],
  previous: Set<string> | null,
  step = ACTIVITY_ENTER_STAGGER_STEP,
  max = ACTIVITY_ENTER_STAGGER_MAX,
): Map<string, number> {
  const delays = new Map<string, number>();
  if (!previous) return delays;

  const incoming = keys.filter((key) => !previous.has(key));
  const last = incoming.length - 1;
  incoming.forEach((key, index) => {
    const fromOldest = last - index;
    delays.set(key, Math.min(Number((fromOldest * step).toFixed(2)), max));
  });
  return delays;
}

/**
 * First committed key set is already on screen — no enter delays.
 * Later keys not in `previous` get oldest-first stagger delays; existing keys do not.
 */
export function nextActivityEnterState(
  keys: string[],
  previous: Set<string> | null,
  step = ACTIVITY_ENTER_STAGGER_STEP,
  max = ACTIVITY_ENTER_STAGGER_MAX,
): { seen: Set<string>; delays: Map<string, number> } {
  if (previous === null) {
    return { seen: new Set(keys), delays: new Map() };
  }

  const delays = activityEnterStaggerDelays(keys, previous, step, max);
  if (delays.size === 0) return { seen: previous, delays };

  const seen = new Set(previous);
  for (const key of keys) seen.add(key);
  return { seen, delays };
}

export function activityEventHref(event: ActivityEvent): string | undefined {
  if (event.subject?.href) return event.subject.href;
  const path = event.meta?.path;
  return typeof path === "string" && path ? path : undefined;
}

function visitGeoKey(event: ActivityEvent): string {
  const geo = geoFromVisitMeta(event.meta);
  const fromMeta = splitVisitSummaryFlag(formatVisitSummary(geo))
    .text.replace(/^First visit from\s+/i, "")
    .replace(/^Visit from\s+/i, "")
    .trim()
    .toLowerCase();
  if (fromMeta && fromMeta !== "visit") return fromMeta;

  return (event.summary ?? "")
    .replace(/^(?:\p{Regional_Indicator}{2}\s*)/u, "")
    .replace(/^First visit from\s+/i, "")
    .replace(/^Visit from\s+/i, "")
    .trim()
    .toLowerCase();
}

function pullRequestIdentity(event: ActivityEvent): string {
  const href = event.subject?.href?.trim();
  if (href) return href;

  const repo = typeof event.meta?.repo === "string" ? event.meta.repo.trim() : "";
  const number = event.meta?.number;
  if (repo && (typeof number === "number" || typeof number === "string")) {
    return `${repo}#${number}`;
  }
  if (typeof number === "number" || typeof number === "string") {
    return `#${number}`;
  }
  return event.summary;
}

export function activityRollupKey(event: ActivityEvent): string {
  if (event.source === "shiori") {
    return `shiori:${event.type}`;
  }

  if (event.type === "like") {
    return "like";
  }

  if (event.type === "visit" || event.type === "visit_country_first") {
    const section = activitySectionFromPath(activityEventHref(event));
    return `visit:${visitGeoKey(event)}:${section}`;
  }

  if (event.type === "pr_opened" || event.type === "pr_merged") {
    return `${event.source}:${event.type}:${pullRequestIdentity(event)}`;
  }

  return `${event.source}:${event.type}:${event.summary}`;
}

function stackSectionLabel(events: ActivityEvent[], section: string): string {
  const labels = events
    .map((event) => getActivityRow(event).label)
    .filter((label): label is string => Boolean(label));
  const unique = new Set(labels);
  const latestLabel = getActivityRow(events[0]!).label;
  const isVisit = events[0]?.type === "visit" || events[0]?.type === "visit_country_first";

  if (events[0]?.type === "like") {
    return latestLabel ?? "";
  }

  if (isVisit) {
    if (unique.size !== 1) return activitySectionPhrase(section);
    return labels[0] ?? activitySectionPhrase(section);
  }

  if (unique.size === 1) return labels[0]!;
  if (section) return activitySectionPhrase(section);
  return latestLabel ?? "";
}

function uniqueLikeTargets(events: ActivityEvent[]): ActivityLikeTarget[] {
  const seen = new Set<string>();
  const targets: ActivityLikeTarget[] = [];
  for (const event of events) {
    const row = getActivityRow(event);
    const title = row.label?.trim();
    if (!title || isHomeLikeTitle(title)) continue;
    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    targets.push({ title, ...(row.href ? { href: row.href } : {}) });
  }
  return targets;
}

function stackHref(events: ActivityEvent[]): string | undefined {
  if (events[0]?.type === "like") {
    return activityEventHref(events[0]);
  }
  const hrefs = [
    ...new Set(events.map(activityEventHref).filter((href): href is string => Boolean(href))),
  ];
  if (hrefs.length === 1) return hrefs[0];
  if (hrefs.length === 0) return undefined;

  const latest = activityEventHref(events[0]!);
  if (hrefs.every((href) => isAbsoluteHttpUrl(href))) {
    return latest;
  }

  const section = activitySectionFromPath(hrefs[0]);
  if (!section || section === "home") return "/";
  if (!isKnownActivitySection(section)) return latest;
  const collapsed = `/${section}`;
  return collapsed === "/https:" || collapsed === "/http:" ? latest : collapsed;
}

/**
 * Display pass over already-rolled-up stacks (newest first).
 * Consecutive visit-like rows that share a location key keep the full sentence
 * on the newest row and drop the someone/location prefix on older siblings.
 * Does not merge rows or change ×N rollup counts.
 */
export function markVisitLocationContinuations(stacks: ActivityRollup[]): ActivityRollup[] {
  let previousKey: string | undefined;
  return stacks.map((stack) => {
    const key = visitLocationClusterKey(stack.latest);
    const omitVisitLocation = Boolean(key && key === previousKey);
    previousKey = key;
    if (stack.omitVisitLocation === omitVisitLocation) return stack;
    if (!omitVisitLocation && stack.omitVisitLocation === undefined) return stack;
    return { ...stack, omitVisitLocation };
  });
}

/** Consecutive runs only — an interrupting event always starts a new stack. */
export function rollupActivityEvents(events: ActivityEvent[]): ActivityRollup[] {
  const runs: Array<{
    key: string;
    count: number;
    latest: ActivityEvent;
    events: ActivityEvent[];
  }> = [];

  for (const event of events) {
    if (isHiddenLikeEvent(event)) continue;
    const key = activityRollupKey(event);
    const current = runs[runs.length - 1];
    if (current && current.key === key) {
      current.count += 1;
      current.events.push(event);
      continue;
    }
    runs.push({ key, count: 1, latest: event, events: [event] });
  }

  return runs.flatMap((run) => {
    const section = activitySectionFromPath(activityEventHref(run.latest));
    const href = stackHref(run.events);
    const likeTargets = run.latest.type === "like" ? uniqueLikeTargets(run.events) : undefined;
    if (run.latest.type === "like" && (!likeTargets || likeTargets.length === 0)) {
      return [];
    }
    return [
      {
        key: run.key,
        count: run.count,
        latest: run.latest,
        anchorId: run.events[run.events.length - 1]!.id,
        sectionLabel: stackSectionLabel(run.events, section),
        ...(href ? { href } : {}),
        ...(likeTargets && likeTargets.length > 0 ? { likeTargets } : {}),
      },
    ];
  });
}

export function shouldPulseActivityRollup(
  previous: { key: string; count: number } | null,
  next: { key: string; count: number } | undefined,
): boolean {
  return Boolean(previous && next && previous.key === next.key && next.count > previous.count);
}
