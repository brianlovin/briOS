import { describe, expect, test } from "bun:test";
import { createHash, createHmac } from "crypto";

import {
  createMemoryActivityStore,
  githubActivityFromWebhook,
  isGithubBotActor,
  recordGithubActivity,
  verifyGithubWebhookSignature,
} from "@/lib/activity";

const EMAIL = "octocat@example.com";

function publicRepo(overrides: Record<string, unknown> = {}) {
  return {
    name: "briOS",
    full_name: "brianlovin/briOS",
    private: false,
    html_url: "https://github.com/brianlovin/briOS",
    ...overrides,
  };
}

function human(overrides: Record<string, unknown> = {}) {
  return {
    login: "octocat",
    type: "User",
    email: EMAIL,
    ...overrides,
  };
}

function pullRequestPayload(overrides: Record<string, unknown> = {}) {
  return {
    action: "opened",
    number: 42,
    pull_request: {
      number: 42,
      title: "Add activity feed",
      html_url: "https://github.com/brianlovin/briOS/pull/42",
      merged: false,
      user: human(),
    },
    repository: publicRepo(),
    sender: human(),
    ...overrides,
  };
}

function starPayload(overrides: Record<string, unknown> = {}) {
  return {
    action: "created",
    repository: publicRepo(),
    sender: human(),
    ...overrides,
  };
}

describe("verifyGithubWebhookSignature", () => {
  const secret = "unit-test-webhook-secret";
  const body = `{"zen":"Responsive is better than fast."}`;
  const signature = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;

  test("accepts a matching sha256 signature", () => {
    expect(verifyGithubWebhookSignature(body, signature, secret)).toBe(true);
  });

  test("rejects a missing, truncated, or wrong signature", () => {
    expect(verifyGithubWebhookSignature(body, null, secret)).toBe(false);
    expect(verifyGithubWebhookSignature(body, "sha256=deadbeef", secret)).toBe(false);
    expect(verifyGithubWebhookSignature(body, signature.slice(0, 20), secret)).toBe(false);
    expect(verifyGithubWebhookSignature(` ${body}`, signature, secret)).toBe(false);
  });
});

describe("isGithubBotActor", () => {
  test("treats type Bot and known bot logins as bots", () => {
    expect(isGithubBotActor({ login: "octocat", type: "User" })).toBe(false);
    expect(isGithubBotActor({ login: "cursor[bot]", type: "User" })).toBe(true);
    expect(isGithubBotActor({ login: "dependabot[bot]", type: "User" })).toBe(true);
    expect(isGithubBotActor({ login: "github-actions[bot]", type: "User" })).toBe(true);
    expect(isGithubBotActor({ login: "some-app", type: "Bot" })).toBe(true);
  });
});

