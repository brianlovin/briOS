"use client";

import { createContext, useContext } from "react";
import useSWR, { mutate } from "swr";

import { likeActivityPayload, type LikeActivityTarget } from "@/lib/activity-shared";
import { fetcher } from "@/lib/fetcher";
import {
  type LikeCount,
  type LikeData,
  MAX_LIKES_PER_USER,
  resolveLikeState,
} from "@/lib/likes-constants";

export type { LikeCount, LikeData };
export type { LikeActivityTarget };

type BatchLikesContextType = {
  counts: Record<string, LikeCount>;
  /** null until the viewer batch returns. */
  viewer: Record<string, LikeData> | null;
};

export const BatchLikesContext = createContext<BatchLikesContextType | null>(null);

/**
 * Hook for individual like button.
 * SSR counts are display-only. Viewer state comes from the batch overlay
 * (or an individual GET when there is no batch provider).
 */
export function useLikes(pageId: string, target: LikeActivityTarget = {}) {
  const batchContext = useContext(BatchLikesContext);
  const inBatch = batchContext !== null;

  const { data, error } = useSWR<LikeData>(
    pageId ? `/api/likes/${pageId}` : null,
    inBatch ? null : fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const { count, userLikes, viewerKnown } = resolveLikeState(
    batchContext?.counts?.[pageId],
    batchContext?.viewer?.[pageId],
    data,
  );

  const addLike = async () => {
    if (!viewerKnown || userLikes >= MAX_LIKES_PER_USER) return;

    const payload = likeActivityPayload(target, {
      title: document.title,
      href: window.location.pathname,
    });
    if (!payload) return;

    const optimisticData: LikeData = {
      count: count + 1,
      userLikes: userLikes + 1,
    };

    await mutate(
      `/api/likes/${pageId}`,
      async () => {
        const res = await fetch(`/api/likes/${pageId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
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

  const removeLike = async () => {
    if (!viewerKnown || userLikes <= 0) return;

    const optimisticData: LikeData = {
      count: Math.max(0, count - 1),
      userLikes: userLikes - 1,
    };

    await mutate(
      `/api/likes/${pageId}`,
      async () => {
        const res = await fetch(`/api/likes/${pageId}`, { method: "DELETE" });
        if (!res.ok) {
          throw new Error("Failed to remove like");
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

  return {
    count,
    userLikes,
    isLoading: !viewerKnown,
    isError: error,
    addLike,
    removeLike,
  };
}
