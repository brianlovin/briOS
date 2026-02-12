"use client";

import useSWR, { preload } from "swr";

import type { AmaQuestionWithAnswer } from "@/db/queries/ama";
import { fetcher } from "@/lib/fetcher";

export function prefetchAmaQuestion(id: string) {
  preload(`/api/ama/${id}`, fetcher);
}

export function useAmaQuestion(id: string, fallbackData?: AmaQuestionWithAnswer | null) {
  const { data, error, isLoading } = useSWR<AmaQuestionWithAnswer | null>(
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
