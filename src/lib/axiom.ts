import { Axiom } from "@axiomhq/js";

import type { ClientEventEnvelope, ClientEventFieldMap } from "@/lib/client-events";
import type { RequestContextFields } from "@/lib/request-context";

const DATASET = process.env.AXIOM_DATASET ?? "brios";

let axiom: Axiom | null | undefined;

/** Lazily-created singleton; null when AXIOM_TOKEN is unset (local dev, tests). */
function getAxiom(): Axiom | null {
  if (axiom !== undefined) return axiom;
  const token = process.env.AXIOM_TOKEN;
  axiom = token
    ? new Axiom({
        token,
        orgId: process.env.AXIOM_ORG_ID,
        onError: (error) => console.error("[axiom] ingest failed", error),
      })
    : null;
  return axiom;
}

export function isAxiomEnabled(): boolean {
  return getAxiom() !== null;
}

/** Drop the cached client so tests can toggle AXIOM_TOKEN. */
export function resetAxiomForTests(): void {
  axiom = undefined;
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

// ---------------------------------------------------------------------------
// Event type map — compile-time safety for every track() call.
// ---------------------------------------------------------------------------

interface RouteOutcomeFields {
  route: string;
  method: string;
  status: number;
  duration_ms: number;
  error?: string;
  [annotation: string]: unknown;
}

type ClientEvents = {
  [E in keyof ClientEventFieldMap]: ClientEventFieldMap[E] &
    ClientEventEnvelope &
    RequestContextFields & { source: "client" };
};

type LikeItemFields = {
  item_id: string;
  item_type?: string;
  item_title?: string;
  item_href?: string;
};

export interface EventFieldMap extends ClientEvents {
  // --- route wrapper (withAxiom) ---
  "api.request": RouteOutcomeFields;
  "cron.completed": RouteOutcomeFields & { job: string };
  "webhook.received": RouteOutcomeFields & { webhook: string };
  /** Next.js onRequestError: pages, server components, route handlers, actions. */
  "request.error": {
    path: string;
    method: string;
    route_path: string;
    route_type: string;
    render_source?: string;
    error: string;
    digest?: string;
  };

  // --- HN digest ---
  "hn.subscribed": { email: string; source: "web" } & RequestContextFields;
  "hn.subscribe_rejected": {
    reason: "invalid_email" | "already_subscribed" | "store_error";
    email?: string;
  } & RequestContextFields;
  "hn.unsubscribed": {
    email: string;
    source: "email_link";
    user_agent?: string;
    is_bot: boolean;
  };
  "hn.unsubscribe_failed": {
    reason: "invalid_token" | "not_found" | "missing_token";
    email?: string;
    source: "email_link";
    user_agent?: string;
    is_bot: boolean;
  };
  "hn.digest.run": {
    total_subscribers: number;
    sent: number;
    failed: number;
    post_count: number;
    duration_ms: number;
    status: "success" | "partial" | "failed" | "no_posts" | "error";
    error?: string;
  };
  "hn.digest.send_failed": {
    email: string;
    postmark_error_code?: number;
    postmark_message: string;
    http_status?: number;
  };
  "hn.digest.batch": TrackStepFieldMap["hn.digest.batch"] & StepOutcomeFields;
  "hn.rate_limited": {
    path: string;
    limit: number;
    country?: string;
  };
  "hn_cli.telemetry_received": {
    event_count: number;
    event_names: string[];
    version?: string;
  };

  // --- likes ---
  "like.added": LikeItemFields & { count: number; user_likes: number } & RequestContextFields;
  "like.removed": LikeItemFields & { count: number; user_likes: number } & RequestContextFields;
  "like.rejected": LikeItemFields & {
    action: "add" | "remove";
    reason: "rate_limited" | "max_likes" | "no_likes";
  } & RequestContextFields;
  "likes.synced": { synced: number; failed: number; total: number };

  // --- AMA ---
  "ama.question_asked": {
    question_id: string;
    title_length: number;
    has_description: boolean;
  } & RequestContextFields;
  "ama.question_rejected": { reason: "validation" } & RequestContextFields;

  // --- Notion content operations ---
  "cache.purged": {
    type: string;
    trigger: "notion" | "manual";
    page_id?: string;
    keys_purged: number;
  };
  "journal.illustrated": {
    page_id: string;
    processed: number;
    skipped: number;
    failed: number;
    remaining: number;
  } & StepOutcomeFields;

  // --- activity feed producers ---
  "activity.ingested": {
    producer: "hmac" | "github" | "caffeine";
    source?: string;
    type?: string;
    duplicate?: boolean;
  };

  // --- catch-all logger events (warn + error only) ---
  log: {
    level: "warn" | "error";
    message: string;
    [key: string]: unknown;
  };
}

interface StepOutcomeFields {
  status: "success" | "error";
  duration_ms: number;
  error?: string;
}

/** Fields the caller provides to trackStep(); status/duration_ms/error are auto-added. */
export interface TrackStepFieldMap {
  "hn.digest.batch": { batch_offset: number; batch_size: number };
}

// ---------------------------------------------------------------------------
// track()
// ---------------------------------------------------------------------------

function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

type PlatformRequestContext = { get?: () => { waitUntil?: (promise: Promise<unknown>) => void } };

let backgroundFlushQueued = false;

/**
 * Events tracked outside withAxiom (server components, "use cache" bodies,
 * libs) still need to reach Axiom before the function freezes. Vercel exposes
 * waitUntil on the request context, the same hook @vercel/functions uses.
 */
function queueBackgroundFlush(): void {
  if (backgroundFlushQueued) return;
  backgroundFlushQueued = true;
  queueMicrotask(() => {
    backgroundFlushQueued = false;
    const context = (globalThis as Record<symbol, PlatformRequestContext | undefined>)[
      Symbol.for("@next/request-context")
    ];
    context?.get?.()?.waitUntil?.(flushEvents());
  });
}

export function track<E extends keyof EventFieldMap>(event: E, data: EventFieldMap[E]): void {
  const client = getAxiom();
  if (!client || isBuildPhase()) return;

  queueBackgroundFlush();
  client.ingest(DATASET, [
    {
      ...data,
      _time: new Date().toISOString(),
      event,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
      deployment: process.env.VERCEL_GIT_COMMIT_SHA,
    },
  ]);
}

// ---------------------------------------------------------------------------
// trackStep() — wraps an async operation with timing + success/error.
// ---------------------------------------------------------------------------

export async function trackStep<E extends keyof TrackStepFieldMap, T>(
  event: E,
  data: TrackStepFieldMap[E],
  fn: () => Promise<T>,
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    track(event, {
      ...data,
      status: "success",
      duration_ms: Math.round(performance.now() - start),
    });
    return result;
  } catch (error) {
    track(event, {
      ...data,
      status: "error",
      duration_ms: Math.round(performance.now() - start),
      error: toErrorMessage(error),
    });
    throw error;
  }
}

/**
 * Flush pending events. Serverless functions can freeze as soon as the
 * response is sent, so every handler must flush (see withAxiom).
 */
export async function flushEvents(): Promise<void> {
  try {
    await getAxiom()?.flush();
  } catch (error) {
    console.error("[axiom] flush failed", error);
  }
}
