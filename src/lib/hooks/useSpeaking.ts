"use client";

import useSWR from "swr";

import type { SpeakingEvent } from "@/db/queries/speaking";
import { fetcher } from "@/lib/fetcher";

export function useSpeaking(fallbackData?: SpeakingEvent[]) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<SpeakingEvent[]>(
    "/api/speaking",
    fetcher,
    {
      // Keep previous data while revalidating to enable optimistic updates
      keepPreviousData: true,
      // Use server-provided fallback data for instant initial render
      fallbackData,
    },
  );

  return {
    speaking: data || fallbackData || [],
    isLoading,
    isValidating,
    isError: error,
    mutate,
    // Helper to determine if this is initial loading
    isInitialLoading: isLoading && !data && !fallbackData,
  };
}
