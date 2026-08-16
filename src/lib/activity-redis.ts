import { Redis } from "@upstash/redis";

import {
  type ActivityEvent,
  type ActivityFeedPayload,
  type ActivityStore,
  buildActivityFeed,
} from "./activity";
import { ACTIVITY_STREAM_MAXLEN } from "./activity-shared";

const STREAM_KEY = "activity:stream";
export const ACTIVITY_COUNT_KEY = "activity:count";
export const LEGACY_TOTALS_PREFIX = "activity:totals:";
const IDEMP_PREFIX = "activity:idemp:";
const VISIT_WINDOW_PREFIX = "activity:visit:window:";

const SEED_SCAN_COUNT = 100;
const SEED_DELETE_BATCH = 100;

export type ActivityRedisSource = "activity" | "likes";

let redis: Redis | null = null;
let redisSource: ActivityRedisSource | null = null;
let redisStore: ActivityStore | null = null;

function createClient(url: string, token: string): Redis {
  return new Redis({ url, token });
}

export function getActivityRedisSource(): ActivityRedisSource | null {
  if (redisSource) return redisSource;
  if (process.env.UPSTASH_ACTIVITY_REST_URL && process.env.UPSTASH_ACTIVITY_REST_TOKEN) {
    return "activity";
  }
  if (process.env.UPSTASH_LIKES_REST_URL && process.env.UPSTASH_LIKES_REST_TOKEN) {
    return "likes";
  }
  return null;
}

export function getActivityRedis(): Redis | null {
  if (redis) return redis;

  if (process.env.UPSTASH_ACTIVITY_REST_URL && process.env.UPSTASH_ACTIVITY_REST_TOKEN) {
    redis = createClient(
      process.env.UPSTASH_ACTIVITY_REST_URL,
      process.env.UPSTASH_ACTIVITY_REST_TOKEN,
    );
    redisSource = "activity";
    return redis;
  }

  // Dedicated activity pair is unset. Reuse likes — never the HN rate-limit DB
  // (UPSTASH_REDIS_REST_URL) and never FLUSHDB. All keys are prefixed activity:.
  if (process.env.UPSTASH_LIKES_REST_URL && process.env.UPSTASH_LIKES_REST_TOKEN) {
    redis = createClient(process.env.UPSTASH_LIKES_REST_URL, process.env.UPSTASH_LIKES_REST_TOKEN);
    redisSource = "likes";
    return redis;
  }

  return null;
}

export type ActivityCountClient = {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: number, opts: { nx: true }) => Promise<unknown>;
  incr: (key: string) => Promise<number>;
  scan: (
    cursor: number,
    opts: { match: string; count: number },
  ) => Promise<[string | number, string[]]>;
  hget: (key: string, field: string) => Promise<unknown>;
  xlen: (key: string) => Promise<number | null>;
  del: (...keys: string[]) => Promise<unknown>;
};

function parseCount(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function scanLegacyTotalsKeys(client: ActivityCountClient): Promise<string[]> {
  const keys: string[] = [];
  let cursor = 0;

  do {
    const [nextCursor, batch] = await client.scan(cursor, {
      match: `${LEGACY_TOTALS_PREFIX}*`,
      count: SEED_SCAN_COUNT,
    });
    cursor = Number(nextCursor);
    for (const key of batch) {
      if (key.startsWith(LEGACY_TOTALS_PREFIX)) keys.push(key);
    }
  } while (cursor !== 0);

  return keys;
}

async function deleteLegacyTotalsKeys(client: ActivityCountClient, keys: string[]): Promise<void> {
  for (let i = 0; i < keys.length; i += SEED_DELETE_BATCH) {
    const batch = keys.slice(i, i + SEED_DELETE_BATCH);
    if (batch.length > 0) await client.del(...batch);
  }
}

export async function readLegacyCountSeed(
  client: ActivityCountClient,
): Promise<{ seed: number; keys: string[] }> {
  const keys = await scanLegacyTotalsKeys(client);
  if (keys.length === 0) {
    return { seed: (await client.xlen(STREAM_KEY)) ?? 0, keys };
  }

  let seed = 0;
  for (const key of keys) {
    const n = parseCount(await client.hget(key, "count"));
    if (n !== null) seed += n;
  }
  return { seed, keys };
}

export async function ensureActivityCount(client: ActivityCountClient): Promise<number> {
  const existing = parseCount(await client.get(ACTIVITY_COUNT_KEY));
  if (existing !== null) return existing;

  const { seed, keys } = await readLegacyCountSeed(client);
  const created = await client.set(ACTIVITY_COUNT_KEY, seed, { nx: true });
  if (created === "OK" && keys.length > 0) {
    await deleteLegacyTotalsKeys(client, keys);
  }

  return parseCount(await client.get(ACTIVITY_COUNT_KEY)) ?? seed;
}

export async function incrementActivityCount(client: ActivityCountClient): Promise<void> {
  await ensureActivityCount(client);
  await client.incr(ACTIVITY_COUNT_KEY);
}

export function parseActivityStreamFields(value: unknown): ActivityEvent | null {
  if (!value) return null;

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as ActivityEvent;
    } catch {
      return null;
    }
  }

  if (typeof value !== "object") return null;

  const raw = value as Record<string, unknown>;
  if ("e" in raw) {
    const encoded = raw.e;
    if (typeof encoded === "string") {
      try {
        return JSON.parse(encoded) as ActivityEvent;
      } catch {
        return null;
      }
    }
    if (encoded && typeof encoded === "object" && "id" in encoded && "summary" in encoded) {
      return encoded as ActivityEvent;
    }
  }

  if ("id" in raw && "summary" in raw) {
    return raw as ActivityEvent;
  }

  return null;
}

