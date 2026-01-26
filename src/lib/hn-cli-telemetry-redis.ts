import { Redis } from "@upstash/redis";

// Telemetry event structure from CLI
export interface TelemetryEvent {
  event: string;
  timestamp: number;
  properties?: Record<string, unknown>;
}

let redis: Redis | null = null;

function getTelemetryRedis(): Redis | null {
  if (redis) return redis;

  if (
    !process.env.UPSTASH_HN_CLI_TELEMETRY_REST_URL ||
    !process.env.UPSTASH_HN_CLI_TELEMETRY_REST_TOKEN
  ) {
    return null;
  }

  redis = new Redis({
    url: process.env.UPSTASH_HN_CLI_TELEMETRY_REST_URL,
    token: process.env.UPSTASH_HN_CLI_TELEMETRY_REST_TOKEN,
  });

  return redis;
}

// Key prefixes
const USERS_KEY = "hn-cli:users";
const EVENTS_PREFIX = "hn-cli:events:";
const COUNTS_PREFIX = "hn-cli:counts:";

/**
 * Get today's date string in YYYY-MM-DD format
 */
function getDateString(timestamp?: number): string {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toISOString().split("T")[0];
}

/**
 * Track a unique user
 */
export async function trackUser(userId: string): Promise<void> {
  const client = getTelemetryRedis();
  if (!client) return;

  try {
    await client.sadd(USERS_KEY, userId);
  } catch (error) {
    console.error("[HN-CLI Telemetry] Error tracking user:", error);
  }
}

/**
 * Store a batch of events from a user
 */
export async function storeEvents(
  userId: string,
  events: TelemetryEvent[],
  version?: string,
): Promise<void> {
  const client = getTelemetryRedis();
  if (!client || events.length === 0) return;

  try {
    const pipeline = client.pipeline();

    for (const event of events) {
      const dateStr = getDateString(event.timestamp);

      // Store the full event in a list for that day
      const eventData = JSON.stringify({
        userId,
        version,
        event: event.event,
        timestamp: event.timestamp,
        properties: event.properties,
      });
      pipeline.rpush(`${EVENTS_PREFIX}${dateStr}`, eventData);

      // Increment the count for this event type on this day
      pipeline.incr(`${COUNTS_PREFIX}${event.event}:${dateStr}`);
    }

    await pipeline.exec();
  } catch (error) {
    console.error("[HN-CLI Telemetry] Error storing events:", error);
  }
}

/**
 * Get unique user count
 */
export async function getUniqueUserCount(): Promise<number> {
  const client = getTelemetryRedis();
  if (!client) return 0;

  try {
    return await client.scard(USERS_KEY);
  } catch (error) {
    console.error("[HN-CLI Telemetry] Error getting user count:", error);
    return 0;
  }
}

/**
 * Get event counts for a specific event type over the last N days
 */
export async function getEventCounts(
  eventType: string,
  days: number = 7,
): Promise<Record<string, number>> {
  const client = getTelemetryRedis();
  const counts: Record<string, number> = {};

  if (!client) return counts;

  try {
    const keys: string[] = [];
    const dates: string[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = getDateString(date.getTime());
      dates.push(dateStr);
      keys.push(`${COUNTS_PREFIX}${eventType}:${dateStr}`);
    }

    const values = await client.mget<(number | null)[]>(...keys);

    dates.forEach((dateStr, index) => {
      counts[dateStr] = values[index] ?? 0;
    });

    return counts;
  } catch (error) {
    console.error("[HN-CLI Telemetry] Error getting event counts:", error);
    return counts;
  }
}
