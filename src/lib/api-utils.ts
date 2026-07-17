import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

/**
 * Parse `cursor` and `limit` pagination query params from a request URL.
 */
export function parsePaginationParams(
  request: Request,
  defaultLimit: number = 20,
): { cursor: string | undefined; limit: number } {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") || undefined;
  const limit = parseInt(searchParams.get("limit") || String(defaultLimit), 10);
  return { cursor, limit };
}

/**
 * Constant-time comparison of two secret strings.
 *
 * Hashing both inputs to a fixed length first avoids leaking the secret's
 * length and prevents `timingSafeEqual` from throwing on length mismatch,
 * while still comparing in constant time. Returns false when either value
 * is missing so callers can treat absent secrets as unauthorized.
 */
export function safeCompare(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  const aHash = createHash("sha256").update(a).digest();
  const bHash = createHash("sha256").update(b).digest();
  return timingSafeEqual(aHash, bHash);
}

/**
 * Standard error response format for API routes
 */
export function errorResponse(
  message: string,
  status: number = 500,
  details?: unknown,
): NextResponse {
  const response: { error: string; details?: unknown } = { error: message };
  if (details !== undefined) {
    response.details = details;
  }
  return NextResponse.json(response, { status });
}

/**
 * Helper to create response with cache headers
 */
export function cachedResponse<T>(
  data: T,
  cacheTime: number = 86400, // 24 hours default
): NextResponse {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": `public, s-maxage=${cacheTime}, stale-while-revalidate=${cacheTime}`,
    },
  });
}

/**
 * Wrapper for API route handlers with standardized error handling
 */
export async function withErrorHandling<T>(
  handler: () => Promise<T>,
  errorMessage: string = "Internal server error",
): Promise<NextResponse> {
  try {
    const result = await handler();
    return NextResponse.json(result);
  } catch (error) {
    console.error(errorMessage, error);
    return errorResponse(errorMessage, 500);
  }
}
