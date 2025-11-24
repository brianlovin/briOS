import { NextRequest, NextResponse } from "next/server";

import { exchangeCodeForToken } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  try {
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

    await exchangeCodeForToken(code);
    return NextResponse.redirect(new URL("/", req.url));
  } catch (error: any) {
    console.error("Error exchanging code for token:", error);

    // Handle specific OAuth errors
    if (error.response?.data?.error) {
      return NextResponse.json(
        {
          error: "Spotify OAuth error",
          details: error.response.data.error_description || error.response.data.error,
          code: error.response.data.error,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to exchange code for token",
        details: error.message || "An unexpected error occurred during authentication",
        code: "TOKEN_EXCHANGE_FAILED",
      },
      { status: 500 },
    );
  }
}
