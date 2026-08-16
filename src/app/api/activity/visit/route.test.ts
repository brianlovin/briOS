import { describe, expect, test } from "bun:test";

import { POST as visitPost } from "@/app/api/activity/visit/route";

function jsonRequest(body: unknown, origin?: string): Request {
  return new Request("https://brianlovin.com/api/activity/visit", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(origin ? { origin } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/activity/visit", () => {
  test("does not accept a client-supplied source", async () => {
    const res = await visitPost(
      jsonRequest({ path: "/", source: "tax-ui" }, "https://tax-ui.brianlovin.com"),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid body" });
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  test("does not set CORS headers", async () => {
    const res = await visitPost(
      jsonRequest({ path: "/", source: "tax-ui" }, "https://staff.design"),
    );
    expect(res.status).toBe(400);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeNull();
    expect(res.headers.get("Access-Control-Allow-Methods")).toBeNull();
  });
});
