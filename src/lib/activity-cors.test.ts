import { describe, expect, test } from "bun:test";
import { NextResponse } from "next/server";

import {
  ACTIVITY_PING_ORIGINS,
  activityPingCorsHeaders,
  activityPingJson,
  activityPingOptions,
  applyActivityPingCors,
  isActivityPingOrigin,
} from "@/lib/activity-cors";

describe("activity ping CORS allowlist", () => {
  test("allows only the documented cross-origin sites", () => {
    expect([...ACTIVITY_PING_ORIGINS]).toEqual([
      "https://tax-ui.brianlovin.com",
      "https://staff.design",
      "https://www.staff.design",
      "https://designdetails.fm",
      "https://www.designdetails.fm",
    ]);
    expect(isActivityPingOrigin("https://staff.design")).toBe(true);
    expect(isActivityPingOrigin("https://brianlovin.com")).toBe(false);
    expect(isActivityPingOrigin("https://evil.example")).toBe(false);
    expect(isActivityPingOrigin(null)).toBe(false);
  });

  test("returns ACAO for an allowed origin and nothing otherwise", () => {
    expect(activityPingCorsHeaders("https://designdetails.fm")).toEqual({
      "Access-Control-Allow-Origin": "https://designdetails.fm",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type",
    });
    expect(activityPingCorsHeaders("https://brianlovin.com")).toBeNull();
    expect(activityPingCorsHeaders(null)).toBeNull();
  });

  test("OPTIONS is 204 and only sets CORS for an allowlisted origin", () => {
    const allowed = activityPingOptions(
      new Request("https://brianlovin.com/api/activity/visit", {
        method: "OPTIONS",
        headers: { origin: "https://www.staff.design" },
      }),
    );
    expect(allowed.status).toBe(204);
    expect(allowed.headers.get("Access-Control-Allow-Origin")).toBe("https://www.staff.design");
    expect(allowed.headers.get("Access-Control-Allow-Methods")).toBe("POST, OPTIONS");
    expect(allowed.headers.get("Access-Control-Allow-Headers")).toBe("content-type");
    expect(allowed.headers.get("Access-Control-Allow-Credentials")).toBeNull();

    const blocked = activityPingOptions(
      new Request("https://brianlovin.com/api/activity/visit", {
        method: "OPTIONS",
        headers: { origin: "https://evil.example" },
      }),
    );
    expect(blocked.status).toBe(204);
    expect(blocked.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  test("applies CORS to JSON and existing NextResponses", async () => {
    const request = new Request("https://brianlovin.com/api/activity/download", {
      method: "POST",
      headers: { origin: "https://tax-ui.brianlovin.com" },
    });
    const json = activityPingJson(request, { ok: true, skipped: true });
    expect(json.headers.get("Access-Control-Allow-Origin")).toBe("https://tax-ui.brianlovin.com");
    expect(await json.json()).toEqual({ ok: true, skipped: true });

    const wrapped = applyActivityPingCors(
      request,
      NextResponse.json({ error: "Unknown source" }, { status: 400 }),
    );
    expect(wrapped.status).toBe(400);
    expect(wrapped.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://tax-ui.brianlovin.com",
    );
  });
});
