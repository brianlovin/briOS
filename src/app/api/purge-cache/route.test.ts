import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";

import { GET, POST } from "@/app/api/purge-cache/route";
import * as activityFromNotion from "@/lib/activity-from-notion";
import * as activitySchedule from "@/lib/activity-schedule";
import * as purge from "@/lib/notion/purge";

const TEST_SECRET = "unit-test-purge-secret";

function purgeRequest(method: "GET" | "POST", type: string, body?: unknown): Request {
  const url = `http://localhost/api/purge-cache?secret=${TEST_SECRET}&type=${type}`;
  return new Request(url, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe("/api/purge-cache", () => {
  const previousSecret = process.env.CACHE_PURGE_SECRET;

  beforeEach(() => {
    process.env.CACHE_PURGE_SECRET = TEST_SECRET;
  });

  afterEach(() => {
    if (previousSecret === undefined) {
      delete process.env.CACHE_PURGE_SECRET;
    } else {
      process.env.CACHE_PURGE_SECRET = previousSecret;
    }
  });

  test("GET accepts type=hn", async () => {
    const purgeType = spyOn(purge, "purgeContentType").mockResolvedValue(3);

    const res = await GET(purgeRequest("GET", "hn"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      success: true,
      type: "hn",
      purged: { hn: 3 },
    });
    expect(purgeType).toHaveBeenCalledTimes(1);
    expect(purgeType).toHaveBeenCalledWith("hn");
  });

  test("type=all includes hn", async () => {
    const purgeType = spyOn(purge, "purgeContentType").mockResolvedValue(1);

    const res = await GET(purgeRequest("GET", "all"));
    expect(res.status).toBe(200);
    const types = purgeType.mock.calls.map((call) => call[0]);
    expect(types).toContain("hn");
    expect(types).toEqual([...purge.PURGEABLE_CONTENT_TYPES]);
  });

  test("POST type=hn does not ingest a Notion activity event", async () => {
    spyOn(purge, "purgeContentType").mockResolvedValue(1);
    const after = spyOn(activitySchedule, "afterActivity");
    const ingest = spyOn(activityFromNotion, "ingestActivityFromContentPurge");

    const res = await POST(purgeRequest("POST", "hn", { data: { id: "notion-page-id" } }));
    expect(res.status).toBe(200);
    expect(after).not.toHaveBeenCalled();
    expect(ingest).not.toHaveBeenCalled();
  });

  test("POST type=writing still schedules Notion activity ingest", async () => {
    spyOn(purge, "purgeContentType").mockResolvedValue(1);
    const after = spyOn(activitySchedule, "afterActivity");

    const res = await POST(purgeRequest("POST", "writing", { data: { id: "notion-page-id" } }));
    expect(res.status).toBe(200);
    expect(after).toHaveBeenCalledTimes(1);
  });
});
