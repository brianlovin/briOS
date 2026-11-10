import { afterEach, describe, expect, mock, test } from "bun:test";

import { installAxiomMock } from "@/lib/axiom-test-utils";

const axiomMock = installAxiomMock();

class SpotifyOwnerMismatchError extends Error {}
const exchangeCodeForToken = mock(async (code: string) => void code);

mock.module("@/lib/spotify/auth", () => ({
  exchangeCodeForToken,
  SpotifyOwnerMismatchError,
}));

import { NextRequest } from "next/server";

import { GET } from "@/app/api/spotify/callback/route";
import { SPOTIFY_STATE_COOKIE } from "@/lib/spotify/oauth-state";

function callback(query: string, cookieState?: string) {
  return new NextRequest(`https://brianlovin.com/api/spotify/callback?${query}`, {
    headers: cookieState ? { cookie: `${SPOTIFY_STATE_COOKIE}=${cookieState}` } : {},
  });
}

describe("GET /api/spotify/callback", () => {
  afterEach(() => {
    exchangeCodeForToken.mockClear();
    axiomMock.enable();
  });

  test("rejects a code with no state cookie (login CSRF)", async () => {
    const res = await GET(callback("code=attacker-code&state=abc"));
    expect(res.status).toBe(400);
    expect(exchangeCodeForToken).not.toHaveBeenCalled();
  });

  test("rejects a state that does not match the cookie", async () => {
    const res = await GET(callback("code=c&state=wrong", "right"));
    expect(res.status).toBe(400);
    expect(exchangeCodeForToken).not.toHaveBeenCalled();
  });

  test("exchanges the code when state matches, then clears the cookie", async () => {
    const res = await GET(callback("code=c&state=s3cret", "s3cret"));
    expect(res.status).toBe(307);
    expect(exchangeCodeForToken).toHaveBeenCalledWith("c");
    expect(res.headers.get("set-cookie")).toContain(`${SPOTIFY_STATE_COOKIE}=;`);
  });

  test("returns 403 when the authorizing account is not the owner", async () => {
    exchangeCodeForToken.mockImplementationOnce(async () => {
      throw new SpotifyOwnerMismatchError("not owner");
    });
    const res = await GET(callback("code=c&state=s", "s"));
    expect(res.status).toBe(403);
  });
});
