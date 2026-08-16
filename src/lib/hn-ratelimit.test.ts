import { describe, expect, test } from "bun:test";

import {
  checkHnRateLimit,
  HN_RATE_LIMIT,
  hnRateLimitKey,
  hnRateLimitReset,
  isPrefetchRequest,
  shouldApplyHnRedisRateLimit,
} from "@/lib/hn-ratelimit";

describe("isPrefetchRequest", () => {
  test("detects Next.js and Purpose prefetch headers", () => {
    expect(isPrefetchRequest(new Headers({ "next-router-prefetch": "1" }))).toBe(true);
    expect(isPrefetchRequest(new Headers({ purpose: "prefetch" }))).toBe(true);
    expect(isPrefetchRequest(new Headers({ "sec-purpose": "prefetch" }))).toBe(true);
    expect(isPrefetchRequest(new Headers())).toBe(false);
    expect(isPrefetchRequest(new Headers({ rsc: "1" }))).toBe(false);
  });
});

describe("shouldApplyHnRedisRateLimit", () => {
  const empty = new Headers();
  const prefetch = new Headers({ "next-router-prefetch": "1" });

  test("limits only real HN JSON API requests", () => {
    expect(shouldApplyHnRedisRateLimit("/api/hn", empty)).toBe(true);
    expect(shouldApplyHnRedisRateLimit("/api/hn/123", empty)).toBe(true);
  });

  test("skips cached pages, digest routes, and prefetch", () => {
    expect(shouldApplyHnRedisRateLimit("/hn", empty)).toBe(false);
    expect(shouldApplyHnRedisRateLimit("/hn/123", empty)).toBe(false);
    expect(shouldApplyHnRedisRateLimit("/api/hn-digest/subscribe", empty)).toBe(false);
    expect(shouldApplyHnRedisRateLimit("/api/hn", prefetch)).toBe(false);
    expect(shouldApplyHnRedisRateLimit("/api/hn/123", prefetch)).toBe(false);
  });
});

describe("checkHnRateLimit", () => {
  const nowMs = 1_700_000_000_000;

  test("allows the request when no Redis is configured", async () => {
    await expect(checkHnRateLimit("1.1.1.1", null, nowMs)).resolves.toEqual({ allowed: true });
  });

  test("increments a fixed-window key and expires it on first hit", async () => {
    const calls: string[] = [];
    const decision = await checkHnRateLimit(
      "1.1.1.1",
      {
        incr: async (key) => {
          calls.push(`incr:${key}`);
          return 1;
        },
        expire: async (key, seconds) => {
          calls.push(`expire:${key}:${seconds}`);
        },
      },
      nowMs,
    );

    expect(decision).toEqual({ allowed: true });
    expect(calls).toEqual([
      `incr:${hnRateLimitKey("1.1.1.1", nowMs)}`,
      `expire:${hnRateLimitKey("1.1.1.1", nowMs)}:120`,
    ]);
  });

  test("does not expire again after the first hit in the window", async () => {
    let expired = false;
    const decision = await checkHnRateLimit(
      "1.1.1.1",
      {
        incr: async () => 2,
        expire: async () => {
          expired = true;
        },
      },
      nowMs,
    );

    expect(decision).toEqual({ allowed: true });
    expect(expired).toBe(false);
  });

  test("blocks the request when the window is exhausted", async () => {
    const decision = await checkHnRateLimit(
      "1.1.1.1",
      {
        incr: async () => HN_RATE_LIMIT + 1,
        expire: async () => {},
      },
      nowMs,
    );

    expect(decision).toEqual({
      allowed: false,
      limit: HN_RATE_LIMIT,
      remaining: 0,
      reset: hnRateLimitReset(nowMs),
    });
  });

  test("fails open when Redis throws", async () => {
    const originalError = console.error;
    console.error = () => {};
    try {
      await expect(
        checkHnRateLimit("1.1.1.1", {
          incr: async () => {
            throw new Error(
              "ERR This database has been suspended for exceeding the defined budget limit. Please increase budget or switch to a Fixed plan on Upstash Console",
            );
          },
          expire: async () => {},
        }),
      ).resolves.toEqual({ allowed: true });
    } finally {
      console.error = originalError;
    }
  });
});
