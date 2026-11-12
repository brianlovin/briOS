import { describe, expect, test } from "bun:test";

import { AMA_RATE_LIMIT, checkAmaRateLimit, getClientIp } from "./ama-ratelimit";

function fakeRedis() {
  const counts = new Map<string, number>();
  const expires: string[] = [];
  return {
    expires,
    incr: async (key: string) => {
      const next = (counts.get(key) ?? 0) + 1;
      counts.set(key, next);
      return next;
    },
    expire: async (key: string) => {
      expires.push(key);
      return 1;
    },
  };
}

const NOW = Date.UTC(2026, 10, 11, 22, 49);

describe("checkAmaRateLimit", () => {
  test("allows a handful of questions per IP, then blocks", async () => {
    const redis = fakeRedis();
    for (let i = 0; i < AMA_RATE_LIMIT; i++) {
      expect(await checkAmaRateLimit("1.2.3.4", redis, NOW)).toBe(true);
    }
    expect(await checkAmaRateLimit("1.2.3.4", redis, NOW)).toBe(false);
    expect(redis.expires).toHaveLength(1);
  });

  test("counts each IP separately", async () => {
    const redis = fakeRedis();
    for (let i = 0; i < AMA_RATE_LIMIT; i++) await checkAmaRateLimit("1.2.3.4", redis, NOW);
    expect(await checkAmaRateLimit("5.6.7.8", redis, NOW)).toBe(true);
  });

  test("resets in the next window", async () => {
    const redis = fakeRedis();
    for (let i = 0; i <= AMA_RATE_LIMIT; i++) await checkAmaRateLimit("1.2.3.4", redis, NOW);
    expect(await checkAmaRateLimit("1.2.3.4", redis, NOW + 60 * 60 * 1000)).toBe(true);
  });

  test("fails open without Redis, an IP, or when Redis errors", async () => {
    expect(await checkAmaRateLimit("1.2.3.4", null, NOW)).toBe(true);
    expect(await checkAmaRateLimit(null, fakeRedis(), NOW)).toBe(true);
    const broken = {
      incr: async () => {
        throw new Error("down");
      },
      expire: async () => 1,
    };
    expect(await checkAmaRateLimit("1.2.3.4", broken, NOW)).toBe(true);
  });
});

describe("getClientIp", () => {
  test("uses the first forwarded address", () => {
    const headers = new Headers({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" });
    expect(getClientIp(headers)).toBe("9.9.9.9");
  });

  test("falls back to x-real-ip, then null", () => {
    expect(getClientIp(new Headers({ "x-real-ip": "8.8.8.8" }))).toBe("8.8.8.8");
    expect(getClientIp(new Headers())).toBeNull();
  });
});
