import { afterEach, describe, expect, test } from "bun:test";

import { installAxiomMock } from "@/lib/axiom-test-utils";

const axiomMock = installAxiomMock();

import { flushEvents, isAxiomEnabled, track, trackStep } from "@/lib/axiom";
import { logger } from "@/lib/logger";
import { withAxiom } from "@/lib/observability/axiom-route";

afterEach(() => axiomMock.disable());

describe("track without AXIOM_TOKEN", () => {
  test("no-ops: nothing is ingested and flush is safe", async () => {
    axiomMock.disable();

    expect(isAxiomEnabled()).toBe(false);
    track("hn.subscribed", { email: "a@b.co", source: "web", is_bot: false });
    logger.error("boom", new Error("nope"));
    await flushEvents();

    expect(axiomMock.events()).toEqual([]);
    expect(axiomMock.flush).not.toHaveBeenCalled();
  });

  test("route wrapper still returns the handler response", async () => {
    axiomMock.disable();
    const GET = withAxiom<[Request], Response>(
      async () => Response.json({ ok: true }, { status: 201 }),
      {
        name: "/api/test",
      },
    );

    const res = await GET(new Request("http://localhost/api/test"));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ ok: true });
    expect(axiomMock.events()).toEqual([]);
  });
});

describe("track with AXIOM_TOKEN", () => {
  test("adds event name, time, environment and deployment", () => {
    axiomMock.enable();
    process.env.VERCEL_GIT_COMMIT_SHA = "abc123";

    track("likes.synced", { synced: 3, failed: 1, total: 4 });

    const [event] = axiomMock.events();
    expect(event).toMatchObject({
      event: "likes.synced",
      synced: 3,
      failed: 1,
      total: 4,
      deployment: "abc123",
    });
    expect(typeof event._time).toBe("string");
    expect(event.environment).toBeDefined();
    delete process.env.VERCEL_GIT_COMMIT_SHA;
  });

  test("trackStep records success and error outcomes", async () => {
    axiomMock.enable();

    await trackStep("hn.digest.batch", { batch_offset: 0, batch_size: 2 }, async () => "ok");
    await expect(
      trackStep("hn.digest.batch", { batch_offset: 500, batch_size: 1 }, async () => {
        throw new Error("Postmark down");
      }),
    ).rejects.toThrow("Postmark down");

    const [ok, failed] = axiomMock.events("hn.digest.batch");
    expect(ok).toMatchObject({ batch_offset: 0, status: "success" });
    expect(typeof ok.duration_ms).toBe("number");
    expect(failed).toMatchObject({ batch_offset: 500, status: "error", error: "Postmark down" });
  });

  test("logger.info stays local; warn and error become log events", () => {
    axiomMock.enable();

    logger.info("hello", { a: 1 });
    logger.warn("careful", { key: "notion:writing" });
    logger.error("failed", new Error("kaboom"), { page_id: "p1" });

    expect(axiomMock.events("log")).toMatchObject([
      { level: "warn", message: "careful", key: "notion:writing" },
      { level: "error", message: "failed", page_id: "p1", error_message: "kaboom" },
    ]);
  });
});

describe("withAxiom", () => {
  test("mutations emit api.request with route, method, status and flush", async () => {
    axiomMock.enable();
    const POST = withAxiom<[Request], Response>(
      async () => Response.json({ error: "Nope" }, { status: 409 }),
      {
        name: "/api/thing",
      },
    );

    await POST(new Request("http://localhost/api/thing", { method: "POST" }));

    expect(axiomMock.events("api.request")).toMatchObject([
      { route: "/api/thing", method: "POST", status: 409, error: "Nope" },
    ]);
    expect(axiomMock.flush).toHaveBeenCalled();
  });

  test("successful GET reads are not logged, failed ones are", async () => {
    axiomMock.enable();
    const ok = withAxiom<[Request], Response>(async () => Response.json({}), { name: "/api/read" });
    const broken = withAxiom<[Request], Response>(
      async () => Response.json({ error: "Down" }, { status: 500 }),
      {
        name: "/api/read",
      },
    );

    await ok(new Request("http://localhost/api/read"));
    await broken(new Request("http://localhost/api/read"));

    expect(axiomMock.events("api.request")).toMatchObject([
      { route: "/api/read", status: 500, error: "Down" },
    ]);
  });

  test("crons emit cron.completed with the job name, even on success", async () => {
    axiomMock.enable();
    const GET = withAxiom<[Request], Response>(async () => Response.json({ ok: true }), {
      name: "spotify-sync",
      kind: "cron",
    });

    await GET(new Request("http://localhost/api/spotify/sync"));

    expect(axiomMock.events("cron.completed")).toMatchObject([
      { job: "spotify-sync", method: "GET", status: 200 },
    ]);
  });

  test("thrown errors are recorded as 500 and rethrown", async () => {
    axiomMock.enable();
    const POST = withAxiom<[Request], Response>(
      async (): Promise<Response> => {
        throw new Error("exploded");
      },
      { name: "notion.generate-short-id", kind: "webhook" },
    );

    await expect(POST(new Request("http://localhost/x", { method: "POST" }))).rejects.toThrow(
      "exploded",
    );
    expect(axiomMock.events("webhook.received")).toMatchObject([
      { webhook: "notion.generate-short-id", status: 500, error: "exploded" },
    ]);
  });
});
