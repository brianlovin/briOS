import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { checkHnRateLimit, getHnRatelimit, waitForRateLimitPending } from "@/lib/hn-ratelimit";

function getIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const ip = getIP(request);

  // Skip rate limiting for unknown IPs (shouldn't happen in production)
  if (ip === "unknown") return NextResponse.next();

  // HN routes: validate ID parameter and apply strict rate limit
  if (pathname.startsWith("/hn") || pathname.startsWith("/api/hn")) {
    // Validate /hn/[id] and /api/hn/[id] — reject non-numeric IDs early.
    // Reject anything like /hn/garbage or /hn/../etc.
    const idMatch = pathname.match(/^\/(?:api\/)?hn\/(\d+)$/);
    if (pathname !== "/hn" && pathname !== "/api/hn" && !idMatch) {
      return NextResponse.json({ error: "Invalid HN post ID" }, { status: 400 });
    }

    const decision = await checkHnRateLimit(ip, getHnRatelimit());
    waitForRateLimitPending(event, decision.pending);

    if (!decision.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": decision.limit.toString(),
            "X-RateLimit-Remaining": decision.remaining.toString(),
            "X-RateLimit-Reset": decision.reset.toString(),
            "Retry-After": Math.ceil((decision.reset - Date.now()) / 1000).toString(),
          },
        },
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // HN pages and API routes
    "/hn/:path*",
    "/api/hn/:path*",
  ],
};
