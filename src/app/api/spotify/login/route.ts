import { NextResponse } from "next/server";

import { withErrorCapture } from "@/lib/observability/sentry";
import { getSpotifyAuthUrl } from "@/lib/spotify/auth";

// Kicks off the Spotify OAuth flow by redirecting to Spotify's consent screen.
// Spotify redirects back to /api/spotify/callback, which stores the new refresh
// token in Notion. Use this to (re)authorize, e.g. after an invalid_grant.
async function getHandler() {
  return NextResponse.redirect(getSpotifyAuthUrl());
}

export const GET = withErrorCapture(getHandler);
