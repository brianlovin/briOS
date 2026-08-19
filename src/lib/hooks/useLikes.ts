"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import useSWR, { mutate } from "swr";

import { likeActivityPayload, type LikeActivityTarget } from "@/lib/activity-shared";
import { fetcher } from "@/lib/fetcher";
import {
  isViewerLikeData,
  type LikeCount,
  type LikeData,
  MAX_LIKES_PER_USER,
  optimisticAddLike,
  optimisticRemoveLike,
  resolveLikeState,
} from "@/lib/likes-constants";
import {
  getServerViewerLikesSnapshot,
  getStoredViewerLikesSnapshot,
  storedViewerHint,
  subscribeStoredViewerLikes,
  writeStoredViewerLike,
} from "@/lib/likes-viewer-store";

export type { LikeCount, LikeData };
export type { LikeActivityTarget };

type BatchLikesContextType = {
  counts: Record<string, LikeCount>;
  /** Stored hint or live batch overlay. null until either exists. */
  viewer: Record<string, LikeData> | null;
};

export const BatchLikesContext = createContext<BatchLikesContextType | null>(null);

function persistViewerLike(pageId: string, data: LikeData) {
  if (!isViewerLikeData(data) || !Number.isFinite(data.count) || !Number.isFinite(data.userLikes)) {
    return;
  }
  writeStoredViewerLike(pageId, { count: data.count, userLikes: data.userLikes });
}

/**
 * Hook for individual like button.
 * SSR counts are display-only. Viewer state comes from the batch overlay
 * (or an individual GET when there is no batch provider).
 */
export function useLikes(pageId: string, target: LikeActivityTarget = {}) {
  const batchContext = useContext(BatchLikesContext);
  const inBatch = batchContext !== null;
  const countOnly = batchContext?.counts?.[pageId];
  const stored = useSyncExternalStore(
    subscribeStoredViewerLikes,
    getStoredViewerLikesSnapshot,
    getServerViewerLikesSnapshot,
  );
  const storedHint = storedViewerHint(stored, pageId);

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
    countOnly,
    batchContext?.viewer?.[pageId] ?? storedHint,
    data,
  );

  const addLike = async () => {
    if (userLikes >= MAX_LIKES_PER_USER) return;

    const payload = likeActivityPayload(target, {
      title: document.title,
      href: window.location.pathname,
    });
    if (!payload) return;

    const optimisticData = optimisticAddLike(count, userLikes);

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
        const next = (await res.json()) as LikeData;
        persistViewerLike(pageId, next);
        return next;
      },
      {
        optimisticData,
        rollbackOnError: true,
        revalidate: false,
      },
    );
  };

  const removeLike = async () => {
    if (userLikes <= 0) return;

    const optimisticData = optimisticRemoveLike(count, userLikes);

    await mutate(
      `/api/likes/${pageId}`,
      async () => {
        const res = await fetch(`/api/likes/${pageId}`, { method: "DELETE" });
        if (!res.ok) {
          throw new Error("Failed to remove like");
        }
        const next = (await res.json()) as LikeData;
        persistViewerLike(pageId, next);
        return next;
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
