"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";

import type { GoodWebsiteItem } from "../goodWebsites";

export function useGoodWebsites(fallbackData?: GoodWebsiteItem[]) {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag") || "";

  // Build query string for API
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);

  const queryString = params.toString();
  const url = `/api/sites${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<GoodWebsiteItem[]>(url, fetcher, {
    // Keep previous data while revalidating to enable optimistic updates
    keepPreviousData: true,
    // Use server-provided fallback data for instant initial render
    fallbackData,
  });

  return {
    goodWebsites: data || fallbackData || [],
    isLoading,
    isValidating,
    isError: error,
    mutate,
    // Helper to determine if this is initial loading vs filter change
    isInitialLoading: isLoading && !data && !fallbackData,
  };
}
