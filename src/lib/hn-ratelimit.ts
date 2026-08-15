import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type HnRateLimitLimiter = {
  limit: (identifier: string) => Promise<{
    success: boolean;
    pending?: Promise<unknown>;
    limit: number;
    remaining: number;
    reset: number;
  }>;
};

export type HnRateLimitDecision =
  | { allowed: true; pending?: Promise<unknown> }
  | {
      allowed: false;
      pending?: Promise<unknown>;
      limit: number;
      remaining: number;
      reset: number;
    };

export type WaitUntilEvent = {
  waitUntil?: (promise: Promise<unknown>) => void;
};

// Lazy-initialize to avoid build-time env var errors
let hnRatelimit: Ratelimit | null = null;

export function getHnRatelimit(): HnRateLimitLimiter | null {
  if (hnRatelimit) return hnRatelimit;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  try {
    hnRatelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      // 100 requests per 60 seconds per IP for HN routes
      limiter: Ratelimit.slidingWindow(100, "60 s"),
      prefix: "rl:hn",
      analytics: true,
      // Fail open if Redis is slow so middleware cannot time out /hn
      timeout: 1000,
    });
    return hnRatelimit;
  } catch (error) {
    console.error("[HN RateLimit] Failed to initialize limiter; failing open:", error);
    return null;
  }
}

/**
 * Apply the HN rate limit. Redis/limiter failures fail open so /hn stays up.
 */
export async function checkHnRateLimit(
  ip: string,
  limiter: HnRateLimitLimiter | null = getHnRatelimit(),
): Promise<HnRateLimitDecision> {
  if (!limiter) return { allowed: true };

  try {
    const result = await limiter.limit(ip);
    if (result.success) {
      return { allowed: true, pending: result.pending };
    }

    return {
      allowed: false,
      pending: result.pending,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error("[HN RateLimit] Error checking rate limit; failing open:", error);
    return { allowed: true };
  }
}

/**
 * Keep analytics (`pending`) alive in Edge/serverless without letting a
 * rejection crash the middleware invocation.
 */
export function waitForRateLimitPending(
  event: WaitUntilEvent | undefined,
  pending: Promise<unknown> | undefined,
): void {
  if (!pending || typeof event?.waitUntil !== "function") return;

  event.waitUntil(
    pending.catch((error: unknown) => {
      console.error("[HN RateLimit] Analytics failed:", error);
    }),
  );
}
