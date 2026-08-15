"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

import { BatchLikesContext, type LikeCount, type LikeData } from "@/lib/hooks/useLikes";

interface BatchLikesProviderProps {
  pageIds: string[];
  initialData?: Record<string, LikeCount>;
  children: ReactNode;
}

export function BatchLikesProvider({ pageIds, initialData, children }: BatchLikesProviderProps) {
  const [viewer, setViewer] = useState<Record<string, LikeData> | null>(null);

  // Always fetch viewer overlay client-side (SSR only provides counts)
  useEffect(() => {
    if (pageIds.length === 0) return;

    const controller = new AbortController();

    const fetchBatchLikes = async () => {
      try {
        const res = await fetch(`/api/likes/batch?ids=${pageIds.join(",")}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data: Record<string, LikeData> = await res.json();
          setViewer(data);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Error fetching batch likes:", error);
      }
    };

    fetchBatchLikes();

    return () => controller.abort();
  }, [pageIds]);

  const contextValue = useMemo(
    () => ({
      counts: initialData ?? {},
      viewer,
    }),
    [initialData, viewer],
  );

  return <BatchLikesContext.Provider value={contextValue}>{children}</BatchLikesContext.Provider>;
}
