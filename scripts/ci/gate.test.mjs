import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

test("required build rejects failed, cancelled, skipped and incomplete decisions", () => {
  const workflow = readFileSync(
    new URL("../../.github/workflows/build.yml", import.meta.url),
    "utf8",
  );
  const body = workflow.split("      - name: Validate decision")[1].split("      - name:")[0];
  const script = body
    .split("        run: |\n")[1]
    .split("\n")
    .map((line) => line.slice(10))
    .join("\n");
  for (const result of ["success", "failure", "cancelled", "skipped", ""]) {
    for (const local of ["true", "false", ""]) {
      const run = spawnSync("sh", ["-c", script], {
        env: { ...process.env, DECISION_RESULT: result, LOCAL_VERIFIED: local },
      });
      assert.equal(run.status === 0, result === "success" && local !== "");
    }
  }
});
