#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
process.chdir(fileURLToPath(new URL("../../", import.meta.url)));
const env = Object.fromEntries(
  ["PATH", "HOME", "TMPDIR", "TMP", "TEMP", "LANG", "LC_ALL"]
    .filter((key) => process.env[key] !== undefined)
    .map((key) => [key, process.env[key]]),
);
Object.assign(env, {
  CI: "true",
  NEXT_TELEMETRY_DISABLED: "1",
  SENTRY_AUTH_TOKEN: "",
  POSTMARK_CLIENT_ID: "build-placeholder",
  UPSTASH_REDIS_REST_URL: "https://build-placeholder.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "build-placeholder",
  JWT_SIGNING_KEY: "build-placeholder-secret-key-min-32-chars",
  NOTION_TOKEN: "build-placeholder",
  HN_TOKEN: "build-placeholder",
  ...Object.fromEntries(
    ["STACK", "AMA", "WRITING", "DESIGN_DETAILS_EPISODES", "MUSIC"].map((name) => [
      `NOTION_${name}_DATABASE_ID`,
      "build-placeholder",
    ]),
  ),
});
function run(command, args) {
  console.log(`> ${command} ${args.join(" ")}`);
  execFileSync(command, args, { env, stdio: "inherit" });
}
try {
  if (process.argv[2] !== "all") throw new Error("Usage: node scripts/ci/verify.mjs all");
  const bun = execFileSync("bun", ["--version"], { env, encoding: "utf8" }).trim();
  if (!/^v22\./.test(process.version) || bun !== "1.3.3")
    throw new Error("CI requires Node 22 and Bun 1.3.3");
  console.log(
    JSON.stringify({ node: process.version, bun, platform: process.platform, arch: process.arch }),
  );
  run("node", [
    "--test",
    ...readdirSync("scripts/ci")
      .filter((name) => name.endsWith(".test.mjs"))
      .map((name) => `scripts/ci/${name}`),
  ]);
  run("bun", ["--no-env-file", "run", "lint"]);
  // Bun module mocks persist across files; isolate every file without skipping tests.
  const tests = readdirSync("src", { recursive: true })
    .filter((name) => /\.test\.tsx?$/.test(name))
    .sort();
  if (!tests.length) throw new Error("No application tests discovered");
  for (const file of tests) run("bun", ["--no-env-file", "test", `./src/${file}`]);
  run("bun", ["--no-env-file", "run", "build"]);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
