import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { checkDirectory, findUnpinned } from "./check-pinned-actions.mjs";

const SHA = "11d5960a326750d5838078e36cf38b85af677262";
const DIGEST = "a".repeat(64);

test("accepts SHA pins, local actions, and docker digests", () => {
  const workflow = `
jobs:
  build:
    uses: owner/repo/.github/workflows/ci.yml@${SHA}
    steps:
      - uses: actions/checkout@${SHA} # v4
      - uses: "oven-sh/setup-bun@${SHA}" # v2
      - name: Local
        uses: ./.github/actions/setup
      - uses: docker://alpine@sha256:${DIGEST}
`;
  assert.deepEqual(findUnpinned(workflow), []);
});

test("rejects tags, branches, short SHAs, expressions, and undigested images", () => {
  const workflow = `
steps:
  - uses: actions/checkout@v4
  - uses: calibreapp/image-actions@main # pinned later
  - name: Short
    uses: 'actions/setup-node@11d5960'
  - uses: actions/cache
  - uses: owner/repo@\${{ inputs.ref }}
  - uses: docker://alpine:3.20
  - uses: actions/checkout@${SHA.toUpperCase()}
`;
  assert.deepEqual(findUnpinned(workflow), [
    { line: 3, ref: "actions/checkout@v4" },
    { line: 4, ref: "calibreapp/image-actions@main" },
    { line: 6, ref: "actions/setup-node@11d5960" },
    { line: 7, ref: "actions/cache" },
    { line: 8, ref: "owner/repo@${{ inputs.ref }}" },
    { line: 9, ref: "docker://alpine:3.20" },
    { line: 10, ref: `actions/checkout@${SHA.toUpperCase()}` },
  ]);
});

test("ignores uses: text inside block scalars such as run scripts", () => {
  const workflow = `
steps:
  - run: |
      echo "uses: actions/checkout@v4"
      uses: not/a-step@main

  - uses: actions/checkout@v4
`;
  assert.deepEqual(findUnpinned(workflow), [{ line: 7, ref: "actions/checkout@v4" }]);
});

test("scans nested workflows and composite actions", (t) => {
  const root = mkdtempSync(path.join(os.tmpdir(), "brios-pinned-actions-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(path.join(root, "workflows"));
  mkdirSync(path.join(root, "actions/setup"), { recursive: true });
  writeFileSync(path.join(root, "workflows/ci.yml"), `steps:\n  - uses: a/b@${SHA}\n`);
  writeFileSync(
    path.join(root, "actions/setup/action.yaml"),
    "runs:\n  steps:\n    - uses: a/b@v1\n",
  );
  assert.deepEqual(checkDirectory(root), [
    { file: path.join(root, "actions/setup/action.yaml"), line: 3, ref: "a/b@v1" },
  ]);
});

test("every action in this repository is pinned", () => {
  const github = fileURLToPath(new URL("../../.github", import.meta.url));
  assert.deepEqual(checkDirectory(github), []);
});
