"use client";

import useSWR, { preload } from "swr";

import { HackerNewsPost } from "@/types/hackernews";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export function prefetchHNPost(id: string) {
  preload(`/api/hn/${id}`, fetcher);
}

export function useHNPosts(fallbackData?: (HackerNewsPost | null)[]) {
  // Skip fetching during SSR prerender to avoid uncached data access with cacheComponents
  const key = typeof window === "undefined" ? null : "/api/hn";
  const { data, error, isLoading } = useSWR<(HackerNewsPost | null)[]>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 1000 * 60 * 60, // 1 hour
    fallbackData,
  });

  return {
    data: data || fallbackData,
    isLoading: isLoading && !fallbackData,
    isError: error,
  };
}

export function useHNPost(id: string, fallbackData?: HackerNewsPost | null) {
  const { data, error, isLoading } = useSWR<HackerNewsPost | null>(`/api/hn/${id}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 1000 * 60 * 60, // 1 hour
    fallbackData,
  });

  return {
    post: data || fallbackData,
    isLoading: isLoading && !fallbackData,
    isError: error,
  };
}
