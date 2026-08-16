import * as Sentry from "@sentry/nextjs";
import { NextRequest } from "next/server";

let initialized = false;

export function initSentry() {
  if (initialized) return;
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return; // disabled locally

  // No need to initialize Sentry here as it's already initialized by Next.js
  // Just set our custom configuration
  Sentry.setTag("environment", process.env.VERCEL_ENV || process.env.NODE_ENV || "local");
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    Sentry.setTag("release", process.env.VERCEL_GIT_COMMIT_SHA);
  }
  initialized = true;
}

export function captureError(err: unknown, tags?: Record<string, string>) {
  if (!initialized) initSentry();
  if (tags) {
    Sentry.captureException(err, { tags });
  } else {
    Sentry.captureException(err);
  }
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
