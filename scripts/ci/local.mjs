#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { createReceipt, policyDigest, receiptRef, verifyReceipt } from "./receipt.mjs";

const zero = /^0+$/;
export function parsePushUpdates(input) {
  return input
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      const fields = line.trim().split(/\s+/);
      if (fields.length !== 4) throw new Error("Malformed Git pre-push input");
      const [localRef, head, remoteRef] = fields;
      if (zero.test(head) || !remoteRef.startsWith("refs/heads/")) return [];
      if (!/^[a-f0-9]{40}$/.test(head)) throw new Error("Invalid pushed commit");
      return [{ localRef, head, remoteRef }];
    });
}

export function isRepositoryRemote(url, repository) {
  return [
    `https://github.com/${repository}`,
    `https://github.com/${repository}.git`,
    `git@github.com:${repository}`,
    `git@github.com:${repository}.git`,
    `ssh://git@github.com/${repository}`,
    `ssh://git@github.com/${repository}.git`,
  ].includes(url);
}

function execute(command, args, options) {
  return execFileSync(command, args, { encoding: "utf8", ...options });
}

// Options are injectable only through the module API for isolated fixture tests;
// the CLI never accepts a different platform, signing configuration, or runner.
export function runLocal({
  cwd = process.cwd(),
  command,
  args = [],
  input = "",
  configPath = join(homedir(), ".config/local-ci/brianlovin/briOS/config.json"),
  platform = process.platform,
  nodeVersion = process.version,
  run = execute,
  remoteSession = process.env.CONDUCTOR_IS_LOCAL === "0" || process.env.GITHUB_ACTIONS === "true",
} = {}) {
  if (!["verify", "pre-push"].includes(command))
    throw new Error("Usage: node scripts/ci/local.mjs verify [commit] | pre-push <remote> <url>");
  if (command === "pre-push" && remoteSession) return [];
  if (platform !== "darwin" || !existsSync(configPath)) {
    if (command === "pre-push") return [];
    throw new Error("Local CI requires an enabled Mac setup; run bun run ci:setup");
  }
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  if (!config.enabled) {
    if (command === "pre-push") return [];
    throw new Error("Local CI is disabled");
  }
  if (!/^v?22\./.test(nodeVersion))
    throw new Error("Local CI requires Node 22; switch Node versions before pushing");
  if (!/^[\w.-]+\/[\w.-]+$/.test(config.repository) || !config.publicKey || !config.privateKeyPath)
    throw new Error("Invalid local CI configuration; rerun setup");
  const env = Object.fromEntries(
    ["PATH", "HOME", "TMPDIR", "TMP", "TEMP", "LANG", "LC_ALL", "SSH_AUTH_SOCK"]
      .filter((key) => process.env[key] !== undefined)
      .map((key) => [key, process.env[key]]),
  );
  const git = (gitArgs, options = {}) => run("git", gitArgs, { cwd, env, ...options }).trim();
  const origin = git(["remote", "get-url", "origin"]);
  const pushOrigin = git(["remote", "get-url", "--push", "origin"]);
  if (
    !isRepositoryRemote(origin, config.repository) ||
    !isRepositoryRemote(pushOrigin, config.repository)
  )
    throw new Error("Local CI origin must match the configured GitHub repository");
  if (
    command === "pre-push" &&
    (args[0] !== "origin" || !isRepositoryRemote(args[1], config.repository))
  )
    throw new Error("Local CI supports pushing only to the configured origin");
  const heads =
    command === "pre-push"
      ? [...new Set(parsePushUpdates(input).map((item) => item.head))]
      : [git(["rev-parse", "--verify", "--end-of-options", `${args[0] ?? "HEAD"}^{commit}`])];
  if (!heads.length) return [];
  git(["fetch", "--no-tags", "origin", "+refs/heads/main:refs/remotes/origin/main"]);
  // This project only substitutes PRs targeting main. Refuse other targets.
  const branches =
    command === "pre-push"
      ? parsePushUpdates(input).map((item) => item.remoteRef.slice("refs/heads/".length))
      : [git(["branch", "--show-current"])];
  for (const branch of new Set(branches)) {
    const prs = JSON.parse(
      run(
        "gh",
        [
          "pr",
          "list",
          "--repo",
          config.repository,
          "--head",
          branch,
          "--state",
          "open",
          "--json",
          "baseRefName",
        ],
        { cwd, env },
      ),
    );
    if (prs.some((pr) => pr.baseRefName !== "main")) {
      throw new Error(
        "Local CI supports PRs targeting main only; disable local CI for other targets",
      );
    }
  }
  const base = git(["rev-parse", "refs/remotes/origin/main"]);
  const results = [];
  for (const head of heads) {
    try {
      git(["merge-base", "--is-ancestor", base, head]);
    } catch {
      throw new Error(
        "Rebase onto origin/main before local verification; the merge base has changed",
      );
    }
    console.log(`Local CI: checking ${head.slice(0, 12)}`);
    const tree = git(["rev-parse", `${head}^{tree}`]);
    const policy = policyDigest(cwd, head);
    const expected = {
      repository: config.repository,
      head,
      base,
      tree,
      policy,
      publicKey: config.publicKey,
    };
    const cache = join(dirname(configPath), "receipts", `${head}-${base}.json`);
    let envelope;
    if (existsSync(cache)) {
      try {
        const cached = JSON.parse(readFileSync(cache, "utf8"));
        if (verifyReceipt(cached, expected).valid) {
          envelope = cached;
          console.log("Local CI: reusing signed result");
        }
      } catch {
        /* Invalid or expired caches must be verified again. */
      }
    }
    if (!envelope) {
      const temporary = mkdtempSync(join(tmpdir(), "brios-local-ci-"));
      const snapshot = join(temporary, "checkout");
      try {
        git([
          "-c",
          "core.hooksPath=/dev/null",
          "clone",
          "--shared",
          "--no-checkout",
          "--",
          cwd,
          snapshot,
        ]);
        const snapshotGit = (gitArgs) =>
          run("git", ["-c", "core.hooksPath=/dev/null", ...gitArgs], { cwd: snapshot, env }).trim();
        snapshotGit(["checkout", "--detach", head]);
        snapshotGit(["update-ref", "refs/remotes/origin/main", base]);
        const verifyEnv = {
          ...env,
          CI: "true",
          MIGRATION_IMMUTABILITY_BASE: base,
        };
        delete verifyEnv.SSH_AUTH_SOCK;
        run("bun", ["--no-env-file", "install", "--frozen-lockfile"], {
          cwd: snapshot,
          env: verifyEnv,
          stdio: "inherit",
        });
        run(process.execPath, ["scripts/ci/verify.mjs", "all"], {
          cwd: snapshot,
          env: verifyEnv,
          stdio: "inherit",
        });
        if (snapshotGit(["status", "--porcelain", "--untracked-files=no"])) {
          throw new Error(
            "Verification modified tracked files; commit generated changes before pushing",
          );
        }
        const bun = run("bun", ["--version"], { cwd: snapshot, env: verifyEnv }).trim();
        envelope = createReceipt(
          {
            version: 1,
            repository: config.repository,
            head,
            base,
            tree,
            policy,
            verifiedAt: new Date().toISOString(),
            node: nodeVersion,
            bun,
            platform,
          },
          readFileSync(config.privateKeyPath, "utf8"),
        );
        if (!verifyReceipt(envelope, expected).valid)
          throw new Error("Local verification receipt failed validation");
        mkdirSync(dirname(cache), { recursive: true, mode: 0o700 });
        const pendingCache = `${cache}.${randomUUID()}.tmp`;
        try {
          writeFileSync(pendingCache, `${JSON.stringify(envelope)}\n`, { mode: 0o600, flag: "wx" });
          renameSync(pendingCache, cache);
        } finally {
          rmSync(pendingCache, { force: true });
        }
      } finally {
        rmSync(temporary, { recursive: true, force: true });
      }
    }
    if (command === "pre-push") {
      const ref = receiptRef(head, base);
      const existing = git(["ls-remote", "origin", ref]).split(/\s+/)[0];
      const blob = git(["hash-object", "-w", "--stdin"], {
        input: `${JSON.stringify(envelope)}\n`,
      });
      const receiptTree = git(["mktree"], { input: `100644 blob ${blob}\treceipt.json\n` });
      const commit = git(
        [
          "-c",
          "user.name=briOS Local CI",
          "-c",
          "user.email=local-ci@brianlovin.com",
          "commit-tree",
          receiptTree,
        ],
        { input: "Local CI verification receipt\n" },
      );
      git([
        "-c",
        "core.hooksPath=/dev/null",
        "-c",
        "push.followTags=false",
        "push",
        "--no-verify",
        `--force-with-lease=${ref}:${existing}`,
        "origin",
        `${commit}:${ref}`,
      ]);
    }
    results.push({ head, base, cache });
  }
  return results;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const command = process.argv[2];
    const results = runLocal({
      command,
      args: process.argv.slice(3),
      input: command === "pre-push" ? readFileSync(0, "utf8") : "",
    });
    for (const result of results)
      console.log(
        `Local CI verified ${result.head.slice(0, 12)} against ${result.base.slice(0, 12)}`,
      );
  } catch (error) {
    console.error(`Local CI: ${error.message}`);
    process.exitCode = 1;
  }
}
