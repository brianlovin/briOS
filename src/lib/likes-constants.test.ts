import { describe, expect, test } from "bun:test";

import {
  isViewerLikeData,
  type LikeCount,
  type LikeData,
  resolveLikeState,
} from "@/lib/likes-constants";

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
