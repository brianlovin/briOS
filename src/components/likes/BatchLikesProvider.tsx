"use client";

import { ReactNode, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { BatchLikesContext, type LikeCount, type LikeData } from "@/lib/hooks/useLikes";
import {
  getServerViewerLikesSnapshot,
  getStoredViewerLikesSnapshot,
  storedViewerHints,
  subscribeStoredViewerLikes,
  writeStoredViewerLikes,
} from "@/lib/likes-viewer-store";

interface BatchLikesProviderProps {
  pageIds: string[];
  initialData?: Record<string, LikeCount>;
  children: ReactNode;
}

export function BatchLikesProvider({ pageIds, initialData, children }: BatchLikesProviderProps) {
  const [viewer, setViewer] = useState<Record<string, LikeData> | null>(null);
  const pageIdsKey = pageIds.join(",");
  const stored = useSyncExternalStore(
    subscribeStoredViewerLikes,
    getStoredViewerLikesSnapshot,
    getServerViewerLikesSnapshot,
  );
  const storedHint = useMemo(
    () => storedViewerHints(stored, pageIdsKey ? pageIdsKey.split(",") : []),
    [stored, pageIdsKey],
  );

  // Always fetch viewer overlay client-side (SSR only provides counts)
  useEffect(() => {
    if (!pageIdsKey) return;

    const controller = new AbortController();

    const fetchBatchLikes = async () => {
      try {
        const res = await fetch(`/api/likes/batch?ids=${pageIdsKey}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data: Record<string, LikeData> = await res.json();
          writeStoredViewerLikes(data);
          setViewer(data);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Error fetching batch likes:", error);
      }
    };

    fetchBatchLikes();

    return () => controller.abort();
  }, [pageIdsKey]);

  const contextValue = useMemo(
    () => ({
      counts: initialData ?? {},
      viewer: viewer ?? storedHint,
    }),
    [initialData, viewer, storedHint],
  );

  return <BatchLikesContext.Provider value={contextValue}>{children}</BatchLikesContext.Provider>;
}
