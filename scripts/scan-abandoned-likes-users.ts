/**
 * Dry-run: list leftover `likes:users:*` keys.
 * Does not delete. Historical membership sets were abandoned in the S07 likes model.
 *
 * Usage: bun scripts/scan-abandoned-likes-users.ts
 */
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_LIKES_REST_URL;
const token = process.env.UPSTASH_LIKES_REST_TOKEN;

if (!url || !token) {
  console.error("UPSTASH_LIKES_REST_URL and UPSTASH_LIKES_REST_TOKEN are required.");
  process.exit(1);
}

const redis = new Redis({ url, token });
const pattern = "likes:users:*";
const keys: string[] = [];
let cursor = 0;

do {
  const [nextCursor, batch] = await redis.scan(cursor, { match: pattern, count: 100 });
  cursor = Number(nextCursor);
  keys.push(...batch);
} while (cursor !== 0);

console.log(`Found ${keys.length} abandoned ${pattern} key(s).`);
for (const key of keys) {
  console.log(key);
}
