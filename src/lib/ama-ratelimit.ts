import { getHnRateLimitRedis, type HnRateLimitRedis } from "@/lib/hn-ratelimit";
import { logger } from "@/lib/logger";

/**
 * Fixed-window limit on anonymous AMA submissions, per IP. Real people ask a
 * question or two; scanners and spam scripts submit dozens. Shares the HN
 * limiter's Redis (one INCR per submission, EXPIRE on the first).
 */
export const AMA_RATE_LIMIT = 5;
export const AMA_RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
const AMA_RATE_LIMIT_PREFIX = "rl:ama";
const AMA_RATE_LIMIT_TIMEOUT_MS = 1000;

export function amaRateLimitKey(ip: string, nowMs: number = Date.now()): string {
  const window = Math.floor(nowMs / (AMA_RATE_LIMIT_WINDOW_SECONDS * 1000));
  return `${AMA_RATE_LIMIT_PREFIX}:${ip}:${window}`;
}

/**
 * Vercel overwrites x-forwarded-for / x-real-ip with the real client address.
 * Headers Vercel passes through untouched (e.g. cf-connecting-ip) are
 * client-controlled and would let a script rotate its way past the limit.
 */
export function getClientIp(headers: Headers): string | null {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || null;
}

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("AMA rate limit timed out")), ms).unref?.();
  });
}

/**
 * Returns true when the IP may submit. Fails open when Redis is missing or
 * erroring so the form keeps working during an outage.
 */
export async function checkAmaRateLimit(
  ip: string | null,
  client: HnRateLimitRedis | null = getHnRateLimitRedis(),
  nowMs: number = Date.now(),
): Promise<boolean> {
  if (!client || !ip) return true;

  const key = amaRateLimitKey(ip, nowMs);
  try {
    const count = await Promise.race([client.incr(key), timeout(AMA_RATE_LIMIT_TIMEOUT_MS)]);
    if (count === 1) {
      await Promise.race([
        client.expire(key, AMA_RATE_LIMIT_WINDOW_SECONDS * 2),
        timeout(AMA_RATE_LIMIT_TIMEOUT_MS),
      ]);
    }
    return count <= AMA_RATE_LIMIT;
  } catch (error) {
    logger.error("[AMA RateLimit] Error checking rate limit; failing open", error);
    return true;
  }
}
