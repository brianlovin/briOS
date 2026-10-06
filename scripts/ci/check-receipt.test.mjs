import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { generateKeyPairSync } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { checkReceipt } from "./check-receipt.mjs";
import { createReceipt, policyDigest, receiptRef } from "./receipt.mjs";

function fixture(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), "shiori-check-receipt-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const cwd = path.join(root, "work");
  const origin = path.join(root, "origin.git");
  mkdirSync(cwd);
  const git = (args, input) =>
    execFileSync("git", args, {
      cwd,
      input,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  git(["init", "--bare", origin]);
  git(["init"]);
  git(["config", "user.email", "test@example.com"]);
  git(["config", "user.name", "Test"]);
  git(["remote", "add", "origin", origin]);
  const write = (file, contents) => {
    mkdirSync(path.dirname(path.join(cwd, file)), { recursive: true });
    writeFileSync(path.join(cwd, file), contents);
  };
  const commit = () => {
    git(["add", "."]);
    git(["commit", "-m", "fixture"]);
    return git(["rev-parse", "HEAD"]);
  };
  for (const file of [
    "scripts/ci/verify.mjs",
    "package.json",
    "bun.lock",
    "next.config.ts",
    "eslint.config.mjs",
    ".githooks/pre-push",
    "tsconfig.json",
    ".github/workflows/build.yml",
  ])
    write(file, "initial");
  const base = commit();
  write("src/app.txt", "change");
  const head = commit();
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  const args = { cwd, repository: "brianlovin/briOS", head, base, publicKey };
  const payload = {
    version: 1,
    repository: args.repository,
    head,
    base,
    tree: git(["rev-parse", `${head}^{tree}`]),
    policy: policyDigest(cwd, head),
    verifiedAt: new Date().toISOString(),
    node: "v22.17.0",
    bun: "1.3.3",
    platform: "darwin",
  };
  const publish = (changes = {}, key = privateKey) => {
    const blob = git(
      ["hash-object", "-w", "--stdin"],
      JSON.stringify(createReceipt({ ...payload, ...changes }, key)),
    );
    const tree = git(["mktree"], `100644 blob ${blob}\treceipt.json\n`);
    const receipt = git(["commit-tree", tree, "-m", "receipt"]);
    git(["push", "--force", "origin", `${receipt}:${receiptRef(args.head, args.base)}`]);
  };
  return { args, payload, publish, write, commit, git, origin };
}

test("fetches and accepts a real signed receipt from a bare origin", (t) => {
  const f = fixture(t);
  f.publish();
  assert.deepEqual(checkReceipt(f.args), { valid: true, reason: "Verified local CI receipt" });
});

test("absent receipts fall back even when a previously fetched receipt exists", (t) => {
  const f = fixture(t);
  f.publish();
  assert.equal(checkReceipt(f.args).valid, true);
  f.git(["push", "origin", `:${receiptRef(f.args.head, f.args.base)}`]);
  assert.equal(checkReceipt(f.args).valid, false);
});

test("an actual published receipt with an untrusted signature falls back", (t) => {
  const f = fixture(t);
  f.publish({}, generateKeyPairSync("ed25519").privateKey);
  assert.match(checkReceipt(f.args).reason, /signature/);
  assert.equal(checkReceipt(f.args).valid, false);
});

for (const field of ["head", "base", "tree", "policy", "repository", "verifiedAt"]) {
  test(`a signed but incorrect ${field} falls back after fetching`, (t) => {
    const f = fixture(t);
    const value =
      field === "verifiedAt"
        ? "2020-01-01T00:00:00.000Z"
        : field === "repository"
          ? "another/repo"
          : "e".repeat(field === "policy" ? 64 : 40);
    f.publish({ [field]: value });
    const result = checkReceipt(f.args);
    assert.equal(result.valid, false);
    assert.match(result.reason, field === "verifiedAt" ? /expired/ : new RegExp(field));
  });
}

test("changing committed CI policy always requires remote verification", (t) => {
  const f = fixture(t);
  f.write("scripts/ci/verify.mjs", "changed policy");
  f.args.head = f.commit();
  f.publish({
    head: f.args.head,
    tree: f.git(["rev-parse", `${f.args.head}^{tree}`]),
    policy: policyDigest(f.args.cwd, f.args.head),
  });
  assert.match(checkReceipt(f.args).reason, /policy changed/);
  assert.equal(checkReceipt(f.args).valid, false);
});

test("a stale branch cannot bypass remote CI with a signed current-base receipt", (t) => {
  const f = fixture(t);
  f.git(["checkout", "--detach", f.args.base]);
  f.write("base-progress.txt", "new main change");
  f.args.base = f.commit();
  f.publish({ base: f.args.base });
  assert.equal(checkReceipt(f.args).valid, false);
});

test("no configured trust key falls back", (t) => {
  const f = fixture(t);
  f.publish();
  const result = checkReceipt({ ...f.args, publicKey: undefined });
  assert.equal(result.valid, false);
  assert.match(result.reason, /No trusted Mac/);
});

test("unavailable origin falls back instead of trusting FETCH_HEAD", (t) => {
  const f = fixture(t);
  f.publish();
  assert.equal(checkReceipt(f.args).valid, true);
  rmSync(f.origin, { recursive: true, force: true });
  assert.equal(checkReceipt(f.args).valid, false);
});

test("a different merge tree falls back", (t) => {
  const f = fixture(t);
  f.publish();
  assert.equal(checkReceipt({ ...f.args, merge: f.args.head }).valid, true);
  assert.equal(checkReceipt({ ...f.args, merge: f.args.base }).valid, false);
});

test("new root build configuration changes policy", (t) => {
  const f = fixture(t);
  f.write("bunfig.toml", "[test]\n");
  f.args.head = f.commit();
  assert.match(checkReceipt(f.args).reason, /policy changed/);
});
