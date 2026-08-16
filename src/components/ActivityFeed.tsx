"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PageTitle } from "@/components/Typography";
import type { ActivityEvent, ActivityTotal } from "@/lib/activity";
import { formatTotalLabel, getActivityRow } from "@/lib/activity-shared";
import { useActivity } from "@/lib/hooks/useActivity";

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
    <time className="text-quaternary shrink-0 text-sm tabular-nums" dateTime={iso} title={iso}>
      {label || "\u00a0"}
    </time>
  );
}

function ActivityRow({ event }: { event: ActivityEvent }) {
  const row = getActivityRow(event);
  const href = row.href;

  return (
    <li className="border-secondary flex items-baseline justify-between gap-4 border-b py-3">
      <div className="min-w-0">
        <p className="text-primary text-pretty">{row.summary}</p>
        {href ? (
          <Link
            href={href}
            className="text-tertiary hover:text-primary text-sm underline-offset-2 hover:underline"
          >
            {row.label ?? href}
          </Link>
        ) : null}
      </div>
      <RelativeTime iso={event.received_at} />
    </li>
  );
}

function TotalsList({ totals }: { totals: ActivityTotal[] }) {
  if (totals.length === 0) {
    return <p className="text-tertiary text-sm">No totals yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {totals.map((total) => (
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

  return (
    <div data-scrollable className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-16 lg:flex-row lg:gap-16">
        <div className="min-w-0 flex-1">
          <PageTitle>Activity</PageTitle>
          <p className="text-tertiary mt-3 text-pretty">
            A live stream of things happening on this site.
          </p>
          {events.length === 0 ? (
            <p className="text-tertiary mt-10">Nothing yet. Likes and visits will show up here.</p>
          ) : (
            <ul className="mt-10">
              {events.map((event) => (
                <ActivityRow key={event.id} event={event} />
              ))}
            </ul>
          )}
        </div>
        <aside className="w-full shrink-0 lg:w-56">
          <h2 className="text-secondary mb-3 text-sm font-medium">Lifetime</h2>
          <TotalsList totals={totals} />
        </aside>
      </div>
    </div>
  );
}
