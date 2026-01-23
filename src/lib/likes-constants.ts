/**
 * Shared constants and types for the likes system
 * Used by both client and server code
 */

export const MAX_LIKES_PER_USER = 16;

export interface LikeData {
  count: number;
  userLikes: number;
  hasLiked: boolean;
  canLike: boolean;
}
