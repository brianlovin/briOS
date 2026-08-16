import { expect, mock, test } from "bun:test";

// Mock the Notion singleton + getDataSourceId helper.
// `updateCalls` records every pages.update() so tests can assert on them
// (e.g. that an expired token page is archived).
const notionPage = {
  id: "page1",
  properties: {
    Value: {
      rich_text: [{ plain_text: "refresh_initial" }],
    },
  },
};

let updateCalls: unknown[] = [];

const mockNotion = {
  dataSources: {
    query: async () => ({ results: [notionPage] }),
  },
  pages: {
    update: async (args: unknown) => {
      updateCalls.push(args);
    },
    create: async () => ({}),
  },
};

mock.module("@/lib/notion/client", () => ({ notion: mockNotion }));
mock.module("@/lib/notion/queries", () => ({
  getDataSourceId: async () => "ds1",
}));

// Mock fetch for the Spotify token endpoint. Each test sets `fetchResponder`
// to control the response, and `fetchCalls` counts network hits.
let fetchCalls = 0;
let fetchResponder: () => Response = () =>
  ({
    ok: true,
    json: async () => ({
      access_token: "access1",
      expires_in: 3600,
      refresh_token: "refresh_new",
      scope: "",
      token_type: "Bearer",
    }),
  }) as Response;

const _ORIGINAL_FETCH = globalThis.fetch;
const mockFetch = async () => {
  fetchCalls += 1;
  return fetchResponder() as unknown as Response;
};
(mockFetch as unknown as { preconnect: () => void }).preconnect = () => {};
globalThis.fetch = mockFetch as unknown as typeof fetch;

process.env.SPOTIFY_CLIENT_ID = "id";
process.env.SPOTIFY_CLIENT_SECRET = "secret";
process.env.SPOTIFY_TOKEN_DATABASE_ID = "db";

// NOTE: getSpotifyToken() keeps a module-level access-token cache, so this
// invalid_grant test runs FIRST while the cache is still empty. Its failure
// path also resets the cache to null, leaving a clean slate for the caching
// test below.
test("getSpotifyToken discards the token and requires reauth on invalid_grant", async () => {
  const { getSpotifyToken, SpotifyReauthRequiredError } = await import("./auth");

  updateCalls = [];
  fetchResponder = () =>
    ({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: async () => ({
        error: "invalid_grant",
        error_description: "Refresh token revoked",
      }),
    }) as unknown as Response;

  await expect(getSpotifyToken()).rejects.toBeInstanceOf(SpotifyReauthRequiredError);

  // The expired refresh-token page must be archived (discarded), not retried.
  expect(updateCalls).toHaveLength(1);
  expect(updateCalls[0]).toMatchObject({ page_id: "page1", archived: true });
});

test("getSpotifyToken caches the access token", async () => {
  const { getSpotifyToken } = await import("./auth");

  fetchCalls = 0;
  fetchResponder = () =>
    ({
      ok: true,
      json: async () => ({
        access_token: "access1",
        expires_in: 3600,
        refresh_token: "refresh_new",
        scope: "",
        token_type: "Bearer",
      }),
    }) as unknown as Response;

  const token1 = await getSpotifyToken();
  const token2 = await getSpotifyToken();

  expect(token1).toBe("access1");
  expect(token2).toBe("access1");
  expect(fetchCalls).toBe(1); // network called only once
  globalThis.fetch = _ORIGINAL_FETCH;
});
