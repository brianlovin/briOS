"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";

import type { StackItem } from "../stack";

export function useStacks(fallbackData?: StackItem[]) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "active";
  const platform = searchParams.get("platform") || "";

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
    fallbackData,
  });

  return {
    stacks: data || fallbackData || [],
    isLoading,
    isValidating,
    isError: error,
    mutate,
    // Helper to determine if this is initial loading vs filter change
    isInitialLoading: isLoading && !data && !fallbackData,
  };
}
