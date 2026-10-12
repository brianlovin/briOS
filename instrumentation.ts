import * as Sentry from "@sentry/nextjs";
import type { Instrumentation } from "next";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  Sentry.captureRequestError(error, request, context);

  const { flushEvents, toErrorMessage, track } = await import("@/lib/axiom");
  track("request.error", {
    path: request.path.split("?")[0],
    method: request.method,
    route_path: context.routePath,
    route_type: context.routeType,
    render_source: "renderSource" in context ? context.renderSource : undefined,
    error: toErrorMessage(error),
    digest: (error as { digest?: string }).digest,
  });
  await flushEvents();
};
