import { Redis } from "@upstash/redis";
import { describe, expect, test } from "bun:test";

import { MAX_LIKES_PER_USER } from "@/lib/likes-constants";
import {
  addLike,
  batchTotalLikeKeys,
  batchUserLikeRedisKeys,
  batchViewerLikeKeys,
  getBatchLikeCounts,
  getBatchUserLikeData,
  getBatchViewerLikeData,
  getLikeCount,
  getMaxLikesPerUser,
  getUserLikeCount,
  removeLike,
} from "@/lib/likes-redis";

describe("getMaxLikesPerUser", () => {
  test("matches the shared constant", () => {
    expect(getMaxLikesPerUser()).toBe(MAX_LIKES_PER_USER);
  });
});

describe("batch like redis keys", () => {
  const pageIds = ["page-1", "page-2"];
  const userId = "viewer-1";

  test("viewer-only batch reads user keys and not totals", () => {
    expect(batchViewerLikeKeys(userId, pageIds)).toEqual([
      "likes:user:viewer-1:page-1",
      "likes:user:viewer-1:page-2",
    ]);
    expect(batchViewerLikeKeys(userId, pageIds).some((key) => key.startsWith("likes:total:"))).toBe(
      false,
    );
  });

  test("full batch still names totals plus viewer keys", () => {
    expect(batchUserLikeRedisKeys(userId, pageIds)).toEqual([
      "likes:total:page-1",
      "likes:total:page-2",
      "likes:user:viewer-1:page-1",
      "likes:user:viewer-1:page-2",
    ]);
    expect(batchTotalLikeKeys(pageIds)).toEqual(["likes:total:page-1", "likes:total:page-2"]);
  });
});

const redisConfigured = Boolean(
  process.env.UPSTASH_LIKES_REST_URL && process.env.UPSTASH_LIKES_REST_TOKEN,
);

describe.skipIf(!redisConfigured)("likes redis (count + viewer only)", () => {
  const pageId = `__s07_likes_model_${crypto.randomUUID()}`;
  const userId = "s07-test-viewer";
  const totalKey = `likes:total:${pageId}`;
  const userKey = `likes:user:${userId}:${pageId}`;
  const abandonedSetKey = `likes:users:${pageId}`;

  async function likesClient(): Promise<Redis> {
    return new Redis({
      url: process.env.UPSTASH_LIKES_REST_URL!,
      token: process.env.UPSTASH_LIKES_REST_TOKEN!,
    });
  }

  async function cleanup() {
    const client = await likesClient();
    await client.del(totalKey, userKey, abandonedSetKey);
  }

  test("like and unlike update count and userLikes without a users set", async () => {
    const client = await likesClient();
    await cleanup();

    try {
      expect(await getLikeCount(pageId)).toBe(0);
      expect(await getUserLikeCount(userId, pageId)).toBe(0);

      const afterLike = await addLike(userId, pageId);
      expect(afterLike).toBe(1);
      expect(await getLikeCount(pageId)).toBe(1);
      expect(await getUserLikeCount(userId, pageId)).toBe(1);

      const batch = await getBatchUserLikeData(userId, [pageId]);
      expect(batch.get(pageId)).toEqual({ count: 1, userLikes: 1 });
      expect(batch.get(pageId)).not.toHaveProperty("hasLiked");
      expect(batch.get(pageId)).not.toHaveProperty("canLike");

      const viewerOnly = await getBatchViewerLikeData(userId, [pageId]);
      expect(viewerOnly.get(pageId)).toBe(1);

      const counts = await getBatchLikeCounts([pageId]);
      expect(counts.get(pageId)).toBe(1);

      expect(await client.exists(abandonedSetKey)).toBe(0);

      const afterUnlike = await removeLike(userId, pageId);
      expect(afterUnlike).toEqual({ count: 0, userLikes: 0 });
      expect(await getLikeCount(pageId)).toBe(0);
      expect(await getUserLikeCount(userId, pageId)).toBe(0);
      expect(await client.exists(abandonedSetKey)).toBe(0);
    } finally {
      await cleanup();
    }
  });
});
