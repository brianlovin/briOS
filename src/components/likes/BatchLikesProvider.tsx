"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

import { BatchLikesContext, type LikeData } from "@/lib/hooks/useLikes";

interface BatchLikesProviderProps {
  pageIds: string[];
  initialData?: Record<string, LikeData>;
  children: ReactNode;
}

export function BatchLikesProvider({ pageIds, initialData, children }: BatchLikesProviderProps) {
  const [fetchedData, setFetchedData] = useState<Record<string, LikeData>>({});

  // Always fetch user-specific data client-side (SSR only provides counts)
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
          setFetchedData(data);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Error fetching batch likes:", error);
      }
    };

    fetchBatchLikes();

    return () => controller.abort();
  }, [pageIds]);

  // Use fetched data (has user-specific info) if available, fall back to SSR counts
  const contextValue = useMemo(
    () => ({
      initialData: Object.keys(fetchedData).length > 0 ? fetchedData : (initialData ?? {}),
    }),
    [initialData, fetchedData],
  );

  return <BatchLikesContext.Provider value={contextValue}>{children}</BatchLikesContext.Provider>;
}
