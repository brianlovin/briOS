"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
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
import { useTopBarActions } from "@/components/TopBarActions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import type { ActivityEvent, ActivityRollup } from "@/lib/activity";
import {
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
      className={cn(
        "group hover:bg-secondary flex w-max min-w-full items-center gap-3 py-3 pl-4 transition-colors duration-500 md:grid md:w-auto md:min-w-0 md:grid-cols-[2rem_minmax(0,1fr)_auto] md:gap-4 md:px-4 md:py-2 md:dark:hover:bg-white/5",
        pulse && "bg-secondary",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center">
        <ActivityRowIcon event={event} icon={row.icon} />
      </div>
      <p className="flex items-baseline gap-1.5 whitespace-nowrap md:min-w-0">
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
        </span>
        {count > 1 ? (
          <span className="text-tertiary border-secondary shrink-0 rounded-sm border px-1 font-mono text-[11px] leading-4 tabular-nums">
            {count}
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
const LIST_MOTION = { duration: 0.16, ease: [0.2, 0, 0, 1] } as const;

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

  return (
    <LayoutGroup>
      <div className="divide-secondary min-w-max divide-y md:min-w-0">
        <AnimatePresence initial={false}>
          {stacks.map((stack) => {
            const reactKey = activityStackReactKey(stack);
            return (
              <motion.div
                key={reactKey}
                layout={shouldAnimate ? "position" : false}
                initial={shouldAnimate ? { height: 0, opacity: 0 } : false}
                animate={{ height: "auto", opacity: 1 }}
                exit={shouldAnimate ? { height: 0, opacity: 0 } : undefined}
                className="w-max min-w-full [clip-path:inset(0)] md:w-auto md:min-w-0"
                transition={shouldAnimate ? LIST_MOTION : { duration: 0 }}
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  useMobileAxisLock(scrollRef, isMobile);

  const topBarContent = useMemo(() => <ActivityTrackedCount count={count} />, [count]);
  useTopBarActions(topBarContent);

  return (
    <ListDetailWrapper>
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <motion.div
          ref={scrollRef}
          data-scrollable
          layoutScroll
          className="relative min-w-0 flex-1 overflow-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
        >
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
