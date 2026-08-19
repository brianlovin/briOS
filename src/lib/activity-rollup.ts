/**
 * Client-side consecutive rollup for the activity feed.
 * Display-only — does not change Redis or ingest.
 */

import { formatVisitSummary, geoFromVisitMeta, splitVisitSummaryFlag } from "./activity-geo";
import {
  type ActivityEvent,
  activitySectionFromPath,
  activitySectionPhrase,
  formatVisitLocationHeader,
  getActivityRow,
  isAbsoluteHttpUrl,
  isHiddenLikeEvent,
  isHomeLikeTitle,
  isKnownActivitySection,
  visitLocationClusterKey,
  visitLocationPhrase,
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
};

/** Consecutive same-location visit stacks, rendered as one block. Actions are oldest → newest. */
export type ActivityVisitCluster = {
  type: "visit-cluster";
  locationKey: string;
  locationHeader: string;
  latest: ActivityEvent;
  actions: ActivityRollup[];
  /** Oldest event in the cluster — stable as newer actions append. */
  anchorId: string;
  count: number;
};

export type ActivityFeedItem = { type: "row"; stack: ActivityRollup } | ActivityVisitCluster;

export function activityStackReactKey(stack: Pick<ActivityRollup, "key" | "anchorId">): string {
  return `${stack.key}:${stack.anchorId}`;
}

export function activityVisitClusterReactKey(
  cluster: Pick<ActivityVisitCluster, "locationKey" | "anchorId">,
): string {
  return `visit-cluster:${cluster.locationKey}:${cluster.anchorId}`;
}

/** Consecutive same-source actions inside a location cluster. */
export type ActivityVisitSourceRun = {
  source: string;
  actions: ActivityRollup[];
};

export function visitClusterSourceRuns(actions: ActivityRollup[]): ActivityVisitSourceRun[] {
  const runs: ActivityVisitSourceRun[] = [];
  for (const action of actions) {
    const source = action.latest.source;
    const current = runs[runs.length - 1];
    if (current && current.source === source) {
      current.actions.push(action);
      continue;
    }
    runs.push({ source, actions: [action] });
  }
  return runs;
}

export function activityFeedItemReactKey(item: ActivityFeedItem): string {
  return item.type === "visit-cluster"
    ? activityVisitClusterReactKey(item)
    : activityStackReactKey(item.stack);
}

export function activityFeedItemCount(item: ActivityFeedItem): number {
  return item.type === "visit-cluster" ? item.count : item.stack.count;
}

export const ACTIVITY_ENTER_STAGGER_STEP = 0.22;
export const ACTIVITY_ENTER_STAGGER_MAX = 2;

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

  if (event.type === "site_added" || event.type === "stack_added") {
    const identity =
      event.subject?.label?.trim() ||
      (typeof event.meta?.title === "string" ? event.meta.title.trim() : "") ||
      event.summary;
    return `${event.source}:${event.type}:${identity}`;
  }

  return `${event.source}:${event.type}:${event.summary}`;
}

function sharedActivitySource(events: ActivityEvent[]): string | undefined {
  const source = events[0]?.source;
  if (!source || events.some((event) => event.source !== source)) return undefined;
  return source;
}

function stackSectionLabel(events: ActivityEvent[], section: string): string {
  const labels = events
    .map((event) => getActivityRow(event).label)
    .filter((label): label is string => Boolean(label));
  const unique = new Set(labels);
  const latestLabel = getActivityRow(events[0]!).label;
  const isVisit = events[0]?.type === "visit" || events[0]?.type === "visit_country_first";
  const source = sharedActivitySource(events);

  if (events[0]?.type === "like") {
    return latestLabel ?? "";
  }

  if (isVisit) {
    if (unique.size !== 1) return activitySectionPhrase(section, source);
    return labels[0] ?? activitySectionPhrase(section, source);
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
 * Consecutive visit-like stacks that share a location key become one cluster.
 * Actions inside a cluster are oldest → newest so a new same-place event appends
 * at the bottom. A different location or a non-visit starts a new block.
 * Does not change ×N rollup counts.
 */
export function clusterVisitLocationRuns(stacks: ActivityRollup[]): ActivityFeedItem[] {
  const items: Array<
    | { type: "row"; stack: ActivityRollup }
    | { type: "visit-cluster"; locationKey: string; newestFirst: ActivityRollup[] }
  > = [];

  for (const stack of stacks) {
    const locationKey = visitLocationClusterKey(stack.latest);
    const current = items[items.length - 1];
    if (locationKey && current?.type === "visit-cluster" && current.locationKey === locationKey) {
      current.newestFirst.push(stack);
      continue;
    }
    if (locationKey) {
      items.push({ type: "visit-cluster", locationKey, newestFirst: [stack] });
      continue;
    }
    items.push({ type: "row", stack });
  }

  return items.map((item) => {
    if (item.type === "row") return item;
    const actions = [...item.newestFirst].reverse();
    const newest = item.newestFirst[0]!;
    const oldest = actions[0]!;
    return {
      type: "visit-cluster",
      locationKey: item.locationKey,
      locationHeader: formatVisitLocationHeader(visitLocationPhrase(newest.latest)),
      latest: newest.latest,
      actions,
      anchorId: oldest.anchorId,
      count: actions.reduce((total, action) => total + action.count, 0),
    };
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
