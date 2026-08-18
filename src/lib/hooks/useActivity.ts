"use client";

import { useSyncExternalStore } from "react";
import useSWR from "swr";

import type { ActivityEvent, ActivityFeedPayload } from "@/lib/activity";
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

export function useActivity(
  initialEvents: ActivityEvent[],
  initialCount: number,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled ?? true;
  const visibilityState = useSyncExternalStore(
    subscribeVisibility,
    getVisibilitySnapshot,
    getServerVisibilitySnapshot,
  );

  const { data } = useSWR<ActivityFeedPayload>(enabled ? "/api/activity/feed" : null, fetcher, {
    fallbackData: { events: initialEvents, count: initialCount },
    refreshInterval: enabled ? activityFeedRefreshInterval(visibilityState) : 0,
    revalidateOnFocus: false,
    dedupingInterval: ACTIVITY_FEED_DEDUPING_MS,
  });

  return {
    events: data?.events ?? initialEvents,
    count: data?.count ?? initialCount,
  };
}
