import { describe, expect, test } from "bun:test";

import { resolveLikeState } from "@/lib/likes-constants";
import {
  LIKES_VIEWER_STORAGE_KEY,
  mergeStoredViewerLikes,
  parseStoredViewerLikes,
  readStoredViewerHint,
  storedViewerHint,
  storedViewerHints,
  type ViewerLikeStore,
  writeStoredViewerLike,
  writeStoredViewerLikes,
} from "@/lib/likes-viewer-store";

function memoryStore(
  initial: Record<string, string> = {},
): ViewerLikeStore & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem(key: string) {
      return data[key] ?? null;
    },
    setItem(key: string, value: string) {
      data[key] = value;
    },
  };
}

describe("parseStoredViewerLikes", () => {
  test("keeps only pageId plus count and userLikes", () => {
    expect(
      parseStoredViewerLikes(
        JSON.stringify({
          "page-1": { count: 507, userLikes: 1, title: "secret", ip: "1.2.3.4" },
        }),
      ),
    ).toEqual({ "page-1": { count: 507, userLikes: 1 } });
  });

  test("drops corrupt JSON and invalid entries", () => {
    expect(parseStoredViewerLikes("{")).toEqual({});
    expect(parseStoredViewerLikes(JSON.stringify(["nope"]))).toEqual({});
    expect(
      parseStoredViewerLikes(
        JSON.stringify({
          "page-1": { count: 507 },
          "page-2": { count: -1, userLikes: 1 },
          "page-3": { count: 1, userLikes: 99 },
          "bad id": { count: 1, userLikes: 1 },
        }),
      ),
    ).toEqual({});
  });

  test("does not invent a like when userLikes is 0 or missing", () => {
    expect(storedViewerHint({}, "page-1")).toBeUndefined();
    expect(storedViewerHint({ "page-1": { count: 506, userLikes: 0 } }, "page-1")).toEqual({
      count: 506,
      userLikes: 0,
    });
    expect(resolveLikeState({ count: 506 }, storedViewerHint({}, "page-1"))).toEqual({
      count: 506,
      userLikes: 0,
      viewerKnown: false,
    });
    expect(
      resolveLikeState(
        { count: 506 },
        storedViewerHint({ "page-1": { count: 506, userLikes: 0 } }, "page-1"),
      ),
    ).toEqual({
      count: 506,
      userLikes: 0,
      viewerKnown: true,
    });
  });
});

describe("stored viewer overlay", () => {
  test("fills heart and count from storage before the live batch", () => {
    const stored = { "page-1": { count: 507, userLikes: 1 } };
    expect(storedViewerHints(stored, ["page-1"])).toEqual(stored);
    expect(resolveLikeState({ count: 506 }, stored["page-1"])).toEqual({
      count: 507,
      userLikes: 1,
      viewerKnown: true,
    });
  });

  test("lets the live batch override a stale store", () => {
    const stored = { count: 507, userLikes: 1 };
    const live = { count: 510, userLikes: 2 };
    expect(resolveLikeState({ count: 506 }, stored, live)).toEqual({
      count: 510,
      userLikes: 2,
      viewerKnown: true,
    });
  });
});

describe("writeStoredViewerLikes", () => {
  test("writes and reads a successful like", () => {
    const store = memoryStore();
    writeStoredViewerLike("page-1", { count: 507, userLikes: 1 }, store);
    expect(readStoredViewerHint("page-1", store)).toEqual({ count: 507, userLikes: 1 });
    expect(store.data[LIKES_VIEWER_STORAGE_KEY]).not.toContain("ip");
    expect(store.data[LIKES_VIEWER_STORAGE_KEY]).not.toContain("title");
  });

  test("ignores quota errors", () => {
    const store: ViewerLikeStore = {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    };
    expect(() =>
      writeStoredViewerLikes({ "page-1": { count: 1, userLikes: 1 } }, store),
    ).not.toThrow();
  });

  test("caps the map and keeps the newest pages", () => {
    const existing = Object.fromEntries(
      Array.from({ length: 2 }, (_, index) => [`old-${index}`, { count: index, userLikes: 0 }]),
    );
    const next = mergeStoredViewerLikes(existing, { fresh: { count: 9, userLikes: 1 } }, 2);
    expect(next).toEqual({
      "old-1": { count: 1, userLikes: 0 },
      fresh: { count: 9, userLikes: 1 },
    });
  });
});
