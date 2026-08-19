"use client";

import { useMemo } from "react";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import { filterGoodWebsites, type GoodWebsiteItem } from "@/lib/goodWebsites";

export function useGoodWebsites(fallbackData?: GoodWebsiteItem[], tag = "") {
  const filteredFallback = useMemo(
    () => (fallbackData ? filterGoodWebsites(fallbackData, { tag }) : undefined),
    [fallbackData, tag],
  );

  // Build query string for API
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);

  const queryString = params.toString();
  const url = `/api/sites${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<GoodWebsiteItem[]>(url, fetcher, {
    // Keep previous data while revalidating to enable optimistic updates
    keepPreviousData: true,
    // Use server-provided fallback data for instant initial render
    fallbackData: filteredFallback,
  });

  return {
    goodWebsites: data || filteredFallback || [],
    isLoading,
    isValidating,
    isError: error,
    mutate,
    // Helper to determine if this is initial loading vs filter change
    isInitialLoading: isLoading && !data && !filteredFallback,
  };
}
