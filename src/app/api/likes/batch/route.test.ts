import { afterEach, describe, expect, mock, test } from "bun:test";

const checkRateLimit = mock(async () => false);
const getBatchUserLikeData = mock(async () => new Map([["page-1", { count: 506, userLikes: 2 }]]));
const getBatchViewerLikeData = mock(async () => new Map([["page-1", 2]]));

mock.module("@/lib/likes-redis", () => ({
  checkRateLimit,
  getBatchUserLikeData,
  getBatchViewerLikeData,
}));

import { GET } from "@/app/api/likes/batch/route";
import { LIKES_BATCH_MAX_IDS } from "@/lib/likes-constants";

function batchRequest(query: string) {
  return new Request(`https://brianlovin.com/api/likes/batch?${query}`, {
    headers: { "x-forwarded-for": "1.2.3.4" },
  });
}

describe("GET /api/likes/batch", () => {
  afterEach(() => {
    checkRateLimit.mockClear();
    getBatchUserLikeData.mockClear();
    getBatchViewerLikeData.mockClear();
  });

  test("fields=viewer returns userLikes only and skips totals", async () => {
    const res = await GET(batchRequest("ids=page-1&fields=viewer"));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ "page-1": { userLikes: 2 } });
    expect(getBatchViewerLikeData).toHaveBeenCalledTimes(1);
    expect(getBatchUserLikeData).not.toHaveBeenCalled();
    expect(checkRateLimit).toHaveBeenCalledTimes(1);
  });

  test("default batch still returns count plus userLikes", async () => {
    const res = await GET(batchRequest("ids=page-1"));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ "page-1": { count: 506, userLikes: 2 } });
    expect(getBatchUserLikeData).toHaveBeenCalledTimes(1);
    expect(getBatchViewerLikeData).not.toHaveBeenCalled();
    expect(checkRateLimit).toHaveBeenCalledTimes(1);
  });

  test("rejects more than the batch max", async () => {
    const ids = Array.from({ length: LIKES_BATCH_MAX_IDS + 1 }, (_, index) => `id-${index}`);
    const res = await GET(batchRequest(`ids=${ids.join(",")}`));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: `Too many page IDs (max ${LIKES_BATCH_MAX_IDS})` });
    expect(getBatchUserLikeData).not.toHaveBeenCalled();
    expect(getBatchViewerLikeData).not.toHaveBeenCalled();
  });

  test("keeps rate limiting on viewer-only hydrates", async () => {
    checkRateLimit.mockResolvedValueOnce(true);
    const res = await GET(batchRequest("ids=page-1&fields=viewer"));

    expect(res.status).toBe(429);
    expect(getBatchViewerLikeData).not.toHaveBeenCalled();
    expect(getBatchUserLikeData).not.toHaveBeenCalled();
  });
});
