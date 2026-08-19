import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";

import { POST } from "@/app/api/webhooks/capture-site-preview/route";
import * as activitySchedule from "@/lib/activity-schedule";
import * as optimize from "@/lib/image-processing/optimize";
import { notion } from "@/lib/notion";
import * as purge from "@/lib/notion/purge";
import * as r2 from "@/lib/r2/storage";
import * as screenshot from "@/lib/screenshot";

const TEST_SECRET = "unit-test-webhook-secret";

function webhookRequest(payload: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/webhooks/capture-site-preview", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-webhook-secret": TEST_SECRET,
      ...headers,
    },
    body: JSON.stringify(payload),
  });
}

const notionPayload = {
  data: {
    id: "page-123",
    properties: {
      URL: { url: "https://example.com" },
    },
  },
};

function notionPage(status?: string) {
  return {
    properties: {
      Name: { title: [{ plain_text: "Example" }] },
      "Preview Status": status ? { select: { name: status } } : { select: null },
    },
  };
}

describe("POST /api/webhooks/capture-site-preview", () => {
  const previousSecret = process.env.NOTION_WEBHOOK_VERIFICATION_SECRET;
  let retrieve: ReturnType<typeof spyOn>;
  let update: ReturnType<typeof spyOn>;
  let capture: ReturnType<typeof spyOn>;
  let upload: ReturnType<typeof spyOn>;
  let purgeType: ReturnType<typeof spyOn>;
  let scheduleActivity: ReturnType<typeof spyOn>;

  beforeEach(() => {
    process.env.NOTION_WEBHOOK_VERIFICATION_SECRET = TEST_SECRET;

    retrieve = spyOn(notion.pages, "retrieve").mockResolvedValue(notionPage("Queued") as never);
    update = spyOn(notion.pages, "update").mockResolvedValue({} as never);
    capture = spyOn(screenshot, "captureLightAndDarkScreenshots").mockResolvedValue({
      light: Buffer.from("light-png"),
      dark: Buffer.from("dark-png"),
    });
    spyOn(optimize, "optimizeSitePreview").mockImplementation(async (buffer) => ({
      buffer,
      format: "webp",
      contentType: "image/webp",
      width: 1,
      height: 1,
      originalSize: buffer.length,
      optimizedSize: buffer.length,
      savings: 0,
    }));

    let uploads = 0;
    upload = spyOn(r2, "uploadBufferToR2").mockImplementation(async () => {
      uploads += 1;
      return uploads === 1 ? "https://cdn.example/light" : "https://cdn.example/dark";
    });
    purgeType = spyOn(purge, "purgeContentType").mockResolvedValue(1);
    scheduleActivity = spyOn(activitySchedule, "afterActivity").mockImplementation(() => {});
  });

  afterEach(() => {
    mock.restore();
    if (previousSecret === undefined) {
      delete process.env.NOTION_WEBHOOK_VERIFICATION_SECRET;
    } else {
      process.env.NOTION_WEBHOOK_VERIFICATION_SECRET = previousSecret;
    }
  });

  test("writes Preview Image and Preview Image Dark URLs on success", async () => {
    const res = await POST(webhookRequest(notionPayload));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.previewUrl).toBe("https://cdn.example/light");
    expect(body.previewUrlDark).toBe("https://cdn.example/dark");

    expect(capture).toHaveBeenCalledWith("https://example.com");
    expect(upload).toHaveBeenCalledTimes(2);

    const doneUpdate = update.mock.calls.find(
      (call) =>
        (call[0] as { properties?: { "Preview Image"?: unknown } }).properties?.["Preview Image"],
    );
    expect(doneUpdate).toBeDefined();

    const properties = (doneUpdate?.[0] as { properties: Record<string, unknown> }).properties;
    expect(properties["Preview Image"]).toEqual({ url: "https://cdn.example/light" });
    expect(properties["Preview Image Dark"]).toEqual({ url: "https://cdn.example/dark" });
    expect(properties["Preview Status"]).toEqual({ select: { name: "Done" } });
    expect(properties["Preview Updated"]).toEqual({
      date: { start: expect.any(String) },
    });

    expect(purgeType).toHaveBeenCalledWith("sites");
    expect(scheduleActivity).toHaveBeenCalledTimes(1);
  });

  test("still writes both preview URLs when URL is a plain string", async () => {
    const res = await POST(
      webhookRequest({
        data: { id: "page-123", properties: { URL: "https://example.com" } },
      }),
    );
    expect(res.status).toBe(200);

    const doneUpdate = update.mock.calls.find(
      (call) =>
        (call[0] as { properties?: { "Preview Image"?: unknown } }).properties?.["Preview Image"],
    );
    const properties = (doneUpdate?.[0] as { properties: Record<string, unknown> }).properties;
    expect(properties["Preview Image"]).toEqual({ url: "https://cdn.example/light" });
    expect(properties["Preview Image Dark"]).toEqual({ url: "https://cdn.example/dark" });
  });

  test("writes Preview Status Error when capture fails", async () => {
    capture.mockRejectedValueOnce(new Error("tab crashed"));

    const res = await POST(webhookRequest(notionPayload));
    expect(res.status).toBe(500);

    const errorUpdate = update.mock.calls.find(
      (call) =>
        (call[0] as { properties?: { "Preview Status"?: { select?: { name?: string } } } })
          .properties?.["Preview Status"]?.select?.name === "Error",
    );
    expect(errorUpdate).toBeDefined();

    const properties = (errorUpdate?.[0] as { properties: Record<string, unknown> }).properties;
    expect(properties["Preview Status"]).toEqual({ select: { name: "Error" } });
    expect(properties["Preview Error"]).toEqual({
      rich_text: [{ text: { content: "tab crashed" } }],
    });
    expect(properties["Preview Image"]).toBeUndefined();
    expect(properties["Preview Image Dark"]).toBeUndefined();
    expect(purgeType).toHaveBeenCalledWith("sites");
    expect(scheduleActivity).not.toHaveBeenCalled();
  });

  test("returns 401 when the webhook secret does not match", async () => {
    const res = await POST(webhookRequest(notionPayload, { "x-webhook-secret": "wrong" }));
    expect(res.status).toBe(401);
    expect(retrieve).not.toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();
  });
});
