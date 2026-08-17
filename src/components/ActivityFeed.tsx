"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { type ReactNode, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { Activity } from "@/components/icons/Activity";
import { Github } from "@/components/icons/Github";
import { Heart } from "@/components/icons/Heart";
import { Shiori } from "@/components/icons/Shiori";
import { World } from "@/components/icons/World";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { RollingDigits } from "@/components/RollingDigits";
import { useTopBarActions } from "@/components/TopBarActions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import type { ActivityEvent, ActivityRollup } from "@/lib/activity";
import {
  activityStackReactKey,
  nextActivityEnterState,
  rollupActivityEvents,
  shouldPulseActivityRollup,
} from "@/lib/activity-rollup";
import {
  ACTIVITY_TRACKED_SINCE_TOOLTIP,
  activitySourceFaviconSrc,
  activitySourceUrl,
  formatTrackedEventsLabel,
  getActivityRow,
  getMergedPullRequestDiff,
  resolveActivitySourceHref,
} from "@/lib/activity-shared";
import { useActivity } from "@/lib/hooks/useActivity";
import { cn } from "@/lib/utils";

function ActivitySourceFavicon({ src, source }: { src: string; source: string }) {
  const [failed, setFailed] = useState(false);
  const size = source === "staff-design" ? 20 : 16;
  if (failed) {
    return <World size={16} className="text-tertiary" aria-hidden />;
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element -- tiny static favicon */
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn("block rounded-[3px]", size === 20 ? "size-5" : "size-4")}
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

  if (event.type === "like") {
    return <Heart size={16} className="fill-current text-red-500" aria-hidden />;
  }

  if (isGithubActivity(event)) {
    return <Github size={20} className="text-primary" aria-hidden />;
  }

  if (event.type === "visit" || event.type === "visit_country_first" || event.type === "download") {
    const faviconSrc = activitySourceFaviconSrc(event.source);
    if (faviconSrc) {
      return <ActivitySourceFavicon src={faviconSrc} source={event.source} />;
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

export function ActivityRow({
  event,
  count = 1,
  sectionLabel,
  href: hrefOverride,
  pulse = false,
}: {
  event: ActivityEvent;
  count?: number;
  sectionLabel?: string;
  href?: string;
  pulse?: boolean;
}) {
  const row = getActivityRow(event);
  const homeUrl = activitySourceUrl(event.source);
  const isLike = event.type === "like";
  const likeTitle = isLike ? row.label || "Home" : "";
  const label = isLike ? likeTitle : (sectionLabel ?? row.label);
  const rawHref = hrefOverride ?? row.href;
  const href =
    resolveActivitySourceHref(event.source, rawHref) ??
    rawHref ??
    (isLike
      ? likeTitle === "Home"
        ? (homeUrl ?? "/")
        : undefined
      : label || event.type === "download"
        ? homeUrl
        : undefined);
  const context = isLike ? likeTitle : (label ?? (href || undefined));
  const diff = event.type === "pr_merged" ? getMergedPullRequestDiff(event.meta) : null;

  return (
    <div
      data-rollup-pulse={pulse ? "" : undefined}
      className="group hover:bg-secondary relative isolate flex items-center gap-3 px-4 py-3 md:gap-4 md:py-2 md:dark:hover:bg-white/5"
    >
      {pulse ? (
        <span
          key={event.id}
          aria-hidden
          className="activity-rollup-pulse pointer-events-none absolute inset-0 z-0"
        />
      ) : null}
      <div className="relative z-10 flex size-8 shrink-0 items-center justify-center">
        <ActivityRowIcon event={event} icon={row.icon} />
      </div>
      <p className="relative z-10 flex min-w-0 items-baseline gap-1.5">
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
        </span>
        {count > 1 ? (
          <span
            data-count={count}
            className="text-tertiary border-secondary shrink-0 rounded-sm border px-1 font-mono text-[11px] leading-4 tabular-nums"
          >
            <RollingDigits value={count} />
          </span>
        ) : null}
        {diff ? (
          <span className="shrink-0 text-sm tabular-nums">
            <span className="text-green-600">+{diff.additions}</span>{" "}
            <span className="text-red-500">-{diff.deletions}</span>
          </span>
        ) : null}
      </p>
    </div>
  );
}

export function ActivityTrackedCount({ count }: { count: number }) {
  return (
    <Tooltip delay={0} closeDelay={0}>
      <TooltipTrigger
        delay={0}
        closeDelay={0}
        className="text-tertiary hidden cursor-default bg-transparent p-0 text-sm tabular-nums md:inline"
      >
        {formatTrackedEventsLabel(count)}
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="end"
        collisionPadding={8}
        container={typeof document === "undefined" ? undefined : document.body}
        className="overflow-visible whitespace-nowrap"
      >
        {ACTIVITY_TRACKED_SINCE_TOOLTIP}
      </TooltipContent>
    </Tooltip>
  );
}

const ROLLUP_PULSE_MS = 550;
const LIST_MOTION = { duration: 0.14, ease: [0.2, 0, 0, 1] } as const;

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

function ActivityStackList({
  stacks,
  pulseKey,
}: {
  stacks: ActivityRollup[];
  pulseKey: string | null;
}) {
  const hydrated = useHydrated();
  const prefersReducedMotion = useReducedMotion();
  const canAnimate = hydrated && prefersReducedMotion !== true;
  const keys = stacks.map(activityStackReactKey);
  const liveKeys = new Set(keys);
  const [seenKeys, setSeenKeys] = useState<Set<string> | null>(null);
  const [enterDelays, setEnterDelays] = useState<Map<string, number>>(() => new Map());

  const { seen, delays: pending } = nextActivityEnterState(keys, seenKeys);
  let nextSeen = seen;
  let nextDelays = enterDelays;

  if (pending.size > 0) {
    nextDelays = new Map(enterDelays);
    for (const [key, delay] of pending) nextDelays.set(key, delay);
  }

  const prunedSeen = new Set([...nextSeen].filter((key) => liveKeys.has(key)));
  if (prunedSeen.size !== nextSeen.size) nextSeen = prunedSeen;
  nextDelays = pruneEnterDelays(nextDelays, liveKeys);

  if (nextSeen !== seenKeys) setSeenKeys(nextSeen);
  if (nextDelays !== enterDelays) setEnterDelays(nextDelays);

  return (
    <div className="divide-secondary divide-y">
      <AnimatePresence initial={false}>
        {stacks.map((stack) => {
          const reactKey = activityStackReactKey(stack);
          const delay = nextDelays.get(reactKey);
          const isEntering = canAnimate && delay !== undefined;

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
              className={isEntering ? "overflow-hidden" : "[clip-path:inset(0)]"}
            >
              <ActivityRow
                event={stack.latest}
                count={stack.count}
                sectionLabel={stack.sectionLabel}
                href={stack.href}
                pulse={pulseKey === reactKey}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function useRollupPulse(stacks: ActivityRollup[]): string | null {
  const prefersReducedMotion = useReducedMotion();
  const top = stacks[0];
  const topReactKey = top ? activityStackReactKey(top) : null;
  const [seenTop, setSeenTop] = useState<{ key: string; count: number } | null>(null);
  const [pulseKey, setPulseKey] = useState<string | null>(null);
  const nextSeen = topReactKey && top ? { key: topReactKey, count: top.count } : null;
  const shouldPulse =
    prefersReducedMotion !== true && shouldPulseActivityRollup(seenTop, nextSeen ?? undefined);
  const seenChanged = seenTop?.key !== nextSeen?.key || seenTop?.count !== nextSeen?.count;

  if (seenChanged) {
    setSeenTop(nextSeen);
    if (shouldPulse && topReactKey) {
      setPulseKey(topReactKey);
    } else if (pulseKey && nextSeen?.key !== pulseKey) {
      setPulseKey(null);
    }
  }

  useEffect(() => {
    if (!pulseKey) return;
    const timeout = window.setTimeout(() => setPulseKey(null), ROLLUP_PULSE_MS);
    return () => window.clearTimeout(timeout);
  }, [pulseKey, top?.count]);

  return shouldPulse && topReactKey ? topReactKey : pulseKey;
}

export function ActivityFeed({
  initialEvents,
  initialCount,
}: {
  initialEvents: ActivityEvent[];
  initialCount: number;
}) {
  const { events, count } = useActivity(initialEvents, initialCount);
  const stacks = useMemo(() => rollupActivityEvents(events), [events]);
  const pulseKey = useRollupPulse(stacks);

  const topBarContent = useMemo(() => <ActivityTrackedCount count={count} />, [count]);
  useTopBarActions(topBarContent);

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
              <ActivityStackList stacks={stacks} pulseKey={pulseKey} />
              <p className="text-tertiary p-32 text-center text-sm">
                Older activity is dust in the wind...
              </p>
            </>
          )}
        </div>
      </div>
    </ListDetailWrapper>
  );
}
