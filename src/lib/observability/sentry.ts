import * as Sentry from "@sentry/nextjs";
import { NextRequest } from "next/server";

export function captureError(err: unknown, tags?: Record<string, string>) {
  Sentry.captureException(err, tags ? { tags } : undefined);
}

export function withErrorCapture<
  T extends (req: NextRequest, ...rest: unknown[]) => Promise<Response>,
>(handler: T): (req: NextRequest, ...rest: unknown[]) => Promise<Response> {
  return async (req: NextRequest, ...rest: unknown[]) => {
    try {
      return await handler(req, ...rest);
    } catch (err) {
      // Only capture unhandled errors in Sentry
      // Let route handlers handle their own validation errors
      if (err instanceof Error && err.name === "SyntaxError") {
        // JSON parse errors should be handled by the route
        throw err;
      }

      // Capture other unhandled errors in Sentry
      Sentry.captureException(err);

      // Return our custom error response for unhandled errors
      return new Response("Internal Server Error", { status: 500 });
    }
  };
}
