import { describe, expect, test } from "bun:test";

import { clearHnCache, type HnCacheRedis } from "@/lib/hn-cache";

function createFakeHnRedis(init?: { keys?: string[] }): HnCacheRedis & { keys: () => string[] } {
  const store = new Set(init?.keys ?? []);

  return {
    keys() {
      return [...store];
    },
    async del(...keys: string[]) {
      let removed = 0;
      for (const key of keys) {
        if (store.delete(key)) removed += 1;
      }
      return removed;
    },
    async scan(_cursor: string, opts: { match: string; count: number }) {
      const prefix = opts.match.endsWith("*") ? opts.match.slice(0, -1) : opts.match;
      const matched = [...store].filter((key) => key.startsWith(prefix));
      return ["0", matched];
    },
  };
}

describe("clearHnCache", () => {
  test("returns 0 when Redis is not configured", async () => {
    await expect(clearHnCache(null)).resolves.toBe(0);
  });

  test("deletes the top-ids key and every hn:post:* key", async () => {
    const client = createFakeHnRedis({
      keys: ["hn:top_ids", "hn:post:1", "hn:post:2", "other:keep"],
    });

    await expect(clearHnCache(client)).resolves.toBe(3);
    expect(client.keys().sort()).toEqual(["other:keep"]);
  });

  test("still deletes scanned post keys when top-ids is already missing", async () => {
    const client = createFakeHnRedis({
      keys: ["hn:post:99"],
    });

    await expect(clearHnCache(client)).resolves.toBe(1);
    expect(client.keys()).toEqual([]);
  });
});
