#!/usr/bin/env node
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const COMMIT = /^[^\s@]+@[0-9a-f]{40}$/;
const DOCKER_DIGEST = /^docker:\/\/[^\s@]+@sha256:[0-9a-f]{64}$/;
const USES = /^(\s*)(?:-\s+)?["']?uses["']?\s*:\s*(.*)$/;
const BLOCK_SCALAR = /:\s*[|>][-+0-9]*\s*(?:#.*)?$/;

export function isPinned(ref) {
  if (ref.startsWith("./")) return true;
  if (ref.startsWith("docker://")) return DOCKER_DIGEST.test(ref);
  return COMMIT.test(ref);
}

function parseValue(raw) {
  const quoted = raw.match(/^(["'])(.*?)\1/);
  if (quoted) return quoted[2];
  return raw.replace(/\s+#.*$/, "").trim();
}

// Line-based so it needs no YAML dependency; block scalars (e.g. `run: |`) are
// skipped so shell text that mentions `uses:` is not mistaken for a step.
export function findUnpinned(text) {
  const problems = [];
  let blockIndent = -1;
  text.split(/\r?\n/).forEach((line, index) => {
    const indent = line.match(/^ */)[0].length;
    if (blockIndent >= 0) {
      if (!line.trim() || indent > blockIndent) return;
      blockIndent = -1;
    }
    if (BLOCK_SCALAR.test(line)) blockIndent = indent;
    const match = line.match(USES);
    if (!match) return;
    const ref = parseValue(match[2]);
    if (!isPinned(ref)) problems.push({ line: index + 1, ref });
  });
  return problems;
}

function yamlFiles(dir) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name))
    .map((entry) => path.join(entry.parentPath ?? entry.path, entry.name))
    .sort();
}

export function checkDirectory(dir) {
  return yamlFiles(dir).flatMap((file) =>
    findUnpinned(readFileSync(file, "utf8")).map((problem) => ({ file, ...problem })),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = fileURLToPath(new URL("../../", import.meta.url));
  const dir = path.resolve(root, process.argv[2] ?? ".github");
  const problems = checkDirectory(dir);
  for (const { file, line, ref } of problems) {
    console.error(`${path.relative(root, file)}:${line}: unpinned action "${ref}"`);
  }
  if (problems.length) {
    console.error(
      "Pin every `uses:` to a full 40-character commit SHA with the version as a trailing comment, " +
        "e.g. `actions/checkout@<sha> # v4`. Local `./` actions are allowed; `docker://` images need an @sha256 digest.",
    );
    process.exitCode = 1;
  } else {
    console.log("All GitHub Actions references are pinned to commit SHAs.");
  }
}
