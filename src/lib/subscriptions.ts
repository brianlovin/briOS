import { connect } from "@planetscale/database";

/**
 * Email subscription database management
 */

// TypeScript interface for subscription rows
export interface EmailSubscriptionRow {
  email: string;
  type: string;
}

// Environment validation
if (!process.env.DATABASE_HOST) {
  throw new Error("DATABASE_HOST environment variable is not set");
}

if (!process.env.DATABASE_USERNAME) {
  throw new Error("DATABASE_USERNAME environment variable is not set");
}

if (!process.env.DATABASE_PASSWORD) {
  throw new Error("DATABASE_PASSWORD environment variable is not set");
}

// Create singleton PlanetScale database connection
const db = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

// Constant for HN subscription type
const HN_TYPE = "HACKER_NEWS";

/**
 * Fetch all email subscribers for Hacker News digest
 */
export async function getHNSubscribers(): Promise<EmailSubscriptionRow[]> {
  const result = await db.execute(`SELECT * FROM EmailSubscription WHERE type = ?`, [HN_TYPE]);
  return result.rows as EmailSubscriptionRow[];
}

/**
 * Fetch a single subscriber by email
 */
export async function getSubscriberByEmail(email: string): Promise<EmailSubscriptionRow | null> {
  const result = await db.execute(
    `SELECT * FROM EmailSubscription WHERE email = ? AND type = ? LIMIT 1`,
    [email, HN_TYPE],
  );
  return (result.rows[0] as EmailSubscriptionRow) || null;
}

/**
 * Delete a subscription by email
 */
export async function deleteSubscription(email: string): Promise<boolean> {
  const result = await db.execute(`DELETE FROM EmailSubscription WHERE email = ? AND type = ?`, [
    email,
    HN_TYPE,
  ]);
  return result.rowsAffected > 0;
}

/**
 * Get count of HN subscribers
 */
export async function getHNSubscriberCount(): Promise<number> {
  const result = await db.execute(
    `SELECT COUNT(*) as count FROM EmailSubscription WHERE type = ?`,
    [HN_TYPE],
  );
  const row = result.rows[0] as { count: number };
  return row.count;
}

/**
 * Create a new subscription
 */
export async function createSubscription(
  email: string,
): Promise<{ success: boolean; alreadyExists: boolean }> {
  // Check if subscription already exists
  const existing = await getSubscriberByEmail(email);
  if (existing) {
    return { success: false, alreadyExists: true };
  }

  // Insert new subscription
  await db.execute(`INSERT INTO EmailSubscription (email, type) VALUES (?, ?)`, [email, HN_TYPE]);

  return { success: true, alreadyExists: false };
}
