import { describe, expect, test } from "bun:test";

import { checkHnRateLimit, waitForRateLimitPending } from "@/lib/hn-ratelimit";

describe("checkHnRateLimit", () => {
  test("allows the request when no limiter is configured", async () => {
    await expect(checkHnRateLimit("1.1.1.1", null)).resolves.toEqual({ allowed: true });
  });

  test("allows the request when the limiter succeeds", async () => {
    const pending = Promise.resolve();
    const decision = await checkHnRateLimit("1.1.1.1", {
      limit: async () => ({
        success: true,
        pending,
        limit: 100,
        remaining: 99,
        reset: 1,
      }),
    });

    expect(decision).toEqual({ allowed: true, pending });
  });

  test("blocks the request when the limiter denies it", async () => {
    const pending = Promise.resolve();
    const decision = await checkHnRateLimit("1.1.1.1", {
      limit: async () => ({
        success: false,
        pending,
        limit: 100,
        remaining: 0,
        reset: 42,
      }),
    });

    expect(decision).toEqual({
      allowed: false,
      pending,
      limit: 100,
      remaining: 0,
      reset: 42,
    });
  });

  test("fails open when the limiter throws", async () => {
    const originalError = console.error;
    console.error = () => {};
    try {
      await expect(
        checkHnRateLimit("1.1.1.1", {
          limit: async () => {
            throw new Error(
              "ERR This database has been suspended for exceeding the defined budget limit. Please increase budget or switch to a Fixed plan on Upstash Console",
            );
          },
        }),
      ).resolves.toEqual({ allowed: true });
    } finally {
      console.error = originalError;
    }
  });
});

describe("waitForRateLimitPending", () => {
  test("does nothing without a pending promise or waitUntil", () => {
    expect(() => waitForRateLimitPending(undefined, Promise.resolve())).not.toThrow();
    expect(() => waitForRateLimitPending({}, Promise.resolve())).not.toThrow();
    expect(() => waitForRateLimitPending({ waitUntil: () => {} }, undefined)).not.toThrow();
  });

  test("passes a rejection-safe pending promise to waitUntil", async () => {
    const originalError = console.error;
    console.error = () => {};
    try {
      const pending = Promise.reject(new Error("analytics failed"));
      const waited: Promise<unknown>[] = [];

      waitForRateLimitPending(
        {
          waitUntil: (promise) => {
            waited.push(promise);
          },
        },
        pending,
      );

      expect(waited).toHaveLength(1);
      await expect(waited[0]).resolves.toBeUndefined();
    } finally {
      console.error = originalError;
    }
  });
});
