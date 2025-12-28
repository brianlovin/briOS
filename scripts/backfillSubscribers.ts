import { Redis } from "@upstash/redis";
import * as fs from "fs";
import * as path from "path";

/**
 * Backfill HN subscribers from PlanetScale SQL dump to Upstash Redis
 *
 * Usage: bun run scripts/backfillSubscribers.ts
 *
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars
 */

const HN_SUBSCRIBERS_KEY = "hn:subscribers";

async function main() {
  // Check for env vars
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN env vars");
    console.error("Add them to .env.local or export them in your shell");
    process.exit(1);
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Read the SQL dump
  const dumpPath = path.join(
    process.env.HOME || "",
    "Documents/planetscale-backup/brianlovin_backup.sql",
  );

  if (!fs.existsSync(dumpPath)) {
    console.error(`SQL dump not found at: ${dumpPath}`);
    process.exit(1);
  }

  console.log(`Reading SQL dump from: ${dumpPath}`);
  const sqlContent = fs.readFileSync(dumpPath, "utf-8");

  // Find the INSERT statement for EmailSubscription
  const insertMatch = sqlContent.match(
    /INSERT INTO `EmailSubscription` VALUES \(([^;]+)\);/,
  );

  if (!insertMatch) {
    console.error("Could not find EmailSubscription INSERT statement in dump");
    process.exit(1);
  }

  // Parse emails from the VALUES clause
  // Format: ('email1','HACKER_NEWS'),('email2','HACKER_NEWS'),...
  const valuesStr = insertMatch[1];
  const emails: string[] = [];

  // Match each ('email','HACKER_NEWS') pair and extract email
  const emailRegex = /\('([^']+)','HACKER_NEWS'\)/g;
  let match;
  while ((match = emailRegex.exec(valuesStr)) !== null) {
    emails.push(match[1]);
  }

  console.log(`Found ${emails.length} HN subscribers to import`);

  if (emails.length === 0) {
    console.error("No emails found to import");
    process.exit(1);
  }

  // Check current count
  const currentCount = await redis.scard(HN_SUBSCRIBERS_KEY);
  console.log(`Current subscribers in Redis: ${currentCount}`);

  // Add all emails using pipeline for efficiency
  console.log("Importing subscribers...");
  const pipeline = redis.pipeline();
  for (const email of emails) {
    pipeline.sadd(HN_SUBSCRIBERS_KEY, email);
  }
  await pipeline.exec();

  // Verify
  const newCount = await redis.scard(HN_SUBSCRIBERS_KEY);
  console.log(`\n✅ Import complete!`);
  console.log(`Subscribers after import: ${newCount}`);
  console.log(`New subscribers added: ${newCount - currentCount}`);

  // List a few samples
  const sample = await redis.srandmember(HN_SUBSCRIBERS_KEY, 5);
  console.log(`\nSample subscribers:`, sample);
}

main().catch(console.error);
