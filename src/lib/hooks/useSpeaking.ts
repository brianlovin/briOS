"use client";

import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type { NotionSpeakingItem } from "@/lib/notion/types";

export function useSpeaking(fallbackData?: NotionSpeakingItem[]) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<NotionSpeakingItem[]>(
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
