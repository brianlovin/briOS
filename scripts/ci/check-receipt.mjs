import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { policyDigest, receiptRef, verifyReceipt } from "./receipt.mjs";

// Run this module from the PR's BASE revision, never from unverified PR code.
export function checkReceipt({ cwd, repository, head, base, publicKey, merge, git: gitOverride }) {
  const git =
    gitOverride ??
    ((...args) =>
      execFileSync("git", args, {
        cwd,
        encoding: "utf8",
        maxBuffer: 1024 * 1024,
        stdio: ["ignore", "pipe", "pipe"],
      }).trim());
  try {
    if (!publicKey) return { valid: false, reason: "No trusted Mac public key configured" };
    const ref = receiptRef(head, base);
    git("merge-base", "--is-ancestor", base, head);
    if (merge && git("rev-parse", `${merge}^{tree}`) !== git("rev-parse", `${head}^{tree}`)) {
      return { valid: false, reason: "PR merge tree differs from verified head" };
    }
    const policy = policyDigest(cwd, head);
    if (policy !== policyDigest(cwd, base)) {
      return { valid: false, reason: "CI policy changed; remote verification required" };
    }
    git("fetch", "--no-tags", "origin", ref);
    const envelope = JSON.parse(git("show", "FETCH_HEAD:receipt.json"));
    return verifyReceipt(envelope, {
      repository,
      head,
      base,
      policy,
      publicKey,
      tree: git("rev-parse", `${head}^{tree}`),
    });
  } catch {
    return {
      valid: false,
      reason: "Receipt unavailable, invalid, or branch is behind its base; using remote CI",
    };
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = checkReceipt({
    cwd: process.cwd(),
    repository: process.env.GITHUB_REPOSITORY,
    head: process.env.PR_HEAD_SHA,
    base: process.env.PR_BASE_SHA,
    publicKey: process.env.LOCAL_CI_PUBLIC_KEY,
    merge: process.env.GITHUB_SHA,
  });
  console.log(result.reason);
  appendFileSync(process.env.GITHUB_OUTPUT, `local_verified=${result.valid}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      result.valid
        ? "### Local verification accepted\n\nThe trusted Mac verified this exact commit against this PR base. GitHub jobs are unnecessary.\n"
        : "### Remote verification required\n\nNo matching trusted local result was accepted. Running the full suite on GitHub.\n",
    );
  }
}