describe("githubActivityFromWebhook", () => {
  test("maps an opened pull request", () => {
    const decision = githubActivityFromWebhook("pull_request", pullRequestPayload());
    expect(decision).toEqual({
      status: "ingest",
      input: expect.objectContaining({
        source: "github",
        type: "pr_opened",
        speed: "event",
        visibility: "public",
        summary: "Opened a pull request on briOS",
        idempotency_key: "github:pr_opened:briOS:42",
        subject: {
          kind: "pull_request",
          label: "Add activity feed",
          href: "https://github.com/brianlovin/briOS/pull/42",
        },
        meta: {
          repo: "briOS",
          title: "Add activity feed",
          number: 42,
          href: "https://github.com/brianlovin/briOS/pull/42",
        },
      }),
    });
  });

  test("maps a merged pull request and ignores closed-unmerged", () => {
    const merged = githubActivityFromWebhook(
      "pull_request",
      pullRequestPayload({
        action: "closed",
        pull_request: {
          number: 42,
          title: "Add activity feed",
          html_url: "https://github.com/brianlovin/briOS/pull/42",
          merged: true,
          additions: 311,
          deletions: 211,
          changed_files: 8,
          user: human(),
        },
      }),
    );
    expect(merged.status).toBe("ingest");
    if (merged.status === "ingest") {
      expect(merged.input.type).toBe("pr_merged");
      expect(merged.input.summary).toBe("Merged a pull request on briOS");
      expect(merged.input.idempotency_key).toBe("github:pr_merged:briOS:42");
      expect(merged.input.subject).toEqual({
        kind: "pull_request",
        label: "Add activity feed",
        href: "https://github.com/brianlovin/briOS/pull/42",
      });
      expect(merged.input.meta).toEqual({
        repo: "briOS",
        title: "Add activity feed",
        number: 42,
        href: "https://github.com/brianlovin/briOS/pull/42",
        additions: 311,
        deletions: 211,
        changed_files: 8,
      });
      expect(merged.input.summary).not.toContain("+311");
    }

    const closed = githubActivityFromWebhook(
      "pull_request",
      pullRequestPayload({
        action: "closed",
        pull_request: {
          number: 42,
          title: "Add activity feed",
          html_url: "https://github.com/brianlovin/briOS/pull/42",
          merged: false,
          user: human(),
        },
      }),
    );
    expect(closed).toEqual({ status: "ignore", reason: "closed_unmerged" });
  });

  test("maps a created star and ignores deleted", () => {
    const created = githubActivityFromWebhook("star", starPayload());
    expect(created).toEqual({
      status: "ingest",
      input: expect.objectContaining({
        source: "github",
        type: "repo_starred",
        speed: "event",
        visibility: "public",
        summary: "Someone starred briOS",
        idempotency_key: "github:star:briOS:octocat",
        subject: {
          kind: "repo",
          label: "brianlovin/briOS",
          href: "https://github.com/brianlovin/briOS",
        },
        meta: {
          repo: "briOS",
          href: "https://github.com/brianlovin/briOS",
        },
      }),
    });

    expect(githubActivityFromWebhook("star", starPayload({ action: "deleted" }))).toEqual({
      status: "ignore",
      reason: "ignored_star_action",
    });
  });

  test("records private repos without passing through the name, title, or url", () => {
    const decision = githubActivityFromWebhook(
      "pull_request",
      pullRequestPayload({
        repository: {
          name: "secrets",
          full_name: "brianlovin/secrets",
          private: true,
          html_url: "https://github.com/brianlovin/secrets",
        },
        pull_request: {
          number: 1,
          title: "private title must not leak",
          html_url: "https://github.com/brianlovin/secrets/pull/1",
          merged: false,
          user: human(),
        },
      }),
    );
    const repoHash = createHash("sha256").update("brianlovin/secrets").digest("hex").slice(0, 16);

    expect(decision.status).toBe("ingest");
    if (decision.status === "ingest") {
      expect(decision.input.summary).toBe("Opened a pull request");
      expect(decision.input.subject).toEqual({ kind: "pull_request", label: "a pull request" });
      expect(decision.input.meta).toEqual({ private: true, number: 1 });
      expect(decision.input.idempotency_key).toBe(`github:pr_opened:private:${repoHash}:1`);
    }

    const serialized = JSON.stringify(decision);
    expect(serialized).not.toContain("private title");
    expect(serialized).not.toContain("secrets");
    expect(serialized).not.toContain("brianlovin");
  });

  test("ignores bot pull requests", () => {
    expect(
      githubActivityFromWebhook(
        "pull_request",
        pullRequestPayload({
          sender: { login: "dependabot[bot]", type: "Bot" },
          pull_request: {
            number: 9,
            title: "Bump lodash",
            html_url: "https://github.com/brianlovin/briOS/pull/9",
            merged: false,
            user: { login: "dependabot[bot]", type: "Bot" },
          },
        }),
      ),
    ).toEqual({ status: "ignore", reason: "bot_actor" });

    expect(
      githubActivityFromWebhook(
        "pull_request",
        pullRequestPayload({
          sender: { login: "cursor[bot]", type: "Bot" },
          pull_request: {
            number: 10,
            title: "Agent PR",
            html_url: "https://github.com/brianlovin/briOS/pull/10",
            merged: false,
            user: { login: "cursor[bot]", type: "Bot" },
          },
        }),
      ),
    ).toEqual({ status: "ignore", reason: "bot_actor" });
  });

  test("ignores stars from bots", () => {
    expect(
      githubActivityFromWebhook(
        "star",
        starPayload({ sender: { login: "github-actions[bot]", type: "Bot" } }),
      ),
    ).toEqual({ status: "ignore", reason: "bot_actor" });
  });

  test("ignores ping and unknown events", () => {
    expect(githubActivityFromWebhook("ping", { zen: "nice" })).toEqual({
      status: "ignore",
      reason: "ping",
    });
    expect(githubActivityFromWebhook("issues", pullRequestPayload())).toEqual({
      status: "ignore",
      reason: "ignored_event",
    });
  });
});

