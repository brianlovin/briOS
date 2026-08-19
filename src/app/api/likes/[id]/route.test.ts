import { afterEach, describe, expect, mock, test } from "bun:test";

const revalidateTag = mock(() => {});

mock.module("next/cache", () => ({
  revalidateTag,
}));

const addLike = mock(async () => 507);
const removeLike = mock(async () => ({ count: 506, userLikes: 0 }));
const getUserLikeCount = mock(async () => 0);
const checkRateLimit = mock(async () => false);
const getMaxLikesPerUser = mock(() => 16);
const getLikeCount = mock(async () => 506);

mock.module("@/lib/likes-redis", () => ({
  addLike,
  removeLike,
  getUserLikeCount,
  checkRateLimit,
  getMaxLikesPerUser,
  getLikeCount,
}));

mock.module("@/lib/activity-redis", () => ({
  getActivityStore: () => null,
}));

import { DELETE, GET, POST } from "@/app/api/likes/[id]/route";
import { LIKES_SERVER_CACHE_TAG } from "@/lib/likes-constants";

function likesRequest(method: string, id = "page-1", body?: unknown) {
  return new Request(`https://brianlovin.com/api/likes/${id}`, {
    method,
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "1.2.3.4",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

const params = { params: Promise.resolve({ id: "page-1" }) };

describe("POST/DELETE /api/likes/[id]", () => {
  afterEach(() => {
    revalidateTag.mockClear();
    addLike.mockClear();
    removeLike.mockClear();
    getUserLikeCount.mockClear();
    checkRateLimit.mockClear();
  });

  test("POST revalidates the likes:server snapshot after a successful write", async () => {
    getUserLikeCount.mockResolvedValueOnce(0);
    const res = await POST(
      likesRequest("POST", "page-1", { title: "Cursor", href: "/stack", content_type: "stack" }),
      params,
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ count: 507, userLikes: 1 });
    expect(addLike).toHaveBeenCalledTimes(1);
    expect(revalidateTag).toHaveBeenCalledTimes(1);
    expect(revalidateTag).toHaveBeenCalledWith(LIKES_SERVER_CACHE_TAG, "max");
  });

  test("DELETE revalidates the likes:server snapshot after a successful write", async () => {
    getUserLikeCount.mockResolvedValueOnce(1);
    const res = await DELETE(likesRequest("DELETE"), params);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ count: 506, userLikes: 0 });
    expect(removeLike).toHaveBeenCalledTimes(1);
    expect(revalidateTag).toHaveBeenCalledTimes(1);
    expect(revalidateTag).toHaveBeenCalledWith(LIKES_SERVER_CACHE_TAG, "max");
  });

  test("does not revalidate when the write is rejected", async () => {
    checkRateLimit.mockResolvedValueOnce(true);
    const limited = await POST(
      likesRequest("POST", "page-1", { title: "Cursor", href: "/stack", content_type: "stack" }),
      params,
    );
    expect(limited.status).toBe(429);
    expect(addLike).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();

    getUserLikeCount.mockResolvedValueOnce(0);
    const nothingToRemove = await DELETE(likesRequest("DELETE"), params);
    expect(nothingToRemove.status).toBe(400);
    expect(removeLike).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  test("GET does not revalidate likes:server", async () => {
    const res = await GET(likesRequest("GET"), params);
    expect(res.status).toBe(200);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
