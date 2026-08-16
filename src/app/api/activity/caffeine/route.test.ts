import { afterEach, describe, expect, test } from "bun:test";

import { handleCaffeinePost } from "@/app/api/activity/caffeine/route";
import { createMemoryActivityStore } from "@/lib/activity";

const TEST_TOKEN = "test-caffeine-token";

const originalToken = process.env.ACTIVITY_CAFFEINE_TOKEN;

afterEach(() => {
  if (originalToken === undefined) {
    delete process.env.ACTIVITY_CAFFEINE_TOKEN;
  } else {
    process.env.ACTIVITY_CAFFEINE_TOKEN = originalToken;
  }
});

function request(init: {
  token?: string | null;
  header?: "bearer" | "x-activity-token";
  body?: unknown;
}) {
  const headers = new Headers({ "content-type": "application/json" });
  if (init.token) {
    if (init.header === "x-activity-token") {
      headers.set("x-activity-token", init.token);
    } else {
      headers.set("authorization", `Bearer ${init.token}`);
    }
  }

  return new Request("https://brianlovin.com/api/activity/caffeine", {
    method: "POST",
    headers,
    body:
      init.body === undefined ? JSON.stringify({ drink: "cortado" }) : JSON.stringify(init.body),
  });
}

describe("POST /api/activity/caffeine", () => {
  test("returns 503 when ACTIVITY_CAFFEINE_TOKEN is missing", async () => {
    delete process.env.ACTIVITY_CAFFEINE_TOKEN;
    const res = await handleCaffeinePost(
      request({ token: TEST_TOKEN }),
      createMemoryActivityStore(),
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "Caffeine ingest is not configured" });
  });

  test("returns 401 when the token is missing or wrong", async () => {
    process.env.ACTIVITY_CAFFEINE_TOKEN = TEST_TOKEN;

    const missing = await handleCaffeinePost(request({}), createMemoryActivityStore());
    expect(missing.status).toBe(401);

    const wrong = await handleCaffeinePost(request({ token: "nope" }), createMemoryActivityStore());
    expect(wrong.status).toBe(401);
    expect(await wrong.json()).toEqual({ error: "Unauthorized" });
  });

  test("accepts Authorization Bearer or x-activity-token and records the drink", async () => {
    process.env.ACTIVITY_CAFFEINE_TOKEN = TEST_TOKEN;
    const store = createMemoryActivityStore();

    const bearer = await handleCaffeinePost(request({ token: TEST_TOKEN }), store);
    expect(bearer.status).toBe(200);
    expect(await bearer.json()).toEqual({ ok: true });

    const header = await handleCaffeinePost(
      request({
        token: TEST_TOKEN,
        header: "x-activity-token",
        body: { drink: "celsius", extra: "ignore" },
      }),
      store,
    );
    expect(header.status).toBe(200);
    expect(await header.json()).toEqual({ ok: true });

    const events = await store.getTail(10);
    expect(events).toHaveLength(2);
    expect(events.map((event) => event.summary).sort()).toEqual([
      "Caffeinated with Celsius",
      "Caffeinated with Cortado",
    ]);
    expect(events.every((event) => event.meta && Object.keys(event.meta).join() === "drink")).toBe(
      true,
    );
    expect(JSON.stringify(events)).not.toContain("@");
    expect(JSON.stringify(events)).not.toContain("email");
  });

  test("returns 200 without writing when the store is missing", async () => {
    process.env.ACTIVITY_CAFFEINE_TOKEN = TEST_TOKEN;
    const res = await handleCaffeinePost(request({ token: TEST_TOKEN }), null);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  test("returns 200 when ingest throws so Redis failures fail open", async () => {
    process.env.ACTIVITY_CAFFEINE_TOKEN = TEST_TOKEN;
    const originalError = console.error;
    console.error = () => {};
    try {
      const res = await handleCaffeinePost(request({ token: TEST_TOKEN }), {
        claimIdempotency: async () => {
          throw new Error("redis down");
        },
        incrementCount: async () => {},
        addToStream: async () => {},
        getTail: async () => [],
        getCount: async () => 0,
        getStreamLength: async () => 0,
        incrementVisitWindow: async () => 0,
      });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
    } finally {
      console.error = originalError;
    }
  });
});