describe("recordGithubActivity", () => {
  test("stores additions and deletions on a merged pull request", async () => {
    const store = createMemoryActivityStore();
    const result = await recordGithubActivity(
      "pull_request",
      pullRequestPayload({
        action: "closed",
        pull_request: {
          number: 42,
          title: "Add activity feed",
          html_url: "https://github.com/brianlovin/briOS/pull/42",
          merged: true,
          additions: 311,
          deletions: 211,
          changed_files: 8,
          user: human(),
        },
      }),
      store,
    );

    expect(result).toEqual(expect.objectContaining({ ok: true, duplicate: false }));
    const [event] = await store.getTail(1);
    expect(event?.type).toBe("pr_merged");
    expect(event?.summary).toBe("Merged a pull request on briOS");
    expect(event?.subject).toEqual({
      kind: "pull_request",
      label: "Add activity feed",
      href: "https://github.com/brianlovin/briOS/pull/42",
    });
    expect(event?.meta).toEqual({
      repo: "briOS",
      title: "Add activity feed",
      number: 42,
      href: "https://github.com/brianlovin/briOS/pull/42",
      additions: 311,
      deletions: 211,
      changed_files: 8,
    });
    expect(event?.summary).not.toMatch(/\+311|-211/);
  });

  test("writes a public event with no email", async () => {
    const store = createMemoryActivityStore();
    const result = await recordGithubActivity("pull_request", pullRequestPayload(), store);

    expect(result).toEqual(expect.objectContaining({ ok: true, duplicate: false }));
    const [event] = await store.getTail(1);
    const serialized = JSON.stringify(event);
    expect(serialized).not.toContain(EMAIL);
    expect(serialized).not.toContain("example.com");
    expect(serialized.toLowerCase()).not.toMatch(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/);
    expect(event?.source).toBe("github");
    expect(event?.visibility).toBe("public");
    expect(event?.actor).toBeUndefined();
    expect(event?.meta).toEqual({
      repo: "briOS",
      title: "Add activity feed",
      number: 42,
      href: "https://github.com/brianlovin/briOS/pull/42",
    });
  });

  test("records a private repo without leaking its name, and still skips bot PRs", async () => {
    const store = createMemoryActivityStore();

    const privateResult = await recordGithubActivity(
      "pull_request",
      pullRequestPayload({
        repository: publicRepo({
          private: true,
          name: "secrets",
          full_name: "brianlovin/secrets",
          html_url: "https://github.com/brianlovin/secrets",
        }),
      }),
      store,
    );
    const botResult = await recordGithubActivity(
      "pull_request",
      pullRequestPayload({
        sender: { login: "dependabot[bot]", type: "Bot" },
        pull_request: {
          number: 3,
          title: "Bump",
          html_url: "https://github.com/brianlovin/briOS/pull/3",
          merged: false,
          user: { login: "dependabot[bot]", type: "Bot" },
        },
      }),
      store,
    );

    expect(privateResult).toEqual(expect.objectContaining({ ok: true, duplicate: false }));
    expect(botResult).toEqual({ skipped: true, reason: "bot_actor" });
    expect(await store.getStreamLength()).toBe(1);

    const [event] = await store.getTail(1);
    const serialized = JSON.stringify(event);
    expect(serialized).not.toContain("secrets");
    expect(serialized).not.toContain("Add activity feed");
    expect(event?.summary).toBe("Opened a pull request");
    expect(event?.meta).toEqual({ private: true, number: 42 });
  });

  test("treats the same person starring twice as one event", async () => {
    const store = createMemoryActivityStore();
    const first = await recordGithubActivity("star", starPayload(), store);
    const second = await recordGithubActivity("star", starPayload(), store);
    const other = await recordGithubActivity(
      "star",
      starPayload({ sender: human({ login: "other" }) }),
      store,
    );

    expect(first).toEqual(expect.objectContaining({ ok: true, duplicate: false }));
    expect(second).toEqual(expect.objectContaining({ ok: true, duplicate: true }));
    expect(other).toEqual(expect.objectContaining({ ok: true, duplicate: false }));
    expect(await store.getStreamLength()).toBe(2);
    expect(await store.getTotals()).toEqual([
      expect.objectContaining({ source: "github", type: "repo_starred", count: 2 }),
    ]);
  });
});
