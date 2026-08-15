/**
 * Shared constants and types for the likes system
 * Used by both client and server code
 */

export const MAX_LIKES_PER_USER = 16;

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
 */
export function resolveLikeState(
  countOnly: LikeCount | undefined,
  viewer: LikeData | undefined,
  overlay?: LikeData,
): { count: number; userLikes: number; viewerKnown: boolean } {
  const likeData = overlay ?? viewer;
  return {
    count: likeData?.count ?? countOnly?.count ?? 0,
    userLikes: likeData?.userLikes ?? 0,
    viewerKnown: likeData !== undefined,
  };
}
