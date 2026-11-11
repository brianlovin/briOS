import { NextResponse } from "next/server";

import { withAxiom } from "@/lib/observability/axiom-route";
import { withErrorCapture } from "@/lib/observability/sentry";
import { getSpotifyAuthUrl } from "@/lib/spotify/auth";
import {
  createSpotifyState,
  SPOTIFY_STATE_COOKIE,
  SPOTIFY_STATE_MAX_AGE_SECONDS,
} from "@/lib/spotify/oauth-state";

// Kicks off the Spotify OAuth flow by redirecting to Spotify's consent screen.
// Spotify redirects back to /api/spotify/callback, which stores the new refresh
// token in Notion. Use this to (re)authorize, e.g. after an invalid_grant.
// A random `state` is set in an HttpOnly cookie and checked by the callback.
async function getHandler() {
  const state = createSpotifyState();
  const response = NextResponse.redirect(getSpotifyAuthUrl(state));
  response.cookies.set(SPOTIFY_STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/spotify",
    maxAge: SPOTIFY_STATE_MAX_AGE_SECONDS,
  });
  return response;
}

export const GET = withAxiom(withErrorCapture(getHandler), { name: "/api/spotify/login" });
