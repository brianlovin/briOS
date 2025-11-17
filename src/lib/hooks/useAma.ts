"use client";

import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import { NotionAmaItemWithContent } from "@/lib/notion";

export function useAmaQuestion(id: string, fallbackData?: NotionAmaItemWithContent | null) {
  const { data, error, isLoading } = useSWR<NotionAmaItemWithContent | null>(
    id ? `/api/ama/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 1000 * 60 * 5, // 5 minutes
      fallbackData,
    },
  );

  return {
    question: data || fallbackData,
    isLoading: isLoading && !fallbackData,
    isError: error,
  };
}
