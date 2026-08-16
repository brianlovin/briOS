import { createHash, createHmac } from "crypto";

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

function asCount(value: unknown): number | undefined {
  const n = asNumber(value);
  return n !== undefined && n >= 0 ? n : undefined;
}

function pullRequestDiffMeta(pullRequest: Record<string, unknown> | undefined): {
  additions?: number;
  deletions?: number;
  changed_files?: number;
} {
  const additions = asCount(pullRequest?.additions);
  const deletions = asCount(pullRequest?.deletions);
  const changedFiles = asCount(pullRequest?.changed_files);
  return {
    ...(additions !== undefined ? { additions } : {}),
    ...(deletions !== undefined ? { deletions } : {}),
    ...(changedFiles !== undefined ? { changed_files: changedFiles } : {}),
  };
}

export function isGithubBotActor(actor: unknown): boolean {
  if (!isPlainObject(actor)) return false;
  if (actor.type === "Bot") return true;
  const login = asString(actor.login);
  return login !== undefined && GITHUB_BOT_LOGINS.has(login.toLowerCase());
}

/** Dependabot PRs only. Coding-agent bots (cursor[bot], etc.) are kept. */
export function isDependabotActor(actor: unknown): boolean {
  if (!isPlainObject(actor)) return false;
  const login = asString(actor.login)?.toLowerCase();
  return login !== undefined && (login === "dependabot[bot]" || login.startsWith("dependabot"));
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

function readRepository(
  payload: Record<string, unknown>,
):
  | { ok: true; repository: Record<string, unknown>; isPrivate: boolean }
  | { ok: false; reason: string } {
  if (!isPlainObject(payload.repository)) return { ok: false, reason: "missing_repo" };
  return {
    ok: true,
    repository: payload.repository,
    isPrivate: payload.repository.private === true,
  };
}

function repoIdempotencyToken(
  repository: Record<string, unknown>,
  isPrivate: boolean,
): string | undefined {
  const shortName = repoShortName(repository);
  const raw = asString(repository.full_name) || shortName;
  if (!raw) return undefined;
  if (!isPrivate) return shortName ?? raw.split("/").pop();
  return `private:${createHash("sha256").update(raw).digest("hex").slice(0, 16)}`;
}

function pullRequestInput(
  type: "pr_opened" | "pr_merged",
  payload: Record<string, unknown>,
  repository: Record<string, unknown>,
  isPrivate: boolean,
): GithubActivityDecision {
  const pullRequest = isPlainObject(payload.pull_request) ? payload.pull_request : undefined;
  const number = asNumber(pullRequest?.number) ?? asNumber(payload.number);
  const repoToken = repoIdempotencyToken(repository, isPrivate);
  if (number === undefined || !repoToken) return { status: "ignore", reason: "incomplete_pr" };

  const summary =
    type === "pr_opened"
      ? isPrivate
        ? "Opened a pull request"
        : `Opened a pull request on ${repoShortName(repository)}`
      : isPrivate
        ? "Merged a pull request"
        : `Merged a pull request on ${repoShortName(repository)}`;

  if (isPrivate) {
    const diff = type === "pr_merged" ? pullRequestDiffMeta(pullRequest) : {};
    return {
      status: "ingest",
      input: {
        source: ACTIVITY_SOURCE_GITHUB,
        type,
        speed: "event",
        summary,
        visibility: "public",
        idempotency_key: `github:${type}:${repoToken}:${number}`,
        subject: { kind: "pull_request", label: "a pull request" },
        meta: { private: true, number, ...diff },
        idempotencyTtlSeconds: 0,
      },
    };
  }

  const title = asString(pullRequest?.title) || "a pull request";
  const href = asString(pullRequest?.html_url);
  const repo = repoShortName(repository);
  const diff = type === "pr_merged" ? pullRequestDiffMeta(pullRequest) : {};

  return {
    status: "ingest",
    input: {
      source: ACTIVITY_SOURCE_GITHUB,
      type,
      speed: "event",
      summary,
      visibility: "public",
      idempotency_key: `github:${type}:${repoToken}:${number}`,
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
        ...diff,
      },
      idempotencyTtlSeconds: 0,
    },
  };
}

function starInput(
  payload: Record<string, unknown>,
  repository: Record<string, unknown>,
  isPrivate: boolean,
): GithubActivityDecision {
  const sender = isPlainObject(payload.sender) ? payload.sender : undefined;
  const login = asString(sender?.login);
  const repoToken = repoIdempotencyToken(repository, isPrivate);
  if (!login || !repoToken) return { status: "ignore", reason: "incomplete_star" };

  if (isPrivate) {
    return {
      status: "ingest",
      input: {
        source: ACTIVITY_SOURCE_GITHUB,
        type: "repo_starred",
        speed: "event",
        summary: "Someone starred a repository",
        visibility: "public",
        idempotency_key: `github:star:${repoToken}:${login}`,
        subject: { kind: "repo", label: "a repository" },
        meta: { private: true },
        idempotencyTtlSeconds: 0,
      },
    };
  }

  const repo = repoShortName(repository);
  const fullName = asString(repository.full_name);
  const href = asString(repository.html_url);
  const label = fullName || asString(repository.name) || repo || "a repository";

  return {
    status: "ingest",
    input: {
      source: ACTIVITY_SOURCE_GITHUB,
      type: "repo_starred",
      speed: "event",
      summary: `Someone starred ${repo}`,
      visibility: "public",
      idempotency_key: `github:star:${repoToken}:${login}`,
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

  const repoResult = readRepository(payload);
  if (!repoResult.ok) return { status: "ignore", reason: repoResult.reason };
  const { repository, isPrivate } = repoResult;

  if (githubEvent === "pull_request") {
    const action = asString(payload.action);
    const pullRequest = isPlainObject(payload.pull_request) ? payload.pull_request : undefined;
    const sender = isPlainObject(payload.sender) ? payload.sender : undefined;
    const prUser = pullRequest?.user;

    if (action === "opened") {
      if (isDependabotActor(prUser) || isDependabotActor(sender)) {
        return { status: "ignore", reason: "bot_actor" };
      }
      return pullRequestInput("pr_opened", payload, repository, isPrivate);
    }

    if (action === "closed") {
      if (pullRequest?.merged !== true) {
        return { status: "ignore", reason: "closed_unmerged" };
      }
      if (isDependabotActor(sender) || isDependabotActor(prUser)) {
        return { status: "ignore", reason: "bot_actor" };
      }
      return pullRequestInput("pr_merged", payload, repository, isPrivate);
    }

    return { status: "ignore", reason: "ignored_pr_action" };
  }

  if (githubEvent === "star") {
    const action = asString(payload.action);
    if (action !== "created") return { status: "ignore", reason: "ignored_star_action" };
    if (isGithubBotActor(payload.sender)) return { status: "ignore", reason: "bot_actor" };
    return starInput(payload, repository, isPrivate);
  }

  return { status: "ignore", reason: "ignored_event" };
}
