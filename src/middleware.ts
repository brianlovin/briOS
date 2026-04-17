import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Lazy-initialize to avoid build-time env var errors
let hnRatelimit: Ratelimit | null = null;
let globalRatelimit: Ratelimit | null = null;

function getHnRatelimit(): Ratelimit | null {
  if (hnRatelimit) return hnRatelimit;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;

  hnRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    // 30 requests per 60 seconds per IP for HN routes
    limiter: Ratelimit.slidingWindow(30, "60 s"),
    prefix: "rl:hn",
    analytics: true,
  });
  return hnRatelimit;
}

function getGlobalRatelimit(): Ratelimit | null {
  if (globalRatelimit) return globalRatelimit;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;

  globalRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    // 60 requests per 60 seconds per IP globally
    limiter: Ratelimit.slidingWindow(60, "60 s"),
    prefix: "rl:global",
    analytics: true,
  });
  return globalRatelimit;
}

function getIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getIP(request);

  // Skip rate limiting for unknown IPs (shouldn't happen in production)
  if (ip === "unknown") return NextResponse.next();

  // HN routes: validate ID parameter and apply strict rate limit
  if (pathname.startsWith("/hn") || pathname.startsWith("/api/hn")) {
    // Validate /hn/[id] — reject non-numeric IDs early
    const idMatch = pathname.match(/^\/(?:api\/)?hn\/(\d+)$/);
    if (
      pathname !== "/hn" &&
      pathname !== "/api/hn" &&
      !pathname.startsWith("/api/hn/s") &&
      !idMatch
    ) {
      // Allow /api/hn/subscribe, /api/hn/unsubscribe, /api/hn/send, /api/hn/test
      // but reject anything like /hn/garbage or /hn/../etc
      if (!pathname.match(/^\/api\/hn\/(subscribe|unsubscribe|send|test)$/)) {
        return NextResponse.json({ error: "Invalid HN post ID" }, { status: 400 });
      }
    }

    const limiter = getHnRatelimit();
    if (limiter) {
      const { success, limit, remaining, reset } = await limiter.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests" },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
              "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
            },
          },
        );
      }
    }

    return NextResponse.next();
  }

  // Global rate limit for all other API routes
  if (pathname.startsWith("/api/")) {
    const limiter = getGlobalRatelimit();
    if (limiter) {
      const { success, limit, remaining, reset } = await limiter.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests" },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
              "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
            },
          },
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // HN pages and API routes
    "/hn/:path*",
    "/api/hn/:path*",
    // All other API routes
    "/api/:path*",
  ],
};
