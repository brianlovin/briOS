import { Redis } from "@upstash/redis";

/**
 * Cheap fixed-window limiter for HN JSON APIs.
 *
 * The subscribers Redis (`UPSTASH_REDIS_REST_URL`) is PAYG and bills $0.20 per
 * 100K commands. `@upstash/ratelimit` with `analytics: true` wrote extra
 * ZINCRBY buckets (no TTL) on every `/hn` page, prefetch, and API hit — that
 * is what pushed this database toward an $84/mo projection. HTML/RSC pages
 * stay cached; only `/api/hn` is limited here (1 INCR, plus EXPIRE on first
 * hit in the window).
 */
export const HN_RATE_LIMIT = 100;
export const HN_RATE_LIMIT_WINDOW_SECONDS = 60;
export const HN_RATE_LIMIT_PREFIX = "rl:hn";
const HN_RATE_LIMIT_TIMEOUT_MS = 1000;

export type HnRateLimitRedis = {
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<unknown>;
};

export type HnRateLimitDecision =
  | { allowed: true }
  | {
      allowed: false;
      limit: number;
      remaining: number;
      reset: number;
    };

let redis: Redis | null | undefined;

export function getHnRateLimitRedis(): HnRateLimitRedis | null {
  if (redis !== undefined) return redis;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = null;
    return null;
  }

  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return redis;
  } catch (error) {
    console.error("[HN RateLimit] Failed to initialize Redis; failing open:", error);
    redis = null;
    return null;
  }
}

export function isPrefetchRequest(headers: Headers): boolean {
  const purpose = headers.get("purpose") ?? headers.get("sec-purpose");
  return headers.get("next-router-prefetch") === "1" || purpose === "prefetch";
}

/** Redis is only billed for real HN JSON API requests, not cached pages. */
export function shouldApplyHnRedisRateLimit(pathname: string, headers: Headers): boolean {
  if (isPrefetchRequest(headers)) return false;
  return pathname === "/api/hn" || /^\/api\/hn\/\d+$/.test(pathname);
}

export function hnRateLimitKey(ip: string, nowMs: number = Date.now()): string {
  const window = Math.floor(nowMs / (HN_RATE_LIMIT_WINDOW_SECONDS * 1000));
  return `${HN_RATE_LIMIT_PREFIX}:${ip}:${window}`;
}

export function hnRateLimitReset(nowMs: number = Date.now()): number {
  const window = Math.floor(nowMs / (HN_RATE_LIMIT_WINDOW_SECONDS * 1000));
  return (window + 1) * HN_RATE_LIMIT_WINDOW_SECONDS * 1000;
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("HN rate limit timed out")), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Apply the HN rate limit. Redis/limiter failures fail open so /hn stays up.
 */
export async function checkHnRateLimit(
  ip: string,
  client: HnRateLimitRedis | null = getHnRateLimitRedis(),
  nowMs: number = Date.now(),
): Promise<HnRateLimitDecision> {
  if (!client) return { allowed: true };

  const key = hnRateLimitKey(ip, nowMs);

  try {
    const count = await withTimeout(client.incr(key), HN_RATE_LIMIT_TIMEOUT_MS);
    if (count === 1) {
      await withTimeout(
        client.expire(key, HN_RATE_LIMIT_WINDOW_SECONDS * 2),
        HN_RATE_LIMIT_TIMEOUT_MS,
      );
    }

    if (count > HN_RATE_LIMIT) {
      return {
        allowed: false,
        limit: HN_RATE_LIMIT,
        remaining: 0,
        reset: hnRateLimitReset(nowMs),
      };
    }

    return { allowed: true };
  } catch (error) {
    // incr/expire throw when Redis is down or suspended (budget limit); fail open.
    console.error("[HN RateLimit] Error checking rate limit; failing open:", error);
    return { allowed: true };
  }
}
