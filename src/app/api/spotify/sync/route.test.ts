import { afterAll, afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

import { installAxiomMock } from "@/lib/axiom-test-utils";

const axiomMock = installAxiomMock();

const fetchRecentSpotifyItems = mock(async () => []);
const recentUniqueItems = mock((items: unknown[]) => items);

mock.module("@/lib/spotify/sync", () => ({
  fetchRecentSpotifyItems,
  recentUniqueItems,
}));

import { NextRequest } from "next/server";

import { GET, POST } from "@/app/api/spotify/sync/route";

const previousSecret = process.env.CRON_SECRET;

function syncRequest(method: "GET" | "POST", authorization?: string) {
  return new NextRequest("https://brianlovin.com/api/spotify/sync", {
    method,
    headers: authorization ? { authorization } : {},
  });
}

describe("/api/spotify/sync auth", () => {
  beforeEach(() => {
    axiomMock.enable();
    process.env.CRON_SECRET = "cron-secret";
  });

  afterEach(() => {
    fetchRecentSpotifyItems.mockClear();
  });

  afterAll(() => {
    if (previousSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previousSecret;
  });

  test("POST without the cron secret is rejected before syncing", async () => {
    const res = await POST(syncRequest("POST"));
    expect(res.status).toBe(401);
    expect(fetchRecentSpotifyItems).not.toHaveBeenCalled();
  });

  test("POST with the wrong secret is rejected", async () => {
    const res = await POST(syncRequest("POST", "Bearer nope"));
    expect(res.status).toBe(401);
    expect(fetchRecentSpotifyItems).not.toHaveBeenCalled();
  });

  test("POST and GET with the cron secret run the sync", async () => {
    expect((await POST(syncRequest("POST", "Bearer cron-secret"))).status).toBe(200);
    expect((await GET(syncRequest("GET", "Bearer cron-secret"))).status).toBe(200);
    expect(fetchRecentSpotifyItems).toHaveBeenCalledTimes(2);
  });

  test("an unset CRON_SECRET fails closed instead of accepting 'Bearer undefined'", async () => {
    delete process.env.CRON_SECRET;
    expect((await GET(syncRequest("GET", "Bearer undefined"))).status).toBe(401);
    expect((await POST(syncRequest("POST", "Bearer undefined"))).status).toBe(401);
    expect(fetchRecentSpotifyItems).not.toHaveBeenCalled();
  });
});
