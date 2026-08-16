import { describe, expect, test } from "bun:test";

import {
  OPTIONS as downloadOptions,
  POST as downloadPost,
} from "@/app/api/activity/download/route";
import { OPTIONS as visitOptions, POST as visitPost } from "@/app/api/activity/visit/route";

function jsonRequest(url: string, body: unknown, origin?: string): Request {
  return new Request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(origin ? { origin } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/activity/visit", () => {
  test("rejects an unknown source with 400 and CORS", async () => {
    const res = await visitPost(
      jsonRequest(
        "https://brianlovin.com/api/activity/visit",
        { path: "/", source: "evil" },
        "https://staff.design",
      ),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Unknown source" });
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://staff.design");
  });

  test("preflight allows an allowlisted origin", () => {
    const res = visitOptions(
      new Request("https://brianlovin.com/api/activity/visit", {
        method: "OPTIONS",
        headers: { origin: "https://designdetails.fm" },
      }),
    );
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://designdetails.fm");
    expect(res.headers.get("Access-Control-Allow-Methods")).toBe("POST, OPTIONS");
  });
});

describe("POST /api/activity/download", () => {
  test("rejects an unknown source with 400", async () => {
    const res = await downloadPost(
      jsonRequest("https://brianlovin.com/api/activity/download", { source: "brios" }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Unknown source" });
  });

  test("preflight does not grant CORS to an unknown origin", () => {
    const res = downloadOptions(
      new Request("https://brianlovin.com/api/activity/download", {
        method: "OPTIONS",
        headers: { origin: "https://evil.example" },
      }),
    );
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });
});
