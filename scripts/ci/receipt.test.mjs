import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { generateKeyPairSync } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { createReceipt, policyDigest, receiptRef, verifyReceipt } from "./receipt.mjs";

const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const now = Date.parse("2026-10-05T12:00:00.000Z");
const payload = {
  version: 1,
  repository: "brianlovin/briOS",
  head: "a".repeat(40),
  base: "b".repeat(40),
  tree: "c".repeat(40),
  policy: "d".repeat(64),
  verifiedAt: new Date(now).toISOString(),
  node: "v22.17.0",
  bun: "1.3.3",
  platform: "darwin",
};
const options = { ...payload, publicKey, now };
const signed = (changes = {}) => createReceipt({ ...payload, ...changes }, privateKey);

test("a real Ed25519 signature authenticates every binding", () => {
  assert.equal(verifyReceipt(signed(), options).valid, true);
  assert.equal(
    verifyReceipt(signed(), {
      ...options,
      publicKey: publicKey.export({ type: "spki", format: "pem" }),
    }).valid,
    true,
  );
  for (const field of ["repository", "head", "base", "tree", "policy"]) {
    assert.equal(verifyReceipt(signed({ [field]: "wrong" }), options).valid, false, field);
    assert.equal(verifyReceipt(signed(), { ...options, [field]: "wrong" }).valid, false, field);
  }
});

test("tampering and an untrusted signing key cannot forge success", () => {
  const envelope = signed();
  envelope.payload = Buffer.from(JSON.stringify({ ...payload, bun: "forged" })).toString("base64");
  assert.equal(verifyReceipt(envelope, options).valid, false);
  assert.equal(
    verifyReceipt(createReceipt(payload, generateKeyPairSync("ed25519").privateKey), options).valid,
    false,
  );
});

test("rejects unsupported schema and runtimes even when correctly signed", () => {
  for (const changes of [
    { version: 2 },
    { platform: "linux" },
    { node: "v24.0.0" },
    { node: "v22.0.0-forged" },
    { bun: "" },
    { bun: 1 },
    { bun: "  " },
    { extra: true },
  ])
    assert.equal(verifyReceipt(signed(changes), options).valid, false, JSON.stringify(changes));
  const incomplete = { ...payload };
  delete incomplete.bun;
  assert.equal(verifyReceipt(createReceipt(incomplete, privateKey), options).valid, false);
});

test("expiration and future skew are enforced against the supplied clock", () => {
  for (const offset of [-7 * 86400000 - 1, 300001]) {
    assert.equal(
      verifyReceipt(signed({ verifiedAt: new Date(now + offset).toISOString() }), options).valid,
      false,
    );
  }
  for (const offset of [-7 * 86400000, 300000]) {
    assert.equal(
      verifyReceipt(signed({ verifiedAt: new Date(now + offset).toISOString() }), options).valid,
      true,
    );
  }
  for (const verifiedAt of [null, 123, "yesterday", "2026-10-05"]) {
    assert.equal(verifyReceipt(signed({ verifiedAt }), options).valid, false);
  }
});

test("malformed untrusted receipts and verifier inputs never throw", () => {
  for (const input of [
    null,
    undefined,
    "",
    [],
    {},
    { payload: "???", signature: "???" },
    { ...signed(), signature: 1 },
    { ...signed(), payload: "a".repeat(20000) },
  ]) {
    assert.equal(verifyReceipt(input, options).valid, false);
  }
  assert.equal(verifyReceipt(signed(), undefined).valid, false);
  assert.equal(verifyReceipt(signed(), { ...options, publicKey: "invalid" }).valid, false);
  assert.equal(verifyReceipt(signed(), { ...options, now: NaN }).valid, false);
});

test("receipt refs cannot contain abbreviated SHAs or ref injection", () => {
  assert.equal(
    receiptRef(payload.head, payload.base),
    `refs/notes/brios-ci/${payload.head}/${payload.base}`,
  );
  for (const invalid of ["abc", "../main", "a".repeat(40) + ":refs/heads/main", "A".repeat(40)]) {
    assert.throws(() => receiptRef(invalid, payload.base));
    assert.throws(() => receiptRef(payload.head, invalid));
  }
});

test("policy digest uses committed verification inputs and rejects missing policy files", (t) => {
  const cwd = mkdtempSync(path.join(os.tmpdir(), "brios-receipt-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) =>
    execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git("init");
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "Test");
  for (const file of [
    "scripts/ci/verify.mjs",
    "package.json",
    "bun.lock",
    "next.config.ts",
    "eslint.config.mjs",
    ".githooks/pre-push",
    "tsconfig.json",
    ".github/workflows/build.yml",
  ]) {
    mkdirSync(path.dirname(path.join(cwd, file)), { recursive: true });
    writeFileSync(path.join(cwd, file), "initial");
  }
  git("add", ".");
  git("commit", "-m", "initial");
  const initial = git("rev-parse", "HEAD");
  const digest = policyDigest(cwd, initial);
  writeFileSync(path.join(cwd, "package.json"), "modified");
  assert.equal(policyDigest(cwd, initial), digest);
  git("add", ".");
  git("commit", "-m", "policy change");
  assert.notEqual(policyDigest(cwd, "HEAD"), digest);
  git("rm", "bun.lock");
  git("commit", "-m", "missing input");
  assert.throws(() => policyDigest(cwd, "HEAD"));
});
