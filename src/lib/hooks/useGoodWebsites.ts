"use client";

import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";

import type { GoodWebsiteItem } from "../goodWebsites";

export function useGoodWebsites(fallbackData?: GoodWebsiteItem[]) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<GoodWebsiteItem[]>(
    "/api/sites",
    fetcher,
    {
      // Keep previous data while revalidating to enable optimistic updates
      keepPreviousData: true,
      // Use server-provided fallback data for instant initial render
      fallbackData,
    },
  );

  return {
    goodWebsites: data || fallbackData || [],
    isLoading,
    isValidating,
    isError: error,
    mutate,
    // Helper to determine if this is initial loading
    isInitialLoading: isLoading && !data && !fallbackData,
  };
}
