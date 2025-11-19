"use client";

import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";

import { InfiniteScrollPage, useInfiniteScroll } from "./useInfiniteScroll";

export type MusicItem = {
  id: string;
  name: string;
  artist: string;
  album: string;
  url?: string;
  playedAt: string;
  image?: string;
};

export type ListeningHistoryPage = InfiniteScrollPage<MusicItem>;

export function useListeningHistory() {
  const { data, error, isLoading } = useSWR<MusicItem[]>("/api/listening", fetcher);

  return {
    music: data || [],
    isLoading,
    isError: error,
  };
}

export function useListeningHistoryPaginated(initialData?: ListeningHistoryPage[]) {
  return useInfiniteScroll<MusicItem>(
    (index: number, previousPage: ListeningHistoryPage | null) => {
      // If we've reached the end, don't fetch more
      if (previousPage && !previousPage.nextCursor) return null;

      // For the first page, just fetch with limit
      if (index === 0) return `/api/listening?limit=20`;

      // For subsequent pages, use the cursor from the previous page
      return `/api/listening?cursor=${previousPage?.nextCursor}&limit=20`;
    },
    {
      fallbackData: initialData,
    },
  );
}
