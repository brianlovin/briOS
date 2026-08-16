import { createHmac } from "crypto";

import { ACTIVITY_SOURCE_GITHUB, type ActivityIngestInput } from "./activity-shared";
import { safeCompare } from "./api-utils";

const GITHUB_BOT_LOGINS = new Set(["dependabot[bot]", "cursor[bot]", "github-actions[bot]"]);

export type GithubActivityDecision =
  | { status: "ingest"; input: ActivityIngestInput }
  | { status: "ignore"; reason: string };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function isGithubBotActor(actor: unknown): boolean {
  if (!isPlainObject(actor)) return false;
  if (actor.type === "Bot") return true;
  const login = asString(actor.login);
  return login !== undefined && GITHUB_BOT_LOGINS.has(login.toLowerCase());
}

export function verifyGithubWebhookSignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
  secret: string,
): boolean {
  const expected = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  return safeCompare(signatureHeader, expected);
}

function repoShortName(repository: Record<string, unknown>): string | undefined {
  const name = asString(repository.name);
  if (name) return name;
  const fullName = asString(repository.full_name);
  if (!fullName) return undefined;
  const short = fullName.split("/").pop();
  return short || undefined;
}

function publicRepo(
  payload: Record<string, unknown>,
): { ok: true; repository: Record<string, unknown> } | { ok: false; reason: string } {
  if (!isPlainObject(payload.repository)) return { ok: false, reason: "missing_repo" };
  if (payload.repository.private === true) return { ok: false, reason: "private_repo" };
  return { ok: true, repository: payload.repository };
}

function pullRequestInput(
  type: "pr_opened" | "pr_merged",
  payload: Record<string, unknown>,
  repository: Record<string, unknown>,
): GithubActivityDecision {
  const pullRequest = isPlainObject(payload.pull_request) ? payload.pull_request : undefined;
  const number = asNumber(pullRequest?.number) ?? asNumber(payload.number);
  const repo = repoShortName(repository);
  if (number === undefined || !repo) return { status: "ignore", reason: "incomplete_pr" };

  const title = asString(pullRequest?.title) || "a pull request";
  const href = asString(pullRequest?.html_url);
  const summary =
    type === "pr_opened" ? `Opened a pull request on ${repo}` : `Merged a pull request on ${repo}`;

  return {
    status: "ingest",
    input: {
      source: ACTIVITY_SOURCE_GITHUB,
      type,
      speed: "event",
      summary,
      visibility: "public",
      idempotency_key: `github:${type}:${repo}:${number}`,
      subject: {
        kind: "pull_request",
        label: title,
        ...(href ? { href } : {}),
      },
      meta: {
        repo,
        title,
        number,
        ...(href ? { href } : {}),
      },
      idempotencyTtlSeconds: 0,
    },
  };
}

function starInput(
  payload: Record<string, unknown>,
  repository: Record<string, unknown>,
): GithubActivityDecision {
  const sender = isPlainObject(payload.sender) ? payload.sender : undefined;
  const login = asString(sender?.login);
  const repo = repoShortName(repository);
  if (!login || !repo) return { status: "ignore", reason: "incomplete_star" };

  const fullName = asString(repository.full_name);
  const href = asString(repository.html_url);
  const label = fullName || asString(repository.name) || repo;

  return {
    status: "ingest",
    input: {
      source: ACTIVITY_SOURCE_GITHUB,
      type: "repo_starred",
      speed: "event",
      summary: `Someone starred ${repo}`,
      visibility: "public",
      idempotency_key: `github:star:${repo}:${login}`,
      subject: {
        kind: "repo",
        label,
        ...(href ? { href } : {}),
      },
      meta: {
        repo,
        ...(href ? { href } : {}),
      },
      idempotencyTtlSeconds: 0,
    },
  };
}

export function githubActivityFromWebhook(
  githubEvent: string,
  payload: unknown,
): GithubActivityDecision {
  if (githubEvent === "ping") return { status: "ignore", reason: "ping" };
  if (!isPlainObject(payload)) return { status: "ignore", reason: "invalid_payload" };

  const repoResult = publicRepo(payload);
  if (!repoResult.ok) return { status: "ignore", reason: repoResult.reason };
  const repository = repoResult.repository;

  if (githubEvent === "pull_request") {
    const action = asString(payload.action);
    const pullRequest = isPlainObject(payload.pull_request) ? payload.pull_request : undefined;
    const sender = isPlainObject(payload.sender) ? payload.sender : undefined;
    const prUser = pullRequest?.user;

    if (action === "opened") {
      if (isGithubBotActor(prUser) || isGithubBotActor(sender)) {
        return { status: "ignore", reason: "bot_actor" };
      }
      return pullRequestInput("pr_opened", payload, repository);
    }

    if (action === "closed") {
      if (pullRequest?.merged !== true) {
        return { status: "ignore", reason: "closed_unmerged" };
      }
      if (isGithubBotActor(sender)) {
        return { status: "ignore", reason: "bot_actor" };
      }
      return pullRequestInput("pr_merged", payload, repository);
    }

    return { status: "ignore", reason: "ignored_pr_action" };
  }

  if (githubEvent === "star") {
    const action = asString(payload.action);
    if (action !== "created") return { status: "ignore", reason: "ignored_star_action" };
    if (isGithubBotActor(payload.sender)) return { status: "ignore", reason: "bot_actor" };
    return starInput(payload, repository);
  }

  return { status: "ignore", reason: "ignored_event" };
}
