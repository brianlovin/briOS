"use client";

import { ReactNode, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { BatchLikesContext, type LikeCount, type LikeData } from "@/lib/hooks/useLikes";
import {
  hydrateViewerBatch,
  likesBatchRequestUrl,
  planLikesBatchRequests,
} from "@/lib/likes-batch";
import { type ViewerLikeOverlay } from "@/lib/likes-constants";
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
  const fetchedIdsRef = useRef<Set<string>>(new Set());
  const inFlightIdsRef = useRef<Set<string>>(new Set());
  const viewerRef = useRef(viewer);
  const initialDataRef = useRef(initialData);
  viewerRef.current = viewer;
  initialDataRef.current = initialData;

  // Viewer overlay only for IDs not yet fetched. SSR totals are not re-GET.
  useEffect(() => {
    if (!pageIdsKey) return;

    const ids = pageIdsKey.split(",").filter((id) => id.length > 0);
    const alreadyFetched = new Set([...fetchedIdsRef.current, ...inFlightIdsRef.current]);
    const requests = planLikesBatchRequests(ids, {
      alreadyFetched,
      initialLikes: initialDataRef.current,
    });
    if (requests.length === 0) return;

    const requestedIds = requests.flatMap((request) => request.ids);
    requestedIds.forEach((id) => inFlightIdsRef.current.add(id));

    const fetchBatchLikes = async () => {
      try {
        const payloads = await Promise.all(
          requests.map(async (request) => {
            const res = await fetch(likesBatchRequestUrl(request));
            if (!res.ok) {
              throw new Error(`Failed to fetch batch likes (${res.status})`);
            }
            return (await res.json()) as Record<string, ViewerLikeOverlay>;
          }),
        );
        const incoming = Object.assign({}, ...payloads) as Record<string, ViewerLikeOverlay>;
        const hydrated = hydrateViewerBatch(incoming, {
          existingViewer: viewerRef.current,
          stored: getStoredViewerLikesSnapshot(),
          initialLikes: initialDataRef.current,
        });
        writeStoredViewerLikes(hydrated);
        setViewer((prev) => ({ ...(prev ?? {}), ...hydrated }));
        requestedIds.forEach((id) => fetchedIdsRef.current.add(id));
      } catch (error) {
        console.error("Error fetching batch likes:", error);
      } finally {
        requestedIds.forEach((id) => inFlightIdsRef.current.delete(id));
      }
    };

    void fetchBatchLikes();
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
