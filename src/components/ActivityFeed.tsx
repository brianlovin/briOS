"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { ActivityGlobe, type ActivityGlobeAimRequest } from "@/components/ActivityGlobe";
import { Activity } from "@/components/icons/Activity";
import { Github } from "@/components/icons/Github";
import { Heart } from "@/components/icons/Heart";
import { Shiori } from "@/components/icons/Shiori";
import { StaffDesign } from "@/components/icons/StaffDesign";
import { World } from "@/components/icons/World";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { SlotDigits } from "@/components/SlotDigits";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import {
  type ActivityEvent,
  activityEventLocation,
  type ActivityFeedItem,
  type ActivityLikeTarget,
  type ActivityRollup,
  type ActivityVisitCluster,
} from "@/lib/activity";
import type { ActivityGlobeConfig } from "@/lib/activity-globe-config";
import {
  activityFeedItemCount,
  activityFeedItemReactKey,
  activityStackReactKey,
  clusterVisitLocationRuns,
  nextActivityEnterState,
  rollupActivityEvents,
  shouldPulseActivityRollup,
} from "@/lib/activity-rollup";
import {
  ACTIVITY_TRACKED_SINCE_TOOLTIP,
  activitySourceFaviconSrc,
  activitySourceUrl,
  formatLikeOthersLabel,
  getActivityRow,
  getMergedPullRequestDiff,
  isHomeLikeTitle,
  resolveActivitySourceHref,
} from "@/lib/activity-shared";
import { useActivity } from "@/lib/hooks/useActivity";
import { cn } from "@/lib/utils";

function ActivitySourceFavicon({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <World size={16} className="text-tertiary" aria-hidden />;
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element -- tiny static favicon */
    <img
      src={src}
      alt=""
      width={16}
      height={16}
      className="block size-4 rounded-[3px]"
      aria-hidden
      onError={() => setFailed(true)}
    />
  );
}

function isGithubActivity(event: ActivityEvent): boolean {
  return (
    event.source === "github" ||
    event.type === "pr_opened" ||
    event.type === "pr_merged" ||
    event.type === "repo_starred"
  );
}

function ActivityRowIcon({ event, icon }: { event: ActivityEvent; icon?: string }) {
  if (event.source === "shiori") {
    return <Shiori size={16} />;
  }

  if (event.source === "staff-design") {
    return <StaffDesign size={20} className="text-primary" aria-hidden />;
  }

  if (event.type === "like") {
    return <Heart size={24} className="fill-current text-red-500" aria-hidden />;
  }

  if (isGithubActivity(event)) {
    return <Github size={20} className="text-primary" aria-hidden />;
  }

  if (event.type === "visit" || event.type === "visit_country_first" || event.type === "download") {
    const faviconSrc = activitySourceFaviconSrc(event.source);
    if (faviconSrc) {
      return <ActivitySourceFavicon src={faviconSrc} />;
    }
    return <World size={16} className="text-tertiary" aria-hidden />;
  }

  if (event.type === "caffeinated") {
    return (
      <span className="text-base leading-none" aria-hidden>
        {icon ?? "🥤"}
      </span>
    );
  }

  return <Activity size={16} className="text-tertiary" aria-hidden />;
}

function isAbsoluteHttpUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function ActivityContextLink({ href, children }: { href: string; children: ReactNode }) {
  const className = "text-tertiary hover:text-primary underline-offset-2 hover:underline";
  if (isAbsoluteHttpUrl(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function LikeOthersTooltip({
  targets,
  otherCount,
}: {
  targets: ActivityLikeTarget[];
  otherCount: number;
}) {
  return (
    <Tooltip delay={0} closeDelay={0}>
      <TooltipTrigger
        delay={0}
        closeDelay={0}
        className="text-tertiary cursor-default bg-transparent p-0"
      >
        {formatLikeOthersLabel(otherCount)}
        <span className="sr-only">{targets.map((target) => target.title).join(", ")}</span>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="start"
        collisionPadding={8}
        container={typeof document === "undefined" ? undefined : document.body}
        className="overflow-visible"
      >
        <ul className="flex flex-col gap-1">
          {targets.map((target) => (
            <li key={`${target.title}:${target.href ?? ""}`}>
              {target.href ? (
                <ActivityContextLink href={target.href}>{target.title}</ActivityContextLink>
              ) : (
                <span>{target.title}</span>
              )}
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}

function likeTargetsFromRow(
  event: ActivityEvent,
  row: ReturnType<typeof getActivityRow>,
  likeTargets?: ActivityLikeTarget[],
): ActivityLikeTarget[] {
  if (likeTargets && likeTargets.length > 0) return likeTargets;
  const title = row.label?.trim();
  if (event.type !== "like" || !title || isHomeLikeTitle(title)) return [];
  return [{ title, ...(row.href ? { href: row.href } : {}) }];
}

function ActivityCountChip({ count }: { count: number }) {
  return (
    <span
      data-count={count}
      className="text-tertiary border-secondary shrink-0 -translate-y-0.5 rounded-sm border px-1.5 py-px font-mono text-xs leading-4 tabular-nums"
    >
      ×<SlotDigits value={count} />
    </span>
  );
}

export function ActivityRow({
  event,
  count = 1,
  sectionLabel,
  href: hrefOverride,
  pulse = false,
  likeTargets: likeTargetsProp,
  onAimGlobe,
}: {
  event: ActivityEvent;
  count?: number;
  sectionLabel?: string;
  href?: string;
  pulse?: boolean;
  likeTargets?: ActivityLikeTarget[];
  onAimGlobe?: (event: ActivityEvent) => void;
}) {
  const row = getActivityRow(event);
  const homeUrl = activitySourceUrl(event.source);
  const isLike = event.type === "like";
  const likeTargets = likeTargetsFromRow(event, row, likeTargetsProp);
  const featured = likeTargets[0];
  const othersCount = Math.max(0, likeTargets.length - 1);
  const likeTitle = featured?.title ?? "";
  const label = isLike ? likeTitle : (sectionLabel ?? row.label);
  const rawHref = hrefOverride ?? featured?.href ?? row.href;
  const href =
    resolveActivitySourceHref(event.source, rawHref) ??
    rawHref ??
    (isLike ? undefined : label || event.type === "download" ? homeUrl : undefined);
  const context = isLike ? likeTitle : (label ?? (href || undefined));
  const diff = event.type === "pr_merged" ? getMergedPullRequestDiff(event.meta) : null;
  const showCountChip = count > 1 && !(isLike && othersCount > 0);
  const canAimGlobe = Boolean(onAimGlobe && activityEventLocation(event));

  if (isLike && likeTargets.length === 0) {
    return null;
  }

  return (
    <div
      data-rollup-pulse={pulse ? "" : undefined}
      className={cn(
        "group hover:bg-secondary relative isolate flex items-center gap-3 px-4 py-3 md:py-2 md:dark:hover:bg-white/5",
        canAimGlobe && "cursor-pointer",
      )}
      onClick={
        canAimGlobe
          ? (click) => {
              if (click.target instanceof Element && click.target.closest("a")) return;
              onAimGlobe?.(event);
            }
          : undefined
      }
    >
      {pulse ? (
        <span
          key={event.id}
          aria-hidden
          className="activity-rollup-pulse pointer-events-none absolute inset-0 z-0"
        />
      ) : null}
      <div className="relative z-10 flex min-w-0 flex-1 items-center gap-3">
        <div className="flex size-8 flex-none items-center justify-center">
          <ActivityRowIcon event={event} icon={row.icon} />
        </div>
        <p className="flex min-w-0 items-baseline gap-1.5">
          <span className="min-w-0">
            <span className="text-primary">{row.summary}</span>
            {href && context ? (
              <>
                {" "}
                <ActivityContextLink href={href}>{context}</ActivityContextLink>
              </>
            ) : context ? (
              <span className="text-tertiary"> {context}</span>
            ) : null}
            {isLike && othersCount > 0 ? (
              <>
                {" "}
                <LikeOthersTooltip targets={likeTargets} otherCount={othersCount} />
              </>
            ) : null}
          </span>
          {showCountChip ? <ActivityCountChip count={count} /> : null}
          {diff ? (
            <span className="shrink-0 text-sm tabular-nums">
              <span className="text-green-600">+{diff.additions}</span>{" "}
              <span className="text-red-500">-{diff.deletions}</span>
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

function VisitClusterRail() {
  return (
    <span
      aria-hidden
      className="text-tertiary pointer-events-none absolute top-8 right-0 bottom-[calc((1lh+0.25rem)/2-3px)] left-[calc(50%-1px)] rounded-bl-lg border-b-2 border-l-2 border-black/10 dark:border-white/15"
    />
  );
}

function ActivityClusterAction({
  stack,
  pulse = false,
}: {
  stack: ActivityRollup;
  pulse?: boolean;
}) {
  const row = getActivityRow(stack.latest, { omitVisitLocation: true });
  const label = stack.sectionLabel ?? row.label;
  const rawHref = stack.href ?? row.href;
  const href = resolveActivitySourceHref(stack.latest.source, rawHref) ?? rawHref;
  const context = label ?? (href || undefined);
  const showCountChip = stack.count > 1;

  return (
    <li className="relative flex items-baseline gap-1.5 py-0.5">
      {pulse ? (
        <span
          key={stack.latest.id}
          aria-hidden
          className="activity-rollup-pulse pointer-events-none absolute inset-0 z-0"
        />
      ) : null}
      <span className="relative z-10 min-w-0">
        <span className="text-tertiary">{row.summary}</span>
        {href && context ? (
          <>
            {" "}
            <ActivityContextLink href={href}>{context}</ActivityContextLink>
          </>
        ) : context ? (
          <span className="text-tertiary"> {context}</span>
        ) : null}
      </span>
      {showCountChip ? <ActivityCountChip count={stack.count} /> : null}
    </li>
  );
}

function ActivityVisitClusterBlock({
  cluster,
  pulse = false,
  pulseActionKey = null,
  onAimGlobe,
}: {
  cluster: ActivityVisitCluster;
  pulse?: boolean;
  pulseActionKey?: string | null;
  onAimGlobe?: (event: ActivityEvent) => void;
}) {
  const iconEvent = cluster.actions[0]?.latest ?? cluster.latest;
  const showRail = cluster.actions.length > 1;
  const canAimGlobe = Boolean(onAimGlobe && activityEventLocation(cluster.latest));

  if (cluster.actions.length === 1) {
    const stack = cluster.actions[0]!;
    return (
      <ActivityRow
        event={stack.latest}
        count={stack.count}
        sectionLabel={stack.sectionLabel}
        href={stack.href}
        likeTargets={stack.likeTargets}
        pulse={pulse}
        onAimGlobe={onAimGlobe}
      />
    );
  }

  return (
    <div
      data-rollup-pulse={pulse ? "" : undefined}
      className={cn(
        "group hover:bg-secondary relative isolate px-4 py-3 md:py-2 md:dark:hover:bg-white/5",
        canAimGlobe && "cursor-pointer",
      )}
      onClick={
        canAimGlobe
          ? (click) => {
              if (click.target instanceof Element && click.target.closest("a")) return;
              onAimGlobe?.(cluster.latest);
            }
          : undefined
      }
    >
      {pulse ? (
        <span
          key={cluster.latest.id}
          aria-hidden
          className="activity-rollup-pulse pointer-events-none absolute inset-0 z-0"
        />
      ) : null}
      <div className="relative z-10 flex items-start gap-3">
        <div className="relative w-8 flex-none self-stretch">
          <div className="flex size-8 items-center justify-center">
            <ActivityRowIcon event={iconEvent} />
          </div>
          {showRail ? <VisitClusterRail /> : null}
        </div>
        <div className="mt-[5px] min-w-0 flex-1">
          <p className="text-primary">{cluster.locationHeader}</p>
          <ul className="mt-1 flex flex-col gap-1">
            {cluster.actions.map((action) => {
              const actionKey = activityStackReactKey(action);
              return (
                <ActivityClusterAction
                  key={actionKey}
                  stack={action}
                  pulse={pulseActionKey === actionKey}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ActivityTrackedCount({ count }: { count: number }) {
  const formatted = count.toLocaleString("en-US");

  return (
    <Tooltip delay={0} closeDelay={0}>
      <TooltipTrigger
        delay={0}
        closeDelay={0}
        aria-label={`${formatted}. ${ACTIVITY_TRACKED_SINCE_TOOLTIP}`}
        className="text-quaternary hidden cursor-default bg-transparent p-0 font-mono text-sm tabular-nums md:inline"
      >
        <SlotDigits value={count} />
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="end"
        collisionPadding={8}
        container={typeof document === "undefined" ? undefined : document.body}
        collisionBoundary={typeof document === "undefined" ? undefined : document.documentElement}
        className="overflow-visible whitespace-nowrap"
      >
        {ACTIVITY_TRACKED_SINCE_TOOLTIP}
      </TooltipContent>
    </Tooltip>
  );
}

const ROLLUP_PULSE_MS = 1500;
const LIST_MOTION = { duration: 0.36, ease: [0.22, 1, 0.36, 1] } as const;

function useEnterPulseKeys(incoming: string[], enabled: boolean): Set<string> {
  const [keys, setKeys] = useState<Set<string>>(() => new Set());
  const timersRef = useRef<Map<string, number>>(new Map());

  let next = keys;
  if (enabled && incoming.length > 0) {
    const merged = new Set(keys);
    let added = false;
    for (const key of incoming) {
      if (!merged.has(key)) {
        merged.add(key);
        added = true;
      }
    }
    if (added) next = merged;
  }
  if (next !== keys) setKeys(next);

  useEffect(() => {
    for (const key of next) {
      if (timersRef.current.has(key)) continue;
      const timeout = window.setTimeout(() => {
        timersRef.current.delete(key);
        setKeys((current) => {
          if (!current.has(key)) return current;
          const remaining = new Set(current);
          remaining.delete(key);
          return remaining;
        });
      }, ROLLUP_PULSE_MS);
      timersRef.current.set(key, timeout);
    }
  }, [next]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const id of timers.values()) window.clearTimeout(id);
    };
  }, []);

  return next;
}

function subscribeNoop(): () => void {
  return () => {};
}

function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

function pruneEnterDelays(delays: Map<string, number>, liveKeys: Set<string>): Map<string, number> {
  let changed = false;
  const next = new Map<string, number>();
  for (const [key, delay] of delays) {
    if (liveKeys.has(key)) next.set(key, delay);
    else changed = true;
  }
  return changed ? next : delays;
}

function mergeEnterDelays(
  current: Map<string, number>,
  pending: Map<string, number>,
  liveKeys: Set<string>,
): Map<string, number> {
  let next = current;
  if (pending.size > 0) {
    next = new Map(current);
    for (const [key, delay] of pending) next.set(key, delay);
  }
  return pruneEnterDelays(next, liveKeys);
}

function ActivityStackList({
  items,
  pulseKey,
  pulseActionKey,
  onAimGlobe,
}: {
  items: ActivityFeedItem[];
  pulseKey: string | null;
  pulseActionKey: string | null;
  onAimGlobe?: (event: ActivityEvent) => void;
}) {
  const hydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const canAnimate = hydrated && prefersReducedMotion !== true;
  const keys = items.map(activityFeedItemReactKey);
  const liveKeys = new Set(keys);
  const [seenKeys, setSeenKeys] = useState<Set<string> | null>(null);
  const [enterDelays, setEnterDelays] = useState<Map<string, number>>(() => new Map());
  const { seen, delays: pending } = nextActivityEnterState(keys, seenKeys);
  const nextDelays = mergeEnterDelays(enterDelays, pending, liveKeys);
  const enterPulseKeys = useEnterPulseKeys(canAnimate ? [...nextDelays.keys()] : [], canAnimate);

  let nextSeen = seen;
  const prunedSeen = new Set([...nextSeen].filter((key) => liveKeys.has(key)));
  if (prunedSeen.size !== nextSeen.size) nextSeen = prunedSeen;

  if (nextSeen !== seenKeys) setSeenKeys(nextSeen);
  if (nextDelays !== enterDelays) setEnterDelays(nextDelays);

  return (
    <div className="divide-secondary divide-y">
      <AnimatePresence initial={false}>
        {items.map((item) => {
          const reactKey = activityFeedItemReactKey(item);
          const delay = nextDelays.get(reactKey);
          const isEntering = canAnimate && delay !== undefined;
          const pulse = pulseKey === reactKey || enterPulseKeys.has(reactKey);

          return (
            <motion.div
              key={reactKey}
              initial={isEntering ? { height: 0, opacity: 0 } : false}
              animate={isEntering ? { height: "auto", opacity: 1 } : false}
              exit={canAnimate ? { height: 0, opacity: 0 } : undefined}
              transition={isEntering ? { ...LIST_MOTION, delay } : { duration: 0 }}
              onAnimationComplete={() => {
                setEnterDelays((current) => {
                  if (!current.has(reactKey)) return current;
                  const remaining = new Map(current);
                  remaining.delete(reactKey);
                  return remaining;
                });
              }}
              className="overflow-hidden"
            >
              <div>
                {item.type === "visit-cluster" ? (
                  <ActivityVisitClusterBlock
                    cluster={item}
                    pulse={pulse}
                    pulseActionKey={pulseKey === reactKey ? pulseActionKey : null}
                    onAimGlobe={onAimGlobe}
                  />
                ) : (
                  <ActivityRow
                    event={item.stack.latest}
                    count={item.stack.count}
                    sectionLabel={item.stack.sectionLabel}
                    href={item.stack.href}
                    likeTargets={item.stack.likeTargets}
                    pulse={pulse}
                    onAimGlobe={onAimGlobe}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function newestActionKey(item: ActivityFeedItem): string {
  if (item.type === "row") return activityStackReactKey(item.stack);
  const newest = item.actions[item.actions.length - 1]!;
  return activityStackReactKey(newest);
}

function useRollupPulse(items: ActivityFeedItem[]): {
  pulseKey: string | null;
  pulseActionKey: string | null;
} {
  const prefersReducedMotion = useReducedMotion();
  const top = items[0];
  const topReactKey = top ? activityFeedItemReactKey(top) : null;
  const topActionKey = top ? newestActionKey(top) : null;
  const topCount = top ? activityFeedItemCount(top) : 0;
  const [seenTop, setSeenTop] = useState<{ key: string; count: number } | null>(null);
  const [pulseKey, setPulseKey] = useState<string | null>(null);
  const [pulseActionKey, setPulseActionKey] = useState<string | null>(null);
  const nextSeen = topReactKey && top ? { key: topReactKey, count: topCount } : null;
  const shouldPulse =
    prefersReducedMotion !== true && shouldPulseActivityRollup(seenTop, nextSeen ?? undefined);
  const seenChanged = seenTop?.key !== nextSeen?.key || seenTop?.count !== nextSeen?.count;

  if (seenChanged) {
    setSeenTop(nextSeen);
    if (shouldPulse && topReactKey) {
      setPulseKey(topReactKey);
      setPulseActionKey(topActionKey);
    } else if (pulseKey && nextSeen?.key !== pulseKey) {
      setPulseKey(null);
      setPulseActionKey(null);
    }
  }

  useEffect(() => {
    if (!pulseKey) return;
    const timeout = window.setTimeout(() => {
      setPulseKey(null);
      setPulseActionKey(null);
    }, ROLLUP_PULSE_MS);
    return () => window.clearTimeout(timeout);
  }, [pulseKey, topCount]);

  if (shouldPulse && topReactKey) {
    return { pulseKey: topReactKey, pulseActionKey: topActionKey };
  }
  return { pulseKey, pulseActionKey };
}

export function ActivityFeed({
  initialEvents,
  initialCount,
  events: controlledEvents,
  globeConfig,
}: {
  initialEvents: ActivityEvent[];
  initialCount: number;
  /** When set, skip live polling and render this list. Used by the sandbox. */
  events?: ActivityEvent[];
  count?: number;
  globeConfig?: ActivityGlobeConfig;
}) {
  const live = useActivity(initialEvents, initialCount, {
    enabled: controlledEvents === undefined,
  });
  const events = controlledEvents ?? live.events;
  const items = useMemo(() => clusterVisitLocationRuns(rollupActivityEvents(events)), [events]);
  const { pulseKey, pulseActionKey } = useRollupPulse(items);
  const [globeAim, setGlobeAim] = useState<ActivityGlobeAimRequest | null>(null);
  const handleAimGlobe = useCallback((event: ActivityEvent) => {
    const location = activityEventLocation(event);
    if (!location) return;
    setGlobeAim((current) => ({ location, nonce: (current?.nonce ?? 0) + 1 }));
  }, []);

  return (
    <ListDetailWrapper>
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <div data-scrollable className="relative min-w-0 flex-1 overflow-auto">
          {events.length === 0 ? (
            <p className="text-tertiary px-4 py-10">
              Nothing yet. Likes and visits will show up here.
            </p>
          ) : (
            <>
              <ActivityStackList
                items={items}
                pulseKey={pulseKey}
                pulseActionKey={pulseActionKey}
                onAimGlobe={handleAimGlobe}
              />
              <p className="text-tertiary p-32 text-center text-sm">
                Older activity is dust in the wind...
              </p>
            </>
          )}
        </div>
        <ActivityGlobe events={events} aim={globeAim} config={globeConfig} />
      </div>
    </ListDetailWrapper>
  );
}
