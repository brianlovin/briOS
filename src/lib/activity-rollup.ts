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
} from "./activity-shared";

export type ActivityRollup = {
  key: string;
  count: number;
  latest: ActivityEvent;
  /** Oldest event in the run — stable as newer siblings prepend. */
  anchorId: string;
  sectionLabel: string;
  href?: string;
};

export function activityStackReactKey(stack: Pick<ActivityRollup, "key" | "anchorId">): string {
  return `${stack.key}:${stack.anchorId}`;
}

export const ACTIVITY_ENTER_STAGGER_STEP = 0.1;
export const ACTIVITY_ENTER_STAGGER_MAX = 1;

/** Enter delays for keys that were not on screen last paint. First paint (`previous` null) is empty. */
export function activityEnterStaggerDelays(
  keys: string[],
  previous: Set<string> | null,
  step = ACTIVITY_ENTER_STAGGER_STEP,
  max = ACTIVITY_ENTER_STAGGER_MAX,
): Map<string, number> {
  const delays = new Map<string, number>();
  if (!previous) return delays;

  let index = 0;
  for (const key of keys) {
    if (previous.has(key)) continue;
    delays.set(key, Math.min(Number((index * step).toFixed(2)), max));
    index += 1;
  }
  return delays;
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

export function activityRollupKey(event: ActivityEvent): string {
  if (event.source === "shiori") {
    return `shiori:${event.type}`;
  }

  if (event.type === "like") {
    return `like:${activityEventHref(event) ?? ""}`;
  }

  if (event.type === "visit" || event.type === "visit_country_first") {
    const section = activitySectionFromPath(activityEventHref(event));
    return `visit:${visitGeoKey(event)}:${section}`;
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

  if (isVisit) {
    if (unique.size !== 1) return activitySectionPhrase(section);
    return labels[0] ?? activitySectionPhrase(section);
  }

  if (unique.size === 1) return labels[0]!;
  if (section) return activitySectionPhrase(section);
  return latestLabel ?? "";
}

function stackHref(events: ActivityEvent[]): string | undefined {
  const hrefs = [
    ...new Set(events.map(activityEventHref).filter((href): href is string => Boolean(href))),
  ];
  if (hrefs.length === 1) return hrefs[0];
  if (hrefs.length === 0) return undefined;
  const section = activitySectionFromPath(hrefs[0]);
  if (!section || section === "home") return "/";
  return `/${section}`;
}

export function rollupActivityEvents(events: ActivityEvent[]): ActivityRollup[] {
  const runs: Array<{
    key: string;
    count: number;
    latest: ActivityEvent;
    events: ActivityEvent[];
  }> = [];

  for (const event of events) {
    const key = activityRollupKey(event);
    const current = runs[runs.length - 1];
    if (current && current.key === key) {
      current.count += 1;
      current.events.push(event);
      continue;
    }
    runs.push({ key, count: 1, latest: event, events: [event] });
  }

  return runs.map((run) => {
    const section = activitySectionFromPath(activityEventHref(run.latest));
    const href = stackHref(run.events);
    return {
      key: run.key,
      count: run.count,
      latest: run.latest,
      anchorId: run.events[run.events.length - 1]!.id,
      sectionLabel: stackSectionLabel(run.events, section),
      ...(href ? { href } : {}),
    };
  });
}

export function shouldPulseActivityRollup(
  previous: { key: string; count: number } | null,
  next: { key: string; count: number } | undefined,
): boolean {
  return Boolean(previous && next && previous.key === next.key && next.count > previous.count);
}
