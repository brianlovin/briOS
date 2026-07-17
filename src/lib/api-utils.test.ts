import { describe, expect, test } from "bun:test";

import { cachedResponse, errorResponse, withErrorHandling } from "@/lib/api-utils";

describe("errorResponse", () => {
  test("uses a 500 status by default and wraps the message", async () => {
    const res = errorResponse("boom");
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "boom" });
  });

  test("honors a custom status code", () => {
    expect(errorResponse("not found", 404).status).toBe(404);
  });

  test("includes details when provided", async () => {
    const res = errorResponse("bad", 400, { field: "email" });
    expect(await res.json()).toEqual({ error: "bad", details: { field: "email" } });
  });

  test("omits details when undefined", async () => {
    const body = await errorResponse("bad", 400).json();
    expect(body).not.toHaveProperty("details");
  });

  test("includes falsy details such as null", async () => {
    const body = await errorResponse("bad", 400, null).json();
    expect(body).toEqual({ error: "bad", details: null });
  });
});

describe("cachedResponse", () => {
  test("serializes data and sets a default cache header", async () => {
    const res = cachedResponse({ hello: "world" });
    expect(await res.json()).toEqual({ hello: "world" });
    expect(res.headers.get("Cache-Control")).toBe(
      "public, s-maxage=86400, stale-while-revalidate=86400",
    );
  });

  test("honors a custom cache time", () => {
    const res = cachedResponse([1, 2, 3], 60);
    expect(res.headers.get("Cache-Control")).toBe("public, s-maxage=60, stale-while-revalidate=60");
  });
});

describe("withErrorHandling", () => {
  test("returns the handler result as JSON on success", async () => {
    const res = await withErrorHandling(async () => ({ ok: true }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  test("returns a 500 error response when the handler throws", async () => {
    const originalError = console.error;
    console.error = () => {};
    try {
      const res = await withErrorHandling(async () => {
        throw new Error("kaboom");
      }, "custom failure");
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: "custom failure" });
    } finally {
      console.error = originalError;
    }
  });
});
