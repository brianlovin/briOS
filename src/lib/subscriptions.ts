import { Redis } from "@upstash/redis";

/**
 * Email subscription management using Upstash Redis
 */

// Environment validation
if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error("UPSTASH_REDIS_REST_URL environment variable is not set");
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("UPSTASH_REDIS_REST_TOKEN environment variable is not set");
}

// Create singleton Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Redis key for HN subscribers set
const HN_SUBSCRIBERS_KEY = "hn:subscribers";

/** Canonical form used for storage and lookups. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Whether this exact (normalized) address is already subscribed. */
export async function isSubscribed(email: string): Promise<boolean> {
  return (await redis.sismember(HN_SUBSCRIBERS_KEY, email)) === 1;
}

const CONFIRMATION_COOLDOWN_SECONDS = 60 * 60;

/**
 * Reserve the right to send one confirmation email to this address per hour,
 * so the signup form cannot be used to flood someone's inbox.
 */
export async function claimConfirmationSend(email: string): Promise<boolean> {
  const result = await redis.set(`hn:confirm-sent:${email}`, "1", {
    nx: true,
    ex: CONFIRMATION_COOLDOWN_SECONDS,
  });
  return result === "OK";
}

/**
 * Fetch all email subscribers for Hacker News digest
 */
export async function getHNSubscribers(): Promise<string[]> {
  return await redis.smembers(HN_SUBSCRIBERS_KEY);
}

/**
 * Delete a subscription by email
 */
export async function deleteSubscription(email: string): Promise<boolean> {
  const removed = await redis.srem(HN_SUBSCRIBERS_KEY, email);
  return removed > 0;
}

/**
 * Create a new subscription
 */
export async function createSubscription(
  email: string,
): Promise<{ success: boolean; alreadyExists: boolean }> {
  const added = await redis.sadd(HN_SUBSCRIBERS_KEY, email);
  if (added === 0) {
    return { success: false, alreadyExists: true };
  }
  return { success: true, alreadyExists: false };
}
