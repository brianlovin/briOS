"use client";

import { useMemo } from "react";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import { filterStacks, type StackFilters, type StackItem } from "@/lib/stack";

export function useStacks(fallbackData?: StackItem[], filters: StackFilters = {}) {
  const status = filters.status || "active";
  const platform = filters.platform || "";

  const filteredFallback = useMemo(
    () => (fallbackData ? filterStacks(fallbackData, { status, platform }) : undefined),
    [fallbackData, status, platform],
  );

  // Build query string for API
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (platform) params.set("platform", platform);

  const queryString = params.toString();
  const url = `/api/stacks${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<StackItem[]>(url, fetcher, {
    // Keep previous data while revalidating to enable optimistic updates
    keepPreviousData: true,
    // Use server-provided fallback data for instant initial render
    fallbackData: filteredFallback,
  });

  return {
    stacks: data || filteredFallback || [],
    isLoading,
    isValidating,
    isError: error,
    mutate,
    // Helper to determine if this is initial loading vs filter change
    isInitialLoading: isLoading && !data && !filteredFallback,
  };
}
