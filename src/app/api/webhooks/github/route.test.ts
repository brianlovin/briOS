import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";
import { createHmac } from "crypto";

import { POST } from "@/app/api/webhooks/github/route";
import { createMemoryActivityStore } from "@/lib/activity";
import * as activityRedis from "@/lib/activity-redis";

const TEST_SECRET = "unit-test-webhook-secret";

function sign(body: string, secret = TEST_SECRET): string {
  return `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
}

function webhookRequest(
  event: string,
  payload: unknown,
  headers: Record<string, string> = {},
): Request {
  const raw = typeof payload === "string" ? payload : JSON.stringify(payload);
  return new Request("http://localhost/api/webhooks/github", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-github-event": event,
      "x-hub-signature-256": sign(raw),
      ...headers,
    },
    body: raw,
  });
}

const openedPr = {
  action: "opened",
  number: 7,
  pull_request: {
    number: 7,
    title: "Webhook producer",
    html_url: "https://github.com/brianlovin/briOS/pull/7",
    merged: false,
    user: { login: "octocat", type: "User", email: "octocat@example.com" },
  },
  repository: {
    name: "briOS",
    full_name: "brianlovin/briOS",
    private: false,
    html_url: "https://github.com/brianlovin/briOS",
  },
  sender: { login: "octocat", type: "User", email: "octocat@example.com" },
};

describe("POST /api/webhooks/github", () => {
  const previousSecret = process.env.GITHUB_ACTIVITY_WEBHOOK_SECRET;
  let store = createMemoryActivityStore();

  beforeEach(() => {
    process.env.GITHUB_ACTIVITY_WEBHOOK_SECRET = TEST_SECRET;
    store = createMemoryActivityStore();
    spyOn(activityRedis, "getActivityStore").mockReturnValue(store);
  });

  afterEach(() => {
    if (previousSecret === undefined) {
      delete process.env.GITHUB_ACTIVITY_WEBHOOK_SECRET;
    } else {
      process.env.GITHUB_ACTIVITY_WEBHOOK_SECRET = previousSecret;
    }
  });

  test("returns 503 when the webhook secret is missing", async () => {
    delete process.env.GITHUB_ACTIVITY_WEBHOOK_SECRET;
    const res = await POST(webhookRequest("ping", { zen: "hi" }));
    expect(res.status).toBe(503);
    expect(await store.getStreamLength()).toBe(0);
  });

  test("returns 401 for a bad signature", async () => {
    const res = await POST(
      webhookRequest("pull_request", openedPr, {
        "x-hub-signature-256":
          "sha256=0000000000000000000000000000000000000000000000000000000000000000",
      }),
    );
    expect(res.status).toBe(401);
    expect(await store.getStreamLength()).toBe(0);
  });

  test("returns 200 for ping without ingesting", async () => {
    const res = await POST(webhookRequest("ping", { zen: "Responsive is better than fast." }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, ignored: "ping" });
    expect(await store.getStreamLength()).toBe(0);
  });

  test("ingests an opened pull request and strips email", async () => {
    const res = await POST(webhookRequest("pull_request", openedPr));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.duplicate).toBe(false);

    const [event] = await store.getTail(1);
    const serialized = JSON.stringify(event);
    expect(serialized).not.toContain("octocat@example.com");
    expect(event?.type).toBe("pr_opened");
    expect(event?.source).toBe("github");
    expect(event?.summary).toBe("Opened a pull request on briOS");
  });

  test("records private repos without the name, and skips bot PRs, unmerged closes, and deleted stars", async () => {
    const privateRes = await POST(
      webhookRequest("pull_request", {
        ...openedPr,
        repository: {
          ...openedPr.repository,
          private: true,
          name: "secrets",
          full_name: "brianlovin/secrets",
          html_url: "https://github.com/brianlovin/secrets",
        },
        pull_request: {
          ...openedPr.pull_request,
          title: "private title must not leak",
          html_url: "https://github.com/brianlovin/secrets/pull/7",
        },
      }),
    );
    const botRes = await POST(
      webhookRequest("pull_request", {
        ...openedPr,
        sender: { login: "dependabot[bot]", type: "Bot" },
        pull_request: {
          ...openedPr.pull_request,
          user: { login: "dependabot[bot]", type: "Bot" },
        },
      }),
    );
    const closedRes = await POST(
      webhookRequest("pull_request", {
        ...openedPr,
        action: "closed",
        pull_request: { ...openedPr.pull_request, merged: false },
      }),
    );
    const deletedStar = await POST(
      webhookRequest("star", {
        action: "deleted",
        repository: openedPr.repository,
        sender: openedPr.sender,
      }),
    );

    expect(privateRes.status).toBe(200);
    const privateBody = await privateRes.json();
    expect(privateBody.ok).toBe(true);
    expect(privateBody.ignored).toBeUndefined();
    const [privateEvent] = await store.getTail(1);
    const privateSerialized = JSON.stringify(privateEvent);
    expect(privateSerialized).not.toContain("secrets");
    expect(privateSerialized).not.toContain("private title");
    expect(privateEvent?.summary).toBe("Opened a pull request in a private repo");
    expect(privateEvent?.subject).toBeUndefined();
    expect(botRes.status).toBe(200);
    expect(await botRes.json()).toEqual({ ok: true, ignored: "bot_actor" });
    expect(closedRes.status).toBe(200);
    expect(await closedRes.json()).toEqual({ ok: true, ignored: "closed_unmerged" });
    expect(deletedStar.status).toBe(200);
    expect(await deletedStar.json()).toEqual({ ok: true, ignored: "ignored_star_action" });
    expect(await store.getStreamLength()).toBe(1);
  });
});
