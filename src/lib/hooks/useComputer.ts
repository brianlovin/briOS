"use client";

import useSWR, { preload } from "swr";

import { computerTipsFromApi } from "@/lib/computer";
import { fetcher } from "@/lib/fetcher";
import type { NotionComputerItem, NotionComputerItemWithContent } from "@/lib/notion";

export function prefetchComputerTip(slug: string) {
  preload(`/api/computer/${slug}`, fetcher);
}

export function useComputerTips(fallbackData?: NotionComputerItem[]) {
  const { data, error, isLoading } = useSWR<unknown>("/api/computer", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 1000 * 60 * 5,
    fallbackData,
  });

  const tips = data === undefined ? (fallbackData ?? []) : computerTipsFromApi(data);

  return {
    tips,
    isLoading: isLoading && !fallbackData,
    isError: error,
  };
}

export function useComputerTip(slug: string, fallbackData?: NotionComputerItemWithContent | null) {
  const { data, error, isLoading } = useSWR<NotionComputerItemWithContent | null>(
    slug ? `/api/computer/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 1000 * 60 * 5,
      fallbackData,
    },
  );

  return {
    tip: data || fallbackData,
    isLoading: isLoading && !fallbackData,
    isError: error,
  };
}
