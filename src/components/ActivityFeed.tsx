"use client";

import { useAtom } from "jotai";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { activityLifetimeSidebarAtom } from "@/atoms/activityLifetimeSidebar";
import { Activity } from "@/components/icons/Activity";
import { Github } from "@/components/icons/Github";
import { Heart } from "@/components/icons/Heart";
import { Sidebar } from "@/components/icons/Sidebar";
import { World } from "@/components/icons/World";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { useTopBarActions } from "@/components/TopBarActions";
import { IconButton } from "@/components/ui/IconButton";
import type { ActivityEvent, ActivityTotal } from "@/lib/activity";
import {
  activitySourceFaviconSrc,
  formatTotalLabel,
  getActivityRow,
  visibleLifetimeTotals,
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

function formatFirstTracked(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "First tracked date unknown";
  return `First tracked ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
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

function ActivityRowIcon({ event }: { event: ActivityEvent }) {
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

  return <Activity size={16} className="text-tertiary" aria-hidden />;
}

export function ActivityRow({ event }: { event: ActivityEvent }) {
  const row = getActivityRow(event);
  const href = row.href;

  return (
    <div className="border-secondary hover:bg-secondary grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 md:gap-4 md:py-2 md:dark:hover:bg-white/5">
      <div className="flex size-8 items-center justify-center">
        <ActivityRowIcon event={event} />
      </div>
      <div className="min-w-0">
        <p className="text-primary truncate text-pretty">{row.summary}</p>
        {href ? (
          <Link
            href={href}
            className="text-tertiary hover:text-primary block truncate text-sm underline-offset-2 hover:underline"
          >
            {row.label ?? href}
          </Link>
        ) : null}
      </div>
      <RelativeTime iso={event.received_at} />
    </div>
  );
}

function TotalsList({ totals }: { totals: ActivityTotal[] }) {
  const visible = visibleLifetimeTotals(totals);

  if (visible.length === 0) {
    return <p className="text-tertiary text-sm">No totals yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {visible.map((total) => (
        <li
          key={`${total.source}:${total.type}`}
          className="flex items-baseline justify-between gap-3"
          title={formatFirstTracked(total.first_seen)}
        >
          <span className="text-secondary capitalize">{formatTotalLabel(total.type)}</span>
          <span className="text-primary tabular-nums">{total.count.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  );
}

export function ActivityFeed({
  initialEvents,
  initialTotals,
}: {
  initialEvents: ActivityEvent[];
  initialTotals: ActivityTotal[];
}) {
  const { events, totals } = useActivity(initialEvents, initialTotals);
  const [lifetimeOpen, setLifetimeOpen] = useAtom(activityLifetimeSidebarAtom);

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setLifetimeOpen(false);
    }
  }, [setLifetimeOpen]);

  const topBarContent = useMemo(
    () => (
      <IconButton
        size="sm"
        variant="ghost"
        aria-pressed={lifetimeOpen}
        aria-label="Lifetime"
        title="Lifetime"
        onClick={() => setLifetimeOpen((open) => !open)}
      >
        <Sidebar size={18} />
      </IconButton>
    ),
    [lifetimeOpen, setLifetimeOpen],
  );
  useTopBarActions(topBarContent);

  return (
    <ListDetailWrapper>
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <div data-scrollable className="relative min-w-0 flex-1 overflow-auto">
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
            <div className="divide-secondary divide-y">
              {events.map((event) => (
                <ActivityRow key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
        <aside
          className={cn(
            "border-secondary w-(--secondary-sidebar-width) shrink-0 flex-col overflow-y-auto border-l bg-white dark:bg-black",
            "max-md:absolute max-md:inset-y-0 max-md:right-0 max-md:z-10",
            lifetimeOpen ? "flex" : "hidden",
          )}
        >
          <div className="px-4 py-4">
            <h2 className="text-secondary mb-3 text-sm font-medium">Lifetime</h2>
            <TotalsList totals={totals} />
          </div>
        </aside>
      </div>
    </ListDetailWrapper>
  );
}
