/**
 * Shared constants and types for the likes system
 * Used by both client and server code
 */

export const MAX_LIKES_PER_USER = 16;

/** `unstable_cache` tag for public like counts. Bust on POST/DELETE. */
export const LIKES_SERVER_CACHE_TAG = "likes:server";

/** SSR / cached count. Viewer state is unknown. */
export interface LikeCount {
  count: number;
}

/** Count plus the current viewer's like count (hash of IP + salt). */
export interface LikeData {
  count: number;
  userLikes: number;
}

export function isViewerLikeData(data: LikeCount | LikeData): data is LikeData {
  return "userLikes" in data;
}

/**
 * Merge SSR count, batch viewer overlay, and optional SWR/optimistic overlay.
 * `userLikes` is only meaningful when `viewerKnown` is true.
 * `count` is undefined until a real count is known — unknown is not 0.
 */
export function resolveLikeState(
  countOnly: LikeCount | undefined,
  viewer: LikeData | undefined,
  overlay?: LikeData,
): { count: number | undefined; userLikes: number; viewerKnown: boolean } {
  const likeData = overlay ?? viewer;
  return {
    count: likeData?.count ?? countOnly?.count,
    userLikes: likeData?.userLikes ?? 0,
    viewerKnown: likeData !== undefined,
  };
}

/** Optimistic add from the count currently on screen (unknown starts at 0). */
export function optimisticAddLike(count: number | undefined, userLikes: number): LikeData {
  return {
    count: (count ?? 0) + 1,
    userLikes: userLikes + 1,
  };
}

/** Optimistic remove from the count currently on screen. */
export function optimisticRemoveLike(count: number | undefined, userLikes: number): LikeData {
  return {
    count: Math.max(0, (count ?? 0) - 1),
    userLikes: Math.max(0, userLikes - 1),
  };
}
