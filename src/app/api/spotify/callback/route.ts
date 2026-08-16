import { NextRequest, NextResponse } from "next/server";

import { withErrorCapture } from "@/lib/observability/sentry";
import { exchangeCodeForToken } from "@/lib/spotify/auth";

async function getHandler(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  if (error) {
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
    return NextResponse.redirect(new URL("/", req.url));
  } catch (error: unknown) {
    console.error("Error exchanging code for token:", error);
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

export const GET = withErrorCapture(getHandler);
