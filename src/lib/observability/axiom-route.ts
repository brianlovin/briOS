import { AsyncLocalStorage } from "node:async_hooks";

import { after, type NextRequest } from "next/server";

import { flushEvents, isAxiomEnabled, toErrorMessage, track } from "@/lib/axiom";

type RouteKind = "api" | "cron" | "webhook";

interface WithAxiomOptions {
  /** Route pattern, e.g. `/api/likes/[id]`. Also the cron job / webhook name. */
  name: string;
  kind?: RouteKind;
  /** Only emit on failure, for per-pageview beacons that would otherwise be noise. */
  quiet?: boolean;
}

const annotations = new AsyncLocalStorage<Record<string, unknown>>();
const expectedRejections = new WeakSet<Record<string, unknown>>();

/** Attach fields to the current route's summary event (api.request / cron / webhook). */
export function annotate(fields: Record<string, unknown>): void {
  const store = annotations.getStore();
  if (store) Object.assign(store, fields);
}

/**
 * Mark this request's 4xx as intended (e.g. a bot block) so it does not emit a
 * failed `api.request`. Track a dedicated event with the reason instead.
 */
export function markExpectedRejection(): void {
  const store = annotations.getStore();
  if (store) expectedRejections.add(store);
}

/**
 * Hand a flush to `after()` so it survives the response. Outside a request
 * scope (unit tests, scripts) `after` throws, so flush inline instead.
 */
export async function scheduleFlush(): Promise<void> {
  if (!isAxiomEnabled()) return;
  try {
    after(flushEvents);
  } catch {
    await flushEvents();
  }
}

async function responseError(response: Response): Promise<string | undefined> {
  if (response.status < 400) return undefined;
  if (!response.headers.get("content-type")?.includes("application/json")) {
    return `HTTP ${response.status}`;
  }
  try {
    const body = (await response.clone().json()) as { error?: unknown };
    return typeof body.error === "string" ? body.error : `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

/**
 * Read routes (GET api requests) only emit on failure so page loads don't
 * flood the dataset. Mutations, crons, and webhooks always emit.
 */
function shouldEmit(kind: RouteKind, method: string, status: number, quiet: boolean): boolean {
  if (quiet) return status >= 400;
  if (kind !== "api") return true;
  if (method !== "GET" && method !== "HEAD") return true;
  return status >= 400;
}

function requestFrom(args: unknown[]): Request | undefined {
  const first = args[0];
  return first instanceof Request ? first : undefined;
}

/**
 * Wrap a route handler: tracks `api.request` / `cron.completed` /
 * `webhook.received` with route, method, status, duration_ms and error, and
 * guarantees an Axiom flush before the serverless function exits.
 *
 * Only reads `request.method` and `nextUrl.pathname`, which Next does not
 * treat as dynamic, so prerendered GET handlers stay static.
 */
export function withAxiom<Args extends unknown[], R extends Response>(
  handler: (...args: Args) => Promise<R> | R,
  { name, kind = "api", quiet = false }: WithAxiomOptions,
): (...args: Args) => Promise<R> {
  return async (...args: Args): Promise<R> => {
    const fields: Record<string, unknown> = {};
    const start = performance.now();
    let response: R | undefined;
    let thrown: unknown;

    try {
      response = await annotations.run(fields, () => handler(...args));
      return response;
    } catch (error) {
      thrown = error;
      throw error;
    } finally {
      if (isAxiomEnabled()) {
        const request = requestFrom(args);
        const method = request?.method ?? "GET";
        const status = response?.status ?? 500;

        const expected = expectedRejections.has(fields) && status >= 400 && status < 500;

        if (!expected && shouldEmit(kind, method, status, quiet)) {
          const error =
            thrown !== undefined
              ? toErrorMessage(thrown)
              : response
                ? await responseError(response)
                : undefined;
          const outcome = {
            ...fields,
            route: name,
            path: (request as NextRequest | undefined)?.nextUrl?.pathname ?? name,
            method,
            status,
            duration_ms: Math.round(performance.now() - start),
            ...(error && { error }),
          };

          if (kind === "cron") {
            track("cron.completed", { ...outcome, job: name });
          } else if (kind === "webhook") {
            track("webhook.received", { ...outcome, webhook: name });
          } else {
            track("api.request", outcome);
          }
        }

        await scheduleFlush();
      }
    }
  };
}
