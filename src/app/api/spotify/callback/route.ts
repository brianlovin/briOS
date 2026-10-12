import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { annotate, withAxiom } from "@/lib/observability/axiom-route";
import { withErrorCapture } from "@/lib/observability/sentry";
import { exchangeCodeForToken } from "@/lib/spotify/auth";

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

  try {
    await exchangeCodeForToken(code);
    annotate({ outcome: "authorized" });
    return NextResponse.redirect(new URL("/", req.url));
  } catch (error: unknown) {
    logger.error("Error exchanging Spotify code for token", error);
    return NextResponse.json(
      {
        error: "Failed to exchange code for token",
        details:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during authentication",
        code: "TOKEN_EXCHANGE_FAILED",
      },
      { status: 500 },
    );
  }
}

export const GET = withAxiom(withErrorCapture(getHandler), {
  name: "spotify.oauth-callback",
  kind: "webhook",
});
