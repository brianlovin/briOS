import { createHash } from "crypto";

let cachedSalt: string | null = null;

function getHashSalt(): string {
  if (cachedSalt) return cachedSalt;

  const salt = process.env.LIKES_HASH_SALT;
  if (!salt && process.env.NODE_ENV === "production") {
    throw new Error("LIKES_HASH_SALT environment variable must be set in production");
  }
  cachedSalt = salt || "default-likes-salt-dev";
  return cachedSalt;
}

/**
 * Create anonymous user ID from IP address
 * Uses SHA-256 with salt for privacy
 */
export function hashUserIp(ip: string): string {
  return createHash("sha256").update(`${getHashSalt()}:${ip}`).digest("hex").substring(0, 16);
}

/**
 * Client IP as set by Vercel's edge.
 *
 * Vercel overwrites `x-real-ip` and `x-forwarded-for` with the connecting
 * client's address, so a visitor cannot choose them. `cf-connecting-ip` is not
 * read: without Cloudflare in front, a client can send any value there and get
 * a fresh like identity and rate-limit bucket on every request.
 */
function clientIpFrom(headers: { get: (name: string) => string | null }): string {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first;

  return "unknown";
}

/** Extract client IP from request headers (see `clientIpFrom`). */
export function getClientIp(request: Request): string {
  return clientIpFrom(request.headers);
}

/** Extract client IP from a Next.js headers() object, for server components. */
export function getClientIpFromHeaders(headers: { get: (name: string) => string | null }): string {
  return clientIpFrom(headers);
}
