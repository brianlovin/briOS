import { describe, expect, test } from "bun:test";

import {
  hydrateViewerBatch,
  likesBatchRequestUrl,
  planLikesBatchRequests,
} from "@/lib/likes-batch";
import { LIKES_BATCH_MAX_IDS } from "@/lib/likes-constants";

describe("planLikesBatchRequests", () => {
  test("requests viewer state only when SSR already stamped totals", () => {
    expect(
      planLikesBatchRequests(["page-1", "page-2"], {
        initialLikes: { "page-1": { count: 4 }, "page-2": { count: 0 } },
      }),
    ).toEqual([{ ids: ["page-1", "page-2"], viewerOnly: true }]);
  });

  test("requests totals when SSR did not stamp a page", () => {
    expect(planLikesBatchRequests(["page-1", "page-2"])).toEqual([
      { ids: ["page-1", "page-2"], viewerOnly: false },
    ]);
  });

  test("splits viewer-only and full fetches when only some IDs have SSR totals", () => {
    expect(
      planLikesBatchRequests(["page-1", "page-2", "page-3"], {
        initialLikes: { "page-1": { count: 1 }, "page-3": { count: 0 } },
      }),
    ).toEqual([
      { ids: ["page-1", "page-3"], viewerOnly: true },
      { ids: ["page-2"], viewerOnly: false },
    ]);
  });

  test("only requests newly added IDs when the list grows", () => {
    const first = planLikesBatchRequests(["a", "b"], {
      initialLikes: { a: { count: 1 }, b: { count: 2 } },
    });
    expect(first).toEqual([{ ids: ["a", "b"], viewerOnly: true }]);

    const fetched = first.flatMap((request) => request.ids);
    expect(
      planLikesBatchRequests(["a", "b", "c", "d"], {
        alreadyFetched: fetched,
        initialLikes: { a: { count: 1 }, b: { count: 2 } },
      }),
    ).toEqual([{ ids: ["c", "d"], viewerOnly: false }]);
  });

  test("does not refetch when pageIds is unchanged", () => {
    expect(
      planLikesBatchRequests(["a", "b"], {
        alreadyFetched: ["a", "b"],
        initialLikes: { a: { count: 1 }, b: { count: 2 } },
      }),
    ).toEqual([]);
  });

  test("chunks requests to the batch max so /sites-sized lists do not 400", () => {
    const pageIds = Array.from({ length: 168 }, (_, index) => `site-${index}`);
    const initialLikes = Object.fromEntries(pageIds.map((id) => [id, { count: 1 }]));
    const requests = planLikesBatchRequests(pageIds, { initialLikes });

    expect(requests.every((request) => request.viewerOnly)).toBe(true);
    expect(requests.every((request) => request.ids.length <= LIKES_BATCH_MAX_IDS)).toBe(true);
    expect(requests.map((request) => request.ids.length)).toEqual([100, 68]);
    expect(requests.flatMap((request) => request.ids)).toEqual(pageIds);
  });
});

describe("likesBatchRequestUrl", () => {
  test("adds fields=viewer for viewer-only hydrates", () => {
    expect(likesBatchRequestUrl({ ids: ["a", "b"], viewerOnly: true })).toBe(
      "/api/likes/batch?ids=a%2Cb&fields=viewer",
    );
  });

  test("omits fields when totals are still needed", () => {
    expect(likesBatchRequestUrl({ ids: ["c"], viewerOnly: false })).toBe("/api/likes/batch?ids=c");
  });
});

describe("hydrateViewerBatch", () => {
  test("keeps the SSR count and applies viewer likes", () => {
    expect(
      hydrateViewerBatch(
        { "page-1": { userLikes: 2 } },
        { initialLikes: { "page-1": { count: 506 } } },
      ),
    ).toEqual({ "page-1": { count: 506, userLikes: 2 } });
  });

  test("prefers a live count from a full batch payload", () => {
    expect(
      hydrateViewerBatch(
        { "page-1": { count: 12, userLikes: 1 } },
        { initialLikes: { "page-1": { count: 9 } } },
      ),
    ).toEqual({ "page-1": { count: 12, userLikes: 1 } });
  });

  test("does not clobber a this-session like count with a stale SSR total", () => {
    expect(
      hydrateViewerBatch(
        { "page-1": { userLikes: 1 } },
        {
          stored: { "page-1": { count: 508, userLikes: 1 } },
          initialLikes: { "page-1": { count: 506 } },
        },
      ),
    ).toEqual({ "page-1": { count: 508, userLikes: 1 } });
  });
});
