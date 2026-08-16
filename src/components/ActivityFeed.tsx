"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { type ReactNode, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { Activity } from "@/components/icons/Activity";
import { Github } from "@/components/icons/Github";
import { Heart } from "@/components/icons/Heart";
import { Shiori } from "@/components/icons/Shiori";
import { World } from "@/components/icons/World";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { useTopBarActions } from "@/components/TopBarActions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import type { ActivityEvent, ActivityRollup } from "@/lib/activity";
import {
  activityEnterStaggerDelays,
  activityStackReactKey,
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
  isKnownActivityTitle,
  resolveActivitySourceHref,
} from "@/lib/activity-shared";
import { useActivity } from "@/lib/hooks/useActivity";
import { cn } from "@/lib/utils";

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const delta = Math.max(0, Date.now() - then);
  const seconds = Math.floor(delta / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function RelativeTime({ iso }: { iso: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const tick = () => setLabel(formatRelativeTime(iso));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [iso]);

  return (
    <time
      className="text-quaternary shrink-0 text-right text-sm tabular-nums"
      dateTime={iso}
      title={iso}
    >
      {label || "\u00a0"}
    </time>
  );
}

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

  if (event.type === "like") {
    return <Heart size={16} className="fill-current text-red-500" aria-hidden />;
  }

  if (isGithubActivity(event)) {
    return <Github size={16} className="text-primary" aria-hidden />;
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
  const label = sectionLabel ?? row.label;
  const href =
    hrefOverride ??
    resolveActivitySourceHref(event.source, row.href) ??
    row.href ??
    (label || event.type === "download" ? homeUrl : undefined);
  const likedName =
    event.type === "like" ? row.summary.replace(/^Someone liked\s+/i, "").trim() : "";
  const rawContext = label ?? (href || undefined);
  const context =
    event.type === "like" &&
    rawContext &&
    likedName &&
    rawContext !== likedName &&
    isKnownActivityTitle(rawContext)
      ? likedName
      : rawContext;
  const diff = event.type === "pr_merged" ? getMergedPullRequestDiff(event.meta) : null;

  return (
    <div
      data-rollup-pulse={pulse ? "" : undefined}
      className={cn(
        "border-secondary hover:bg-secondary grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 transition-colors duration-500 md:gap-4 md:py-2 md:dark:hover:bg-white/5",
        pulse && "bg-secondary",
      )}
    >
      <div className="flex size-8 items-center justify-center">
        <ActivityRowIcon event={event} icon={row.icon} />
      </div>
      <p className="min-w-0 truncate">
        <span className="text-primary">{row.summary}</span>
        {count > 1 ? <span className="text-tertiary"> {count}</span> : null}
        {diff ? (
          <span className="shrink-0 text-sm tabular-nums">
            {" "}
            <span className="text-green-600">+{diff.additions}</span>{" "}
            <span className="text-red-500">-{diff.deletions}</span>
          </span>
        ) : null}
        {href && context ? (
          <>
            {" "}
            <ActivityContextLink href={href}>{context}</ActivityContextLink>
          </>
        ) : context ? (
          <span className="text-tertiary"> {context}</span>
        ) : null}
      </p>
      <RelativeTime iso={event.received_at} />
    </div>
  );
}

export function ActivityTrackedCount({ count }: { count: number }) {
  return (
    <Tooltip>
      <TooltipTrigger className="text-tertiary cursor-default bg-transparent p-0 text-sm tabular-nums">
        {formatTrackedEventsLabel(count)}
      </TooltipTrigger>
      <TooltipContent>{ACTIVITY_TRACKED_SINCE_TOOLTIP}</TooltipContent>
    </Tooltip>
  );
}

const ROLLUP_PULSE_MS = 550;
const LIST_MOTION = { duration: 0.25, ease: "easeOut" } as const;

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

function usePreviousKeys(keys: string[]): string[] | null {
  const previousRef = useRef<string[] | null>(null);
  useEffect(() => {
    previousRef.current = keys;
  }, [keys]);
  // Last committed key list — new rows must read this on the insert render to get stagger.
  // eslint-disable-next-line react-hooks/refs -- usePrevious
  return previousRef.current;
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
  const shouldAnimate = hydrated && prefersReducedMotion !== true;
  const keys = useMemo(() => stacks.map(activityStackReactKey), [stacks]);
  const previousKeys = usePreviousKeys(keys);
  const enterDelays =
    shouldAnimate && previousKeys
      ? activityEnterStaggerDelays(keys, new Set(previousKeys))
      : new Map<string, number>();

  return (
    <LayoutGroup>
      <div className="divide-secondary divide-y">
        <AnimatePresence initial={false}>
          {stacks.map((stack) => {
            const reactKey = activityStackReactKey(stack);
            const delay = enterDelays.get(reactKey) ?? 0;
            return (
              <motion.div
                key={reactKey}
                layout={shouldAnimate}
                initial={shouldAnimate ? { opacity: 0, y: -8 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  shouldAnimate
                    ? {
                        opacity: { ...LIST_MOTION, delay },
                        y: { ...LIST_MOTION, delay },
                        layout: LIST_MOTION,
                      }
                    : { duration: 0 }
                }
              >
                <ActivityRow
                  event={stack.latest}
                  count={stack.count}
                  sectionLabel={stack.sectionLabel}
                  href={stack.href}
                  pulse={pulseKey === stack.key}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

function useRollupPulse(stacks: ActivityRollup[]): string | null {
  const top = stacks[0];
  const [seenTop, setSeenTop] = useState<{ key: string; count: number } | null>(null);
  const [pulseKey, setPulseKey] = useState<string | null>(null);
  const shouldPulse = shouldPulseActivityRollup(seenTop, top);
  const nextSeen = top ? { key: top.key, count: top.count } : null;
  const seenChanged = seenTop?.key !== nextSeen?.key || seenTop?.count !== nextSeen?.count;

  if (seenChanged) {
    setSeenTop(nextSeen);
    if (shouldPulse) {
      setPulseKey(top.key);
    } else if (pulseKey && nextSeen?.key !== pulseKey) {
      setPulseKey(null);
    }
  }

  useEffect(() => {
    if (!pulseKey) return;
    const timeout = window.setTimeout(() => setPulseKey(null), ROLLUP_PULSE_MS);
    return () => window.clearTimeout(timeout);
  }, [pulseKey, top?.count]);

  return shouldPulse && top ? top.key : pulseKey;
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
        <motion.div data-scrollable layoutScroll className="relative min-w-0 flex-1 overflow-auto">
          <div className="bg-secondary border-secondary sticky top-0 z-10 hidden border-b md:block dark:bg-neutral-950">
            <div className="grid grid-cols-[2rem_minmax(0,1fr)_auto] gap-3 px-4 py-2 text-sm font-medium md:gap-4">
              <div />
              <div>Event</div>
              <div className="text-right">Time</div>
            </div>
          </div>
          {events.length === 0 ? (
            <p className="text-tertiary px-4 py-10">
              Nothing yet. Likes and visits will show up here.
            </p>
          ) : (
            <ActivityStackList stacks={stacks} pulseKey={pulseKey} />
          )}
        </motion.div>
      </div>
    </ListDetailWrapper>
  );
}
