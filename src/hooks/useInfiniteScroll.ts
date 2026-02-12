"use client";

import useSWRInfinite from "swr/infinite";

import { fetcher } from "@/lib/fetcher";

export type InfiniteScrollPage<T> = {
  items: T[];
  nextCursor: string | null;
};

export type UseInfiniteScrollOptions<T> = {
  pageSize?: number;
  revalidateFirstPage?: boolean;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  dedupingInterval?: number;
  focusThrottleInterval?: number;
  fallbackData?: InfiniteScrollPage<T>[];
};

export function useInfiniteScroll<T>(
  getKey: (index: number, previousPage: InfiniteScrollPage<T> | null) => string | null,
  options: UseInfiniteScrollOptions<T> = {},
) {
  const {
    pageSize = 20,
    revalidateFirstPage = false,
    revalidateOnFocus = false,
    revalidateOnReconnect = false,
    dedupingInterval = 2000,
    focusThrottleInterval = 5000,
    fallbackData,
  } = options;

  // Skip fetching during SSR prerender to avoid uncached data access with cacheComponents.
  // SWR returns undefined data when key is null; client hydrates with loading state, then fetches.
  const ssrSafeGetKey = (index: number, previousPage: InfiniteScrollPage<T> | null) => {
    if (typeof window === "undefined") return null;
    return getKey(index, previousPage);
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite<InfiniteScrollPage<T>>(
    ssrSafeGetKey,
    fetcher,
    {
      revalidateFirstPage,
      revalidateOnFocus,
      revalidateOnReconnect,
      dedupingInterval,
      focusThrottleInterval,
      fallbackData,
    },
  );

  const pages = data ?? fallbackData;
  const items = pages ? pages.flatMap((page) => page.items) : [];
  const isLoading = !data && !error && !fallbackData;
  const isLoadingMore = data && isValidating;
  const isReachingEnd = pages ? pages[pages.length - 1]?.nextCursor === null : false;

  return {
    items,
    isLoading,
    isLoadingMore,
    isError: error,
    size,
    setSize,
    isReachingEnd,
    pageSize,
  };
}
