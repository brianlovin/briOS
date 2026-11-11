import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { annotate, withAxiom } from "@/lib/observability/axiom-route";
import { withErrorCapture } from "@/lib/observability/sentry";
import { exchangeCodeForToken, SpotifyOwnerMismatchError } from "@/lib/spotify/auth";
import { isValidSpotifyState, SPOTIFY_STATE_COOKIE } from "@/lib/spotify/oauth-state";

function clearStateCookie(response: NextResponse): NextResponse {
  response.cookies.set(SPOTIFY_STATE_COOKIE, "", { path: "/api/spotify", maxAge: 0 });
  return response;
}

async function getHandler(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  if (error) {
    annotate({ outcome: "oauth_error", oauth_error: error });
    return NextResponse.json(
      {
        error: "OAuth error",
        details: error_description || error,
        code: error,
      },
      { status: 400 },
    );
  }

  if (!code) {
    annotate({ outcome: "missing_code" });
    return NextResponse.json(
      {
        error: "Missing authorization code",
        details: "No authorization code was provided in the callback URL",
        code: "MISSING_CODE",
      },
      { status: 400 },
    );
  }

  // The callback must come from the browser that started /api/spotify/login.
  const state = searchParams.get("state");
  if (!isValidSpotifyState(state, req.cookies.get(SPOTIFY_STATE_COOKIE)?.value)) {
    annotate({ outcome: "invalid_state" });
    return clearStateCookie(
      NextResponse.json(
        {
          error: "Invalid OAuth state",
          details: "Start the Spotify sign-in again from /api/spotify/login",
          code: "INVALID_STATE",
        },
        { status: 400 },
      ),
    );
  }

  try {
    await exchangeCodeForToken(code);
    annotate({ outcome: "authorized" });
    return clearStateCookie(NextResponse.redirect(new URL("/", req.url)));
  } catch (error: unknown) {
    if (error instanceof SpotifyOwnerMismatchError) {
      annotate({ outcome: "owner_mismatch" });
      return clearStateCookie(
        NextResponse.json(
          { error: "Forbidden", details: error.message, code: "OWNER_MISMATCH" },
          { status: 403 },
        ),
      );
    }
    logger.error("Error exchanging Spotify code for token", error);
    return clearStateCookie(
      NextResponse.json(
        {
          error: "Failed to exchange code for token",
          details: "An unexpected error occurred during authentication",
          code: "TOKEN_EXCHANGE_FAILED",
        },
        { status: 500 },
      ),
    );
  }
}

export const GET = withAxiom(withErrorCapture(getHandler), {
  name: "spotify.oauth-callback",
  kind: "webhook",
});
