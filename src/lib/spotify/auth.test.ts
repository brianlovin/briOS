import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";

import { notion } from "@/lib/notion/client";
import * as queries from "@/lib/notion/queries";
import {
  exchangeCodeForToken,
  getSpotifyAuthUrl,
  SpotifyOwnerMismatchError,
} from "@/lib/spotify/auth";

const previousOwner = process.env.SPOTIFY_OWNER_ID;

function stubSpotify(userId: string) {
  return spyOn(globalThis, "fetch").mockImplementation((async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/api/token")) {
      return Response.json({
        access_token: "access",
        token_type: "Bearer",
        scope: "",
        expires_in: 3600,
        refresh_token: "new-refresh",
      });
    }
    if (url.endsWith("/v1/me")) return Response.json({ id: userId });
    throw new Error(`unexpected fetch ${url}`);
  }) as typeof fetch);
}

describe("exchangeCodeForToken", () => {
  let create: ReturnType<typeof spyOn>;
  let update: ReturnType<typeof spyOn>;

  beforeEach(() => {
    process.env.SPOTIFY_OWNER_ID = "owner-id";
    process.env.SPOTIFY_TOKEN_DATABASE_ID = "token-db";
    spyOn(queries, "getDataSourceId").mockResolvedValue("ds-token");
    create = spyOn(notion.pages, "create").mockResolvedValue({} as never);
    update = spyOn(notion.pages, "update").mockResolvedValue({} as never);
  });

  afterEach(() => {
    mock.restore();
    if (previousOwner === undefined) delete process.env.SPOTIFY_OWNER_ID;
    else process.env.SPOTIFY_OWNER_ID = previousOwner;
  });

  test("refuses to store a token for another Spotify account", async () => {
    stubSpotify("someone-else");
    spyOn(notion.dataSources, "query").mockResolvedValue({ results: [] } as never);
    await expect(exchangeCodeForToken("code")).rejects.toBeInstanceOf(SpotifyOwnerMismatchError);
    expect(create).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  test("refuses when SPOTIFY_OWNER_ID is not configured", async () => {
    delete process.env.SPOTIFY_OWNER_ID;
    stubSpotify("owner-id");
    await expect(exchangeCodeForToken("code")).rejects.toBeInstanceOf(SpotifyOwnerMismatchError);
    expect(create).not.toHaveBeenCalled();
  });

  test("updates the newest token page and archives extras for the owner", async () => {
    stubSpotify("owner-id");
    spyOn(notion.dataSources, "query").mockResolvedValue({
      results: [{ id: "newest" }, { id: "older" }],
    } as never);
    await exchangeCodeForToken("code");
    expect(create).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith({ page_id: "older", archived: true });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ page_id: "newest", properties: expect.anything() }),
    );
  });

  test("creates the token page when none exists", async () => {
    stubSpotify("owner-id");
    spyOn(notion.dataSources, "query").mockResolvedValue({ results: [] } as never);
    await exchangeCodeForToken("code");
    expect(create).toHaveBeenCalledTimes(1);
  });
});

describe("getSpotifyAuthUrl", () => {
  test("includes the state parameter", () => {
    expect(new URL(getSpotifyAuthUrl("abc")).searchParams.get("state")).toBe("abc");
  });
});
