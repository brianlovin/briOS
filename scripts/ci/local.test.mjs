import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { generateKeyPairSync } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import { isRepositoryRemote, parsePushUpdates, runLocal } from "./local.mjs";
import { policyDigest, receiptRef, verifyReceipt } from "./receipt.mjs";

const github = "git@github.com:brianlovin/briOS.git";
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "shiori-push-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const cwd = join(root, "source");
  const remote = join(root, "remote.git");
  mkdirSync(cwd);
  const git = (args, options = {}) =>
    execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      ...options,
    }).trim();
  git(["init", "-b", "main"]);
  git(["config", "user.name", "Fixture"]);
  git(["config", "user.email", "fixture@example.com"]);
  for (const path of [
    "scripts/ci/verify.mjs",
    "package.json",
    "bun.lock",
    "next.config.ts",
    "eslint.config.mjs",
    ".githooks/pre-push",
    "tsconfig.json",
    ".github/workflows/build.yml",
  ]) {
    mkdirSync(dirname(join(cwd, path)), { recursive: true });
    writeFileSync(join(cwd, path), "fixture\n");
  }
  git(["add", "."]);
  git(["commit", "-m", "base"]);
  const base = git(["rev-parse", "HEAD"]);
  git(["clone", "--bare", cwd, remote]);
  git(["remote", "add", "origin", github]);
  writeFileSync(join(cwd, "feature"), "committed\n");
  git(["add", "."]);
  git(["commit", "-m", "feature"]);
  const head = git(["rev-parse", "HEAD"]);
  writeFileSync(join(cwd, "feature"), "dirty\n");
  writeFileSync(join(cwd, ".env.local"), "SECRET=hidden\n");
  const keys = generateKeyPairSync("ed25519");
  const privateKeyPath = join(root, "key.pem");
  const publicKey = keys.publicKey.export({ type: "spki", format: "pem" });
  writeFileSync(privateKeyPath, keys.privateKey.export({ type: "pkcs8", format: "pem" }));
  const configPath = join(root, "config.json");
  writeFileSync(
    configPath,
    JSON.stringify({ enabled: true, repository: "brianlovin/briOS", privateKeyPath, publicKey }),
  );
  const calls = [];
  let failVerification = false;
  let mutateSnapshot = false;
  const run = (command, args, options) => {
    calls.push({ command, args, options });
    if (command === "gh") return "[]";
    if (command === "bun") return args[0] === "--version" ? "1.3.3\n" : "";
    if (command === process.execPath) {
      assert.deepEqual(args, ["scripts/ci/verify.mjs", "all"]);
      assert.equal(readFileSync(join(options.cwd, "feature"), "utf8"), "committed\n");
      assert.equal(existsSync(join(options.cwd, ".env.local")), false);
      assert.equal(options.env.MIGRATION_IMMUTABILITY_BASE, base);
      assert.equal(options.env.HOME, process.env.HOME);
      assert.equal(options.env.SSH_AUTH_SOCK, undefined);
      if (failVerification) throw new Error("fixture verification failed");
      if (mutateSnapshot) writeFileSync(join(options.cwd, "feature"), "generated changes\n");
      return "";
    }
    const actual = [...args];
    if (["fetch", "ls-remote", "push"].some((verb) => actual.includes(verb))) {
      const index = actual.indexOf("origin");
      if (index !== -1) actual[index] = remote;
    }
    return execFileSync(command, actual, {
      encoding: "utf8",
      ...options,
      stdio: ["pipe", "pipe", "pipe"],
    });
  };
  const invoke = (overrides = {}) =>
    runLocal({
      cwd,
      configPath,
      platform: "darwin",
      nodeVersion: "v22.20.0",
      remoteSession: false,
      run,
      command: "pre-push",
      args: ["origin", github],
      input: `refs/heads/main ${head} refs/heads/feature ${"0".repeat(40)}\n`,
      ...overrides,
    });
  return {
    cwd,
    remote,
    git,
    base,
    head,
    configPath,
    publicKey,
    calls,
    invoke,
    mutate: () => {
      mutateSnapshot = true;
    },
    fail: () => {
      failVerification = true;
    },
  };
}

test("pre-push filters deletion, tag and receipt updates and preserves exact SHA", () => {
  const sha = "a".repeat(40);
  assert.deepEqual(
    parsePushUpdates(
      `refs/heads/a ${sha} refs/heads/a ${"0".repeat(40)}\n(delete) ${"0".repeat(40)} refs/heads/old ${sha}\nrefs/tags/a ${sha} refs/tags/a ${sha}\nrefs/notes/a ${sha} refs/notes/a ${sha}\n`,
    ),
    [{ localRef: "refs/heads/a", head: sha, remoteRef: "refs/heads/a" }],
  );
  assert.throws(() => parsePushUpdates("bad input"), /Malformed/);
});

test("remote matching rejects lookalike hosts and repositories", () => {
  assert.equal(isRepositoryRemote(github, "brianlovin/briOS"), true);
  for (const url of [
    "https://github.com.evil/brianlovin/briOS",
    "git@github.com:other/shiori.git",
    "https://github.com/brianlovin/briOS.git/evil",
  ])
    assert.equal(isRepositoryRemote(url, "brianlovin/briOS"), false);
});

