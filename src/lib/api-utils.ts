import { NextResponse } from "next/server";

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
