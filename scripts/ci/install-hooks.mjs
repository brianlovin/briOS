import { execFileSync } from "node:child_process";
const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
if (process.env.CI !== "true") {
  let current = "";
  try {
    current = git("config", "--get", "core.hooksPath");
  } catch {
    /* unset */
  }
  if (current && current !== ".githooks")
    throw new Error(`Existing hook manager at ${current}; refusing to overwrite`);
  git("config", "--local", "core.hooksPath", ".githooks");
  console.log("Installed briOS pre-push hook");
}
