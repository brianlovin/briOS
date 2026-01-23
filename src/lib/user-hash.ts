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
 * Extract client IP from request headers
 * Handles Vercel/Cloudflare proxies
 */
export function getClientIp(request: Request): string {
  // Cloudflare
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  // Vercel / standard proxies
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  // Fallback
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

/**
 * Extract client IP from Next.js headers() object
 * For use in server components
 */
export function getClientIpFromHeaders(headers: { get: (name: string) => string | null }): string {
  // Cloudflare
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  // Vercel / standard proxies
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  // Fallback
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}
