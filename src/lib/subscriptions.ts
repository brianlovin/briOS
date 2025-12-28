import { Redis } from "@upstash/redis";

/**
 * Email subscription management using Upstash Redis
 */

// TypeScript interface for subscription rows (keeping interface for compatibility)
export interface EmailSubscriptionRow {
  email: string;
  type: string;
}

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

/**
 * Fetch all email subscribers for Hacker News digest
 */
export async function getHNSubscribers(): Promise<EmailSubscriptionRow[]> {
  const emails = await redis.smembers(HN_SUBSCRIBERS_KEY);
  return emails.map((email) => ({ email, type: "HACKER_NEWS" }));
}

/**
 * Fetch a single subscriber by email
 */
export async function getSubscriberByEmail(email: string): Promise<EmailSubscriptionRow | null> {
  const exists = await redis.sismember(HN_SUBSCRIBERS_KEY, email);
  return exists ? { email, type: "HACKER_NEWS" } : null;
}

/**
 * Delete a subscription by email
 */
export async function deleteSubscription(email: string): Promise<boolean> {
  const removed = await redis.srem(HN_SUBSCRIBERS_KEY, email);
  return removed > 0;
}

/**
 * Get count of HN subscribers
 */
export async function getHNSubscriberCount(): Promise<number> {
  return await redis.scard(HN_SUBSCRIBERS_KEY);
}

/**
 * Create a new subscription
 */
export async function createSubscription(
  email: string,
): Promise<{ success: boolean; alreadyExists: boolean }> {
  // Check if subscription already exists
  const exists = await redis.sismember(HN_SUBSCRIBERS_KEY, email);
  if (exists) {
    return { success: false, alreadyExists: true };
  }

  // Add to subscribers set
  await redis.sadd(HN_SUBSCRIBERS_KEY, email);
  return { success: true, alreadyExists: false };
}

/**
 * Bulk add subscribers (for backfill)
 */
export async function bulkAddSubscribers(emails: string[]): Promise<number> {
  if (emails.length === 0) return 0;
  // Use pipeline for bulk operations
  const pipeline = redis.pipeline();
  for (const email of emails) {
    pipeline.sadd(HN_SUBSCRIBERS_KEY, email);
  }
  await pipeline.exec();
  return emails.length;
}
