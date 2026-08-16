import { describe, expect, test } from "bun:test";

import {
  ACTIVITY_COUNT_KEY,
  type ActivityCountClient,
  ensureActivityCount,
  incrementActivityCount,
  LEGACY_TOTALS_PREFIX,
} from "@/lib/activity-redis";

function createFakeCountClient(init?: {
  count?: number;
  totals?: Record<string, number>;
  streamLength?: number;
  extraKeys?: string[];
}): ActivityCountClient & { keys: () => string[] } {
  const kv = new Map<string, string>();
  const hashes = new Map<string, Record<string, string>>();
  const extra = new Set(init?.extraKeys ?? []);
  const streamLength = init?.streamLength ?? 0;

  if (init?.count !== undefined) {
    kv.set(ACTIVITY_COUNT_KEY, String(init.count));
  }
  for (const [key, count] of Object.entries(init?.totals ?? {})) {
    hashes.set(key, { count: String(count), first_seen: "2026-08-16T00:00:00.000Z" });
  }

  return {
    keys() {
      return [...kv.keys(), ...hashes.keys(), ...extra];
    },
    async get(key: string) {
      return kv.has(key) ? kv.get(key)! : null;
    },
    async set(key: string, value: number, opts: { nx: true }) {
      if (opts.nx && kv.has(key)) return null;
      kv.set(key, String(value));
      return "OK";
    },
    async incr(key: string) {
      const next = Number(kv.get(key) ?? 0) + 1;
      kv.set(key, String(next));
      return next;
    },
    async scan(_cursor: number, opts: { match: string; count: number }) {
      const prefix = opts.match.endsWith("*") ? opts.match.slice(0, -1) : opts.match;
      const matched = [...hashes.keys(), ...kv.keys(), ...extra].filter((key) =>
        key.startsWith(prefix),
      );
      return [0, matched];
    },
    async hget(key: string, field: string) {
      return hashes.get(key)?.[field] ?? null;
    },
    async xlen() {
      return streamLength;
    },
    async del(...keys: string[]) {
      let removed = 0;
      for (const key of keys) {
        if (hashes.delete(key)) removed += 1;
        if (kv.delete(key)) removed += 1;
        if (extra.delete(key)) removed += 1;
      }
      return removed;
    },
  };
}

describe("activity count seed", () => {
  test("seeds from the sum of legacy totals hashes", async () => {
    const client = createFakeCountClient({
      totals: {
        [`${LEGACY_TOTALS_PREFIX}brios:like`]: 4,
        [`${LEGACY_TOTALS_PREFIX}brios:visit`]: 10,
      },
      streamLength: 3,
      extraKeys: ["activity:stream", "activity:idemp:k", "activity:visit:window:visit:1"],
    });

    expect(await ensureActivityCount(client)).toBe(14);
    expect(await client.get(ACTIVITY_COUNT_KEY)).toBe("14");
    expect(client.keys()).toEqual([
      ACTIVITY_COUNT_KEY,
      "activity:stream",
      "activity:idemp:k",
      "activity:visit:window:visit:1",
    ]);
  });

  test("seeds from stream length when no totals keys exist", async () => {
    const client = createFakeCountClient({ streamLength: 7 });
    expect(await ensureActivityCount(client)).toBe(7);
    expect(await client.get(ACTIVITY_COUNT_KEY)).toBe("7");
  });

  test("leaves an existing count key alone", async () => {
    const client = createFakeCountClient({
      count: 99,
      totals: { [`${LEGACY_TOTALS_PREFIX}brios:like`]: 4 },
      streamLength: 2,
    });

    expect(await ensureActivityCount(client)).toBe(99);
    expect(client.keys()).toContain(`${LEGACY_TOTALS_PREFIX}brios:like`);
  });

  test("increments after seeding so the first ingest is not lost", async () => {
    const client = createFakeCountClient({
      totals: { [`${LEGACY_TOTALS_PREFIX}github:pr_merged`]: 5 },
    });

    await incrementActivityCount(client);
    expect(await ensureActivityCount(client)).toBe(6);
  });
});
