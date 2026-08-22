import { NextRequest, NextResponse } from "next/server";

import {
  appendVaryAccept,
  isMarkdownNegotiablePath,
  isNextInternalRequest,
  markdownRewritePath,
  notAcceptableBody,
  preferredType,
} from "@/lib/accept-markdown";
import { checkHnRateLimit, shouldApplyHnRedisRateLimit } from "@/lib/hn-ratelimit";

function getIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function rewriteToMarkdown(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = markdownRewritePath(pathname);
  const rewritten = NextResponse.rewrite(url);
  appendVaryAccept(rewritten.headers);
  return rewritten;
}

function notAcceptable(): Response {
  return new Response(notAcceptableBody(), {
    status: 406,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      Vary: "Accept",
    },
  });
}

async function handleHnGuards(request: NextRequest): Promise<Response | null> {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/hn") && !pathname.startsWith("/api/hn")) {
    return null;
  }

  const idMatch = pathname.match(/^\/(?:api\/)?hn\/(\d+)$/);
  if (pathname !== "/hn" && pathname !== "/api/hn" && !idMatch) {
    return NextResponse.json({ error: "Invalid HN post ID" }, { status: 400 });
  }

  const ip = getIP(request);
  if (ip === "unknown") return null;

  if (!shouldApplyHnRedisRateLimit(pathname, request.headers)) {
    return null;
  }

  const decision = await checkHnRateLimit(ip);
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

  return null;
}

export async function middleware(request: NextRequest) {
  const hnGuard = await handleHnGuards(request);
  if (hnGuard) return hnGuard;

  const { pathname } = request.nextUrl;

  if (isNextInternalRequest(request.headers) || !isMarkdownNegotiablePath(pathname)) {
    return NextResponse.next();
  }

  if (pathname.endsWith(".md")) {
    return rewriteToMarkdown(request, pathname);
  }

  const acceptHeader = request.headers.get("accept");
  const chosen = preferredType(acceptHeader);

  if (chosen === "text/markdown") {
    return rewriteToMarkdown(request, pathname);
  }

  if (chosen === null && acceptHeader) {
    return notAcceptable();
  }

  const res = NextResponse.next();
  appendVaryAccept(res.headers);
  return res;
}

export const config = {
  matcher: [
    // Public pages (markdown negotiation). Excludes Next internals and /api/*
    // except HN JSON, which still needs ID validation + rate limits.
    "/((?!api/|_next/|_vercel/|monitoring).*)",
    "/api/hn/:path*",
  ],
};
