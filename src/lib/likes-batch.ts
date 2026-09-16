import {
  type LikeCount,
  type LikeData,
  LIKES_BATCH_MAX_IDS,
  type ViewerLikeOverlay,
} from "@/lib/likes-constants";

export type LikesBatchRequest = {
  ids: string[];
  viewerOnly: boolean;
};

function chunkIds(ids: string[], maxIds: number): string[][] {
  if (ids.length === 0) return [];
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += maxIds) {
    chunks.push(ids.slice(i, i + maxIds));
  }
  return chunks;
}

/**
 * Plan `/api/likes/batch` calls for a (possibly growing) list of page IDs.
 * IDs already fetched are skipped. IDs with SSR totals request viewer state only.
 */
export function planLikesBatchRequests(
  pageIds: string[],
  options: {
    alreadyFetched?: Iterable<string>;
    initialLikes?: Record<string, LikeCount>;
    maxIds?: number;
  } = {},
): LikesBatchRequest[] {
  const maxIds = options.maxIds ?? LIKES_BATCH_MAX_IDS;
  const fetched = new Set(options.alreadyFetched);
  const initialLikes = options.initialLikes ?? {};

  const newIds: string[] = [];
  for (const pageId of pageIds) {
    if (!pageId || fetched.has(pageId)) continue;
    newIds.push(pageId);
  }

  const viewerOnlyIds = newIds.filter((id) => id in initialLikes);
  const fullIds = newIds.filter((id) => !(id in initialLikes));

  return [
    ...chunkIds(viewerOnlyIds, maxIds).map((ids) => ({ ids, viewerOnly: true })),
    ...chunkIds(fullIds, maxIds).map((ids) => ({ ids, viewerOnly: false })),
  ];
}

export function likesBatchRequestUrl(request: LikesBatchRequest): string {
  const params = new URLSearchParams();
  params.set("ids", request.ids.join(","));
  if (request.viewerOnly) {
    params.set("fields", "viewer");
  }
  return `/api/likes/batch?${params.toString()}`;
}

/** Stamp SSR / already-known counts onto a viewer-only batch payload. */
export function hydrateViewerBatch(
  incoming: Record<string, ViewerLikeOverlay>,
  options: {
    existingViewer?: Record<string, LikeData> | null;
    stored?: Record<string, LikeData>;
    initialLikes?: Record<string, LikeCount>;
  } = {},
): Record<string, LikeData> {
  const { existingViewer, stored, initialLikes } = options;
  const result: Record<string, LikeData> = {};

  for (const [pageId, value] of Object.entries(incoming)) {
    result[pageId] = {
      count:
        value.count ??
        existingViewer?.[pageId]?.count ??
        stored?.[pageId]?.count ??
        initialLikes?.[pageId]?.count ??
        0,
      userLikes: value.userLikes,
    };
  }

  return result;
}
