"use client";

import useSWR, { preload } from "swr";

import { getPostById } from "@/lib/hn";
import { HackerNewsPost } from "@/types/hackernews";

export function prefetchHNPost(id: string) {
  preload(`hn-post-${id}`, async () => await getPostById(id, true));
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export function useHNPosts(fallbackData?: (HackerNewsPost | null)[]) {
  const { data, error, isLoading } = useSWR<(HackerNewsPost | null)[]>("/api/hn", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 1000 * 60 * 5, // 5 minutes
    fallbackData,
  });

  return {
    data: data || fallbackData,
    isLoading: isLoading && !fallbackData,
    isError: error,
  };
}

export function useHNPost(id: string, fallbackData?: HackerNewsPost | null) {
  const { data, error, isLoading } = useSWR<HackerNewsPost | null>(
    `hn-post-${id}`,
    async () => await getPostById(id, true),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 1000 * 60 * 5, // 5 minutes
      fallbackData,
    },
  );

  return {
    post: data || fallbackData,
    isLoading: isLoading && !fallbackData,
    isError: error,
  };
}
