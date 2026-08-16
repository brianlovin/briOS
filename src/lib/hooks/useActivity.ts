"use client";

import { useSyncExternalStore } from "react";
import useSWR from "swr";

import type { ActivityEvent, ActivityFeedPayload, ActivityTotal } from "@/lib/activity";
import { ACTIVITY_FEED_DEDUPING_MS, activityFeedRefreshInterval } from "@/lib/activity-shared";
import { fetcher } from "@/lib/fetcher";

function subscribeVisibility(onChange: () => void): () => void {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function getVisibilitySnapshot(): DocumentVisibilityState {
  return document.visibilityState;
}

function getServerVisibilitySnapshot(): DocumentVisibilityState {
  return "visible";
}

export function useActivity(initialEvents: ActivityEvent[], initialTotals: ActivityTotal[]) {
  const visibilityState = useSyncExternalStore(
    subscribeVisibility,
    getVisibilitySnapshot,
    getServerVisibilitySnapshot,
  );

  const { data } = useSWR<ActivityFeedPayload>("/api/activity/feed", fetcher, {
    fallbackData: { events: initialEvents, totals: initialTotals },
    refreshInterval: activityFeedRefreshInterval(visibilityState),
    revalidateOnFocus: false,
    dedupingInterval: ACTIVITY_FEED_DEDUPING_MS,
  });

  return {
    events: data?.events ?? initialEvents,
    totals: data?.totals ?? initialTotals,
  };
}
