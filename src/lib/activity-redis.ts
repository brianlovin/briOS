import { Redis } from "@upstash/redis";

import { type ActivityEvent, type ActivityStore, type ActivityTotal } from "./activity";
import { visibleLifetimeTotals } from "./activity-shared";
import { ACTIVITY_STREAM_MAXLEN } from "./activity-shared";

const STREAM_KEY = "activity:stream";
const TOTALS_PREFIX = "activity:totals:";
const IDEMP_PREFIX = "activity:idemp:";
const VISIT_WINDOW_PREFIX = "activity:visit:window:";

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

function totalsKey(source: string, type: string): string {
  return `${TOTALS_PREFIX}${source}:${type}`;
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
      const result = await client.set(`${IDEMP_PREFIX}${key}`, "1", {
        nx: true,
        ex: ttlSeconds,
      });
      return result === "OK";
    },

    async incrementTotal(source: string, type: string, firstSeen: string): Promise<void> {
      const key = totalsKey(source, type);
      const pipeline = client.pipeline();
      pipeline.hincrby(key, "count", 1);
      pipeline.hsetnx(key, "first_seen", firstSeen);
      await pipeline.exec();
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

    async getTotals(): Promise<ActivityTotal[]> {
      const totals: ActivityTotal[] = [];
      let cursor = 0;

      do {
        const [nextCursor, keys] = await client.scan(cursor, {
          match: `${TOTALS_PREFIX}*`,
          count: 100,
        });
        cursor = Number(nextCursor);

        for (const key of keys) {
          const hash = await client.hgetall<Record<string, string>>(key);
          if (!hash) continue;
          const suffix = key.slice(TOTALS_PREFIX.length);
          const separator = suffix.indexOf(":");
          if (separator === -1) continue;
          const source = suffix.slice(0, separator);
          const type = suffix.slice(separator + 1);
          const count = Number(hash.count ?? 0);
          const firstSeen = hash.first_seen;
          if (!firstSeen || !Number.isFinite(count)) continue;
          totals.push({ source, type, count, first_seen: firstSeen });
        }
      } while (cursor !== 0);

      return totals.sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
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

export async function getActivityPageData(): Promise<{
  events: ActivityEvent[];
  totals: ActivityTotal[];
}> {
  const store = getActivityStore();
  if (!store) return { events: [], totals: [] };

  try {
    const [events, totals] = await Promise.all([store.getTail(100), store.getTotals()]);
    return { events, totals: visibleLifetimeTotals(totals) };
  } catch (error) {
    console.error("[activity] failed to read feed", error);
    return { events: [], totals: [] };
  }
}
