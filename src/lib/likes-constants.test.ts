import { describe, expect, test } from "bun:test";

import {
  isViewerLikeData,
  type LikeCount,
  type LikeData,
  LIKES_SERVER_CACHE_TAG,
  optimisticAddLike,
  optimisticRemoveLike,
  resolveLikeState,
} from "@/lib/likes-constants";

describe("LIKES_SERVER_CACHE_TAG", () => {
  test("is the public count cache tag busted on write", () => {
    expect(LIKES_SERVER_CACHE_TAG).toBe("likes:server");
  });
});

describe("isViewerLikeData", () => {
  test("is false for count-only SSR payloads", () => {
    const countOnly: LikeCount = { count: 12 };
    expect(isViewerLikeData(countOnly)).toBe(false);
  });

  test("is true when the viewer overlay is present", () => {
    const viewer: LikeData = { count: 12, userLikes: 3 };
    expect(isViewerLikeData(viewer)).toBe(true);
  });
});

describe("resolveLikeState", () => {
  test("treats SSR count-only data as viewer-unknown", () => {
    expect(resolveLikeState({ count: 7 }, undefined)).toEqual({
      count: 7,
      userLikes: 0,
      viewerKnown: false,
    });
  });

  test("does not invent a clickable empty viewer from missing data", () => {
    expect(resolveLikeState(undefined, undefined)).toEqual({
      count: undefined,
      userLikes: 0,
      viewerKnown: false,
    });
  });

  test("keeps a provided public count of 506 without treating it as unknown", () => {
    expect(resolveLikeState({ count: 506 }, undefined)).toEqual({
      count: 506,
      userLikes: 0,
      viewerKnown: false,
    });
  });

  test("treats an actual cached count of 0 as known zero", () => {
    expect(resolveLikeState({ count: 0 }, undefined)).toEqual({
      count: 0,
      userLikes: 0,
      viewerKnown: false,
    });
  });

  test("overlays viewer likes on the SSR count", () => {
    expect(resolveLikeState({ count: 7 }, { count: 8, userLikes: 2 })).toEqual({
      count: 8,
      userLikes: 2,
      viewerKnown: true,
    });
  });

  test("lets SWR/optimistic overlay win over the batch viewer", () => {
    expect(
      resolveLikeState({ count: 7 }, { count: 8, userLikes: 2 }, { count: 9, userLikes: 3 }),
    ).toEqual({
      count: 9,
      userLikes: 3,
      viewerKnown: true,
    });
  });

  test("treats userLikes 0 as a known viewer who has not liked", () => {
    expect(resolveLikeState({ count: 4 }, { count: 4, userLikes: 0 })).toEqual({
      count: 4,
      userLikes: 0,
      viewerKnown: true,
    });
  });
});

describe("optimistic like", () => {
  test("increments the displayed count and viewer likes", () => {
    expect(optimisticAddLike(506, 0)).toEqual({ count: 507, userLikes: 1 });
    expect(resolveLikeState({ count: 506 }, undefined, optimisticAddLike(506, 0))).toEqual({
      count: 507,
      userLikes: 1,
      viewerKnown: true,
    });
  });

  test("increments from an unknown count without flashing 0 first", () => {
    expect(optimisticAddLike(undefined, 0)).toEqual({ count: 1, userLikes: 1 });
  });

  test("decrements and floors at 0", () => {
    expect(optimisticRemoveLike(1, 1)).toEqual({ count: 0, userLikes: 0 });
    expect(optimisticRemoveLike(0, 1)).toEqual({ count: 0, userLikes: 0 });
  });
});
