"use client";

import useSWR from "swr";

import type { ActivityEvent, ActivityTotal } from "@/lib/activity";
import { fetcher } from "@/lib/fetcher";

type TailResponse = { events: ActivityEvent[] };
type TotalsResponse = { totals: ActivityTotal[] };

export function useActivity(initialEvents: ActivityEvent[], initialTotals: ActivityTotal[]) {
  const tail = useSWR<TailResponse>("/api/activity/tail", fetcher, {
    fallbackData: { events: initialEvents },
    refreshInterval: 1000,
    revalidateOnFocus: false,
    dedupingInterval: 500,
  });

  const totals = useSWR<TotalsResponse>("/api/activity/totals", fetcher, {
    fallbackData: { totals: initialTotals },
    refreshInterval: 1000,
    revalidateOnFocus: false,
    dedupingInterval: 500,
  });

  return {
    events: tail.data?.events ?? initialEvents,
    totals: totals.data?.totals ?? initialTotals,
  };
}
