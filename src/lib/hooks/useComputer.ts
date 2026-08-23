"use client";

import useSWR, { preload } from "swr";

import { fetcher } from "@/lib/fetcher";
import type { NotionComputerItem, NotionComputerItemWithContent } from "@/lib/notion";

export function prefetchComputerTip(id: string) {
  preload(`/api/computer/${id}`, fetcher);
}

export function useComputerTips(fallbackData?: NotionComputerItem[]) {
  const { data, error, isLoading } = useSWR<NotionComputerItem[]>("/api/computer", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 1000 * 60 * 5,
    fallbackData,
  });

  return {
    tips: data || fallbackData || [],
    isLoading: isLoading && !fallbackData,
    isError: error,
  };
}

export function useComputerTip(id: string, fallbackData?: NotionComputerItemWithContent | null) {
  const { data, error, isLoading } = useSWR<NotionComputerItemWithContent | null>(
    id ? `/api/computer/${id}` : null,
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