test("cloud and unconfigured pre-push defer to remote CI", () => {
  assert.deepEqual(
    runLocal({
      command: "pre-push",
      platform: "linux",
      run: () => {
        throw new Error("must not run");
      },
    }),
    [],
  );
  assert.deepEqual(
    runLocal({ command: "pre-push", platform: "darwin", configPath: "/nonexistent/shiori-config" }),
    [],
  );
});

test("isolated verification signs and publishes only the receipt, reusing valid cache", (t) => {
  const f = fixture(t);
  const [result] = f.invoke();
  const receipt = JSON.parse(
    f.git(["--git-dir", f.remote, "show", `${receiptRef(f.head, f.base)}:receipt.json`]),
  );
  assert.equal(
    verifyReceipt(receipt, {
      repository: "brianlovin/briOS",
      head: f.head,
      base: f.base,
      tree: f.git(["rev-parse", `${f.head}^{tree}`]),
      policy: policyDigest(f.cwd, f.head),
      publicKey: f.publicKey,
    }).valid,
    true,
  );
  assert.equal(f.git(["--git-dir", f.remote, "rev-parse", "main"]), f.base);
  assert.equal(readFileSync(join(f.cwd, "feature"), "utf8"), "dirty\n");
  assert.equal(f.calls.filter((call) => call.command === process.execPath).length, 1);
  const snapshot = f.calls.find((call) => call.command === process.execPath).options.cwd;
  assert.equal(existsSync(snapshot), false);
  f.invoke();
  assert.equal(f.calls.filter((call) => call.command === process.execPath).length, 1);
  writeFileSync(result.cache, "{}");
  f.invoke();
  assert.equal(f.calls.filter((call) => call.command === process.execPath).length, 2);
  const pushes = f.calls.filter((call) => call.args.includes("push"));
  assert.equal(pushes.length, 3);
  for (const call of pushes) {
    assert.equal(call.args.includes("--no-verify"), true);
    assert.ok(call.args.some((arg) => arg.startsWith("--force-with-lease=refs/notes/brios-ci/")));
    assert.ok(call.args.at(-1).endsWith(`:${receiptRef(f.head, f.base)}`));
  }
});

test("failed suite blocks push and leaves no receipt", (t) => {
  const f = fixture(t);
  f.fail();
  assert.throws(() => f.invoke(), /fixture verification failed/);
  assert.equal(
    f.calls.some((call) => call.args.includes("push")),
    false,
  );
  assert.equal(existsSync(join(dirname(f.configPath), "receipts")), false);
  assert.equal(
    existsSync(f.calls.find((call) => call.command === process.execPath).options.cwd),
    false,
  );
});

test("Node mismatch, wrong push remote and outdated commits fail closed", (t) => {
  const f = fixture(t);
  assert.throws(() => f.invoke({ nodeVersion: "v24.0.0" }), /Node 22/);
  assert.throws(() => f.invoke({ args: ["other", github] }), /only.*origin/);
  f.git(["-c", "core.hooksPath=/dev/null", "push", f.remote, `${f.head}:refs/heads/main`]);
  assert.throws(
    () => f.invoke({ input: `refs/heads/main ${f.base} refs/heads/feature ${"0".repeat(40)}\n` }),
    /Rebase/,
  );
  assert.equal(
    f.calls.some((call) => call.command === process.execPath),
    false,
  );
});

test("verify runs without publishing and pre-push checks the provided commit instead of HEAD", (t) => {
  const f = fixture(t);
  f.invoke({ command: "verify", args: [f.head] });
  assert.equal(
    f.calls.some((call) => call.args.includes("push")),
    false,
  );
  writeFileSync(join(f.cwd, "another"), "later");
  f.git(["add", "another"]);
  f.git(["commit", "-m", "later commit"]);
  const [result] = f.invoke();
  assert.equal(result.head, f.head);
  assert.notEqual(result.head, f.git(["rev-parse", "HEAD"]));
});

test("remote Conductor sessions defer even with configured Mac", (t) => {
  const f = fixture(t);
  assert.deepEqual(f.invoke({ remoteSession: true }), []);
  assert.equal(f.calls.length, 0);
});

test("tracked snapshot changes cannot receive a receipt", (t) => {
  const f = fixture(t);
  f.mutate();
  assert.throws(() => f.invoke(), /modified tracked files/);
  assert.equal(
    f.calls.some((call) => call.args.includes("push")),
    false,
  );
  assert.equal(existsSync(join(dirname(f.configPath), "receipts")), false);
});

test("different sessions preserve independent receipts and code/base changes invalidate cache", (t) => {
  const f = fixture(t);
  f.invoke();
  writeFileSync(join(f.cwd, "second"), "second session");
  f.git(["add", "second"]);
  f.git(["commit", "-m", "second session"]);
  const second = f.git(["rev-parse", "HEAD"]);
  f.invoke({ input: `refs/heads/main ${second} refs/heads/second ${"0".repeat(40)}\n` });
  assert.equal(f.calls.filter((call) => call.command === process.execPath).length, 2);
  for (const head of [f.head, second]) {
    assert.ok(f.git(["--git-dir", f.remote, "show", `${receiptRef(head, f.base)}:receipt.json`]));
  }
  f.git(["-c", "core.hooksPath=/dev/null", "push", f.remote, `${second}:refs/heads/main`]);
  assert.throws(() => f.invoke(), /Rebase/);
});
