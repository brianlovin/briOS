import { execFileSync } from "node:child_process";
import { createPrivateKey, createPublicKey, generateKeyPairSync } from "node:crypto";
import { chmodSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import { isRepositoryRemote } from "./local.mjs";

if (process.platform !== "darwin") throw new Error("Local CI setup is for your Mac only.");
const repository = "brianlovin/briOS";
for (const args of [
  ["remote", "get-url", "origin"],
  ["remote", "get-url", "--push", "origin"],
]) {
  if (!isRepositoryRemote(execFileSync("git", args, { encoding: "utf8" }).trim(), repository))
    throw new Error("Setup origin does not match briOS");
}
const directory = join(homedir(), ".config/local-ci/brianlovin/briOS");
const configPath = join(directory, "config.json");
const privateKeyPath = join(directory, "local-ci-private.pem");
mkdirSync(directory, { recursive: true, mode: 0o700 });
chmodSync(directory, 0o700);
if (!existsSync(privateKeyPath)) {
  const { privateKey } = generateKeyPairSync("ed25519");
  writeFileSync(privateKeyPath, privateKey.export({ type: "pkcs8", format: "pem" }), {
    mode: 0o600,
    flag: "wx",
  });
}
chmodSync(privateKeyPath, 0o600);
const privateKey = createPrivateKey(readFileSync(privateKeyPath));
const publicKey = createPublicKey(privateKey).export({ type: "spki", format: "pem" }).toString();
const variables = JSON.parse(
  execFileSync("gh", ["api", `repos/${repository}/actions/variables?per_page=100`], {
    encoding: "utf8",
  }),
);
const previous = variables.variables.find((v) => v.name === "BRIOS_LOCAL_CI_PUBLIC_KEY")?.value;
if (previous && previous.trim() !== publicKey.trim()) {
  throw new Error(
    "GitHub trusts another key. Key rotation must be deliberate; existing trust was not changed.",
  );
}
execFileSync(
  "gh",
  ["variable", "set", "BRIOS_LOCAL_CI_PUBLIC_KEY", "--repo", repository, "--body", publicKey],
  { stdio: "inherit" },
);
const temp = `${configPath}.${process.pid}.tmp`;
writeFileSync(
  temp,
  `${JSON.stringify({ repository, privateKeyPath, publicKey, enabled: true }, null, 2)}\n`,
  { mode: 0o600 },
);
renameSync(temp, configPath);
console.log(`Local CI enabled for ${repository}. Private key stays at ${privateKeyPath}.`);
console.log(
  "The pre-push hook verifies committed branch updates; cloud sessions keep using remote CI.",
);

execFileSync(process.execPath, ["scripts/ci/install-hooks.mjs"], { stdio: "inherit" });