function parseXrevrange(result: unknown): ActivityEvent[] {
  if (!result) return [];

  if (Array.isArray(result)) {
    const events: ActivityEvent[] = [];
    for (const entry of result) {
      if (Array.isArray(entry) && entry.length >= 2) {
        const parsed = parseActivityStreamFields(entry[1]);
        if (parsed) events.push(parsed);
        continue;
      }
      if (entry && typeof entry === "object") {
        const parsed = parseActivityStreamFields(entry);
        if (parsed) events.push(parsed);
      }
    }
    return events;
  }

  if (typeof result === "object") {
    const events: ActivityEvent[] = [];
    for (const fields of Object.values(result as Record<string, unknown>)) {
      const parsed = parseActivityStreamFields(fields);
      if (parsed) events.push(parsed);
    }
    return events;
  }

  return [];
}

export function createRedisActivityStore(client: Redis): ActivityStore {
  return {
    async claimIdempotency(key: string, ttlSeconds: number): Promise<boolean> {
      const result =
        ttlSeconds > 0
          ? await client.set(`${IDEMP_PREFIX}${key}`, "1", {
              nx: true,
              ex: ttlSeconds,
            })
          : await client.set(`${IDEMP_PREFIX}${key}`, "1", { nx: true });
      return result === "OK";
    },

    async incrementCount(): Promise<void> {
      await incrementActivityCount(client);
    },

    async addToStream(event: ActivityEvent): Promise<void> {
      await client.xadd(
        STREAM_KEY,
        "*",
        { e: JSON.stringify(event) },
        {
          trim: {
            type: "MAXLEN",
            threshold: ACTIVITY_STREAM_MAXLEN,
            comparison: "~",
          },
        },
      );
    },

    async getTail(limit: number): Promise<ActivityEvent[]> {
      const result = await client.xrevrange(STREAM_KEY, "+", "-", limit);
      return parseXrevrange(result).filter((event) => event.visibility === "public");
    },

    async getCount(): Promise<number> {
      return ensureActivityCount(client);
    },

    async getStreamLength(): Promise<number> {
      return (await client.xlen(STREAM_KEY)) ?? 0;
    },

    async incrementVisitWindow(windowKey: string, ttlSeconds: number): Promise<number> {
      const key = `${VISIT_WINDOW_PREFIX}${windowKey}`;
      const count = await client.incr(key);
      if (count === 1) {
        await client.expire(key, ttlSeconds);
      }
      return count;
    },
  };
}

export function getActivityStore(): ActivityStore | null {
  if (redisStore) return redisStore;
  const client = getActivityRedis();
  if (!client) return null;
  redisStore = createRedisActivityStore(client);
  return redisStore;
}

export async function getActivityPageData(): Promise<ActivityFeedPayload> {
  try {
    return await buildActivityFeed(getActivityStore());
  } catch (error) {
    console.error("[activity] failed to read feed", error);
    return { events: [], count: 0 };
  }
}
