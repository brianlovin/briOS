"use client";

import { useMemo } from "react";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import {
  type GoodWebsiteItem,
  goodWebsitesClientKey,
  resolveGoodWebsitesOrder,
} from "@/lib/goodWebsites";

export function useGoodWebsites(fallbackData?: GoodWebsiteItem[], tag = "") {
  const url = goodWebsitesClientKey(fallbackData !== undefined, tag);

  const { data, error, isLoading, isValidating, mutate } = useSWR<GoodWebsiteItem[]>(url, fetcher, {
    keepPreviousData: true,
    fallbackData,
    revalidateOnMount: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const goodWebsites = useMemo(
    () => resolveGoodWebsitesOrder(fallbackData, data, tag),
    [data, fallbackData, tag],
  );

  return {
    goodWebsites,
    isLoading,
    isValidating,
    isError: error,
    mutate,
    isInitialLoading: isLoading && !data && fallbackData === undefined,
  };
}
