"use client";

import { createContext, useContext } from "react";
import useSWR, { mutate } from "swr";

import { fetcher } from "@/lib/fetcher";
import { type LikeData, MAX_LIKES_PER_USER } from "@/lib/likes-constants";

export type { LikeData };

// Context to provide initial likes data from server
type BatchLikesContextType = {
  initialData: Record<string, LikeData>;
};

export const BatchLikesContext = createContext<BatchLikesContextType | null>(null);

/**
 * Hook for individual like button
 * Uses initial data from context as fallback, then SWR for updates
 */
export function useLikes(pageId: string) {
  const batchContext = useContext(BatchLikesContext);
  const initialData = batchContext?.initialData?.[pageId];

  const { data, error, isLoading } = useSWR<LikeData>(
    pageId ? `/api/likes/${pageId}` : null,
    // Don't fetch if we have initial data - rely on optimistic updates
    initialData ? null : fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      fallbackData: initialData,
    },
  );

  const addLike = async () => {
    const currentData = data ?? initialData;
    if (!currentData?.canLike) return;

    // Optimistic update
    const optimisticData: LikeData = {
      count: (currentData?.count ?? 0) + 1,
      userLikes: (currentData?.userLikes ?? 0) + 1,
      hasLiked: true,
      canLike: (currentData?.userLikes ?? 0) + 1 < MAX_LIKES_PER_USER,
    };

    await mutate(
      `/api/likes/${pageId}`,
      async () => {
        const res = await fetch(`/api/likes/${pageId}`, { method: "POST" });
        if (!res.ok) {
          throw new Error("Failed to like");
        }
        return res.json();
      },
      {
        optimisticData,
        rollbackOnError: true,
        revalidate: false,
      },
    );
  };

  const likeData = data ?? initialData;

  return {
    count: likeData?.count ?? 0,
    userLikes: likeData?.userLikes ?? 0,
    hasLiked: likeData?.hasLiked ?? false,
    canLike: likeData?.canLike ?? false,
    isLoading: isLoading && !initialData,
    isError: error,
    addLike,
  };
}
