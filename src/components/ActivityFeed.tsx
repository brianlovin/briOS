"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { Activity } from "@/components/icons/Activity";
import { Github } from "@/components/icons/Github";
import { Heart } from "@/components/icons/Heart";
import { Shiori } from "@/components/icons/Shiori";
import { World } from "@/components/icons/World";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { RollingDigits } from "@/components/RollingDigits";
import { useTopBarActions } from "@/components/TopBarActions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import type { ActivityEvent, ActivityLikeTarget, ActivityRollup } from "@/lib/activity";
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
  formatLikeOthersLabel,
  formatTrackedEventsLabel,
  getActivityRow,
  getMergedPullRequestDiff,
  isHomeLikeTitle,
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

function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const tick = () => setLabel(formatRelativeTime(iso));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [iso]);

  return (
    <time
      className={cn("text-quaternary shrink-0 text-right text-sm tabular-nums", className)}
      dateTime={iso}
      title={iso}
    >
      {label || "\u00a0"}
    </time>
  );
}

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

export function ActivityRow({
  event,
  count = 1,
  sectionLabel,
  href: hrefOverride,
  pulse = false,
  likeTargets: likeTargetsProp,
}: {
  event: ActivityEvent;
  count?: number;
  sectionLabel?: string;
  href?: string;
  pulse?: boolean;
  likeTargets?: ActivityLikeTarget[];
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

  if (isLike && likeTargets.length === 0) {
    return null;
  }

  return (
    <div
      data-rollup-pulse={pulse ? "" : undefined}
      className="group hover:bg-secondary relative isolate flex w-max min-w-full items-center gap-3 py-3 pl-4 md:grid md:w-auto md:min-w-0 md:grid-cols-[2rem_minmax(0,1fr)_auto] md:gap-4 md:px-4 md:py-2 md:dark:hover:bg-white/5"
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
      <p className="relative z-10 flex items-baseline gap-1.5 whitespace-nowrap md:min-w-0">
        <span className="md:min-w-0 md:truncate">
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
        {showCountChip ? (
          <span
            data-count={count}
            className="text-tertiary border-secondary shrink-0 -translate-y-[2px] rounded-sm border px-1.5 py-px font-mono text-xs leading-4 tabular-nums"
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
      <RelativeTime
        iso={event.received_at}
        className={cn(
          "sticky right-0 z-10 ml-auto bg-white px-4 dark:bg-black",
          "group-hover:bg-inherit group-data-[rollup-pulse]:bg-inherit",
          "max-md:[box-shadow:inset_1px_0_0_var(--border-color-secondary)]",
          "md:static md:ml-0 md:bg-transparent md:px-0 md:shadow-none md:dark:bg-transparent",
          "md:group-hover:bg-inherit md:group-data-[rollup-pulse]:bg-inherit md:dark:group-hover:bg-white/5",
        )}
      />
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

function useIsMobile(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia("(max-width: 767px)");
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
}

function useMobileAxisLock(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const container = ref.current;
    if (!container || !enabled) return;

    let touchStartPos: { x: number; y: number } | null = null;
    let lockedAxis: "x" | "y" | null = null;
    let lockedScrollValue: number | null = null;
    const threshold = 5;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStartPos = { x: touch.clientX, y: touch.clientY };
      lockedAxis = null;
      lockedScrollValue = null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!touchStartPos) return;
      const touch = event.touches[0];
      if (!touch || lockedAxis !== null) return;

      const deltaX = Math.abs(touch.clientX - touchStartPos.x);
      const deltaY = Math.abs(touch.clientY - touchStartPos.y);
      if (deltaX <= threshold && deltaY <= threshold) return;

      lockedAxis = deltaX > deltaY ? "x" : "y";
      lockedScrollValue = lockedAxis === "x" ? container.scrollTop : container.scrollLeft;
    };

    const handleScroll = () => {
      if (lockedAxis === null || lockedScrollValue === null) return;
      if (lockedAxis === "x" && container.scrollTop !== lockedScrollValue) {
        container.scrollTop = lockedScrollValue;
      } else if (lockedAxis === "y" && container.scrollLeft !== lockedScrollValue) {
        container.scrollLeft = lockedScrollValue;
      }
    };

    const handleTouchEnd = () => {
      touchStartPos = null;
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [enabled, ref]);
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
    <div className="divide-secondary min-w-max divide-y md:min-w-0">
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
              className={cn(
                "w-max min-w-full md:w-auto md:min-w-0",
                isEntering ? "overflow-hidden" : "[clip-path:inset(0)]",
              )}
            >
              <ActivityRow
                event={stack.latest}
                count={stack.count}
                sectionLabel={stack.sectionLabel}
                href={stack.href}
                likeTargets={stack.likeTargets}
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  useMobileAxisLock(scrollRef, isMobile);

  const topBarContent = useMemo(() => <ActivityTrackedCount count={count} />, [count]);
  useTopBarActions(topBarContent);

  return (
    <ListDetailWrapper>
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          data-scrollable
          className="relative min-w-0 flex-1 overflow-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
        >
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
