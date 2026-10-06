import { execFileSync } from "node:child_process";
import { createHash, createPublicKey, sign, verify } from "node:crypto";

const SHA = /^[a-f0-9]{40}$/;
const DIGEST = /^[a-f0-9]{64}$/;
const FIELDS = [
  "version",
  "repository",
  "head",
  "base",
  "tree",
  "policy",
  "verifiedAt",
  "node",
  "bun",
  "platform",
];
const POLICY_PATHS = [
  "scripts/ci",
  "package.json",
  "bun.lock",
  "next.config.ts",
  "eslint.config.mjs",
  ".githooks/pre-push",
  "tsconfig.json",
  ".github/workflows/build.yml",
];

// Hash committed objects, never mutable working-tree files. Missing inputs fail closed.
export function policyDigest(cwd, ref) {
  const commit = execFileSync(
    "git",
    ["rev-parse", "--verify", "--end-of-options", `${ref}^{commit}`],
    {
      cwd,
      encoding: "utf8",
    },
  ).trim();
  if (!SHA.test(commit)) throw new Error("Expected a SHA-1 Git commit");
  const objects = POLICY_PATHS.map((path) => {
    const oid = execFileSync("git", ["rev-parse", "--verify", `${commit}:${path}`], {
      cwd,
      encoding: "utf8",
    }).trim();
    if (!SHA.test(oid)) throw new Error(`Invalid policy object: ${path}`);
    return [path, oid];
  });
  const rootInputs = execFileSync("git", ["ls-tree", commit], { cwd, encoding: "utf8" })
    .split("\n")
    .filter(
      (line) =>
        /\t[^/]+$/.test(line) &&
        (line.startsWith("100") || /\t(?:scripts|\.github|\.githooks)$/.test(line)),
    );
  return createHash("sha256")
    .update(JSON.stringify([objects, rootInputs]))
    .digest("hex");
}

export function receiptRef(head, base) {
  if (typeof head !== "string" || typeof base !== "string" || !SHA.test(head) || !SHA.test(base)) {
    throw new Error("Receipt refs require full commit SHAs");
  }
  return `refs/notes/brios-ci/${head}/${base}`;
}

export function createReceipt(payload, privateKey) {
  const canonical = Object.fromEntries(
    Object.keys(payload)
      .sort()
      .map((key) => [key, payload[key]]),
  );
  const bytes = Buffer.from(JSON.stringify(canonical));
  return {
    payload: bytes.toString("base64"),
    signature: sign(null, bytes, privateKey).toString("base64"),
  };
}

function decode(value) {
  if (typeof value !== "string" || value.length === 0 || value.length > 16384)
    throw new Error("Invalid encoding");
  const bytes = Buffer.from(value, "base64");
  if (bytes.toString("base64") !== value) throw new Error("Invalid base64");
  return bytes;
}

// The configured Mac account is trusted to issue receipts only after verification.
// This signature authenticates that issuer; it is not isolation from same-account agents.
export function verifyReceipt(envelope, options) {
  try {
    const { repository, head, base, tree, policy, publicKey, now = Date.now() } = options;
    if (!envelope || typeof envelope !== "object")
      return { valid: false, reason: "Missing receipt" };
    const bytes = decode(envelope.payload);
    const signature = decode(envelope.signature);
    const key = publicKey?.type === "public" ? publicKey : createPublicKey(publicKey);
    if (key.asymmetricKeyType !== "ed25519" || !verify(null, bytes, key, signature)) {
      return { valid: false, reason: "Invalid signature" };
    }
    const payload = JSON.parse(bytes.toString("utf8"));
    if (
      !payload ||
      Array.isArray(payload) ||
      typeof payload !== "object" ||
      Object.keys(payload).length !== FIELDS.length ||
      FIELDS.some((field) => !Object.hasOwn(payload, field)) ||
      payload.version !== 1
    )
      return { valid: false, reason: "Invalid receipt schema" };
    const expected = { repository, head, base, tree, policy };
    if (
      typeof repository !== "string" ||
      !/^[\w.-]+\/[\w.-]+$/.test(repository) ||
      ![head, base, tree].every((value) => typeof value === "string" && SHA.test(value)) ||
      typeof policy !== "string" ||
      !DIGEST.test(policy)
    ) {
      return { valid: false, reason: "Invalid expected bindings" };
    }
    for (const [field, value] of Object.entries(expected)) {
      if (payload[field] !== value) return { valid: false, reason: `Mismatched ${field}` };
    }
    if (
      payload.platform !== "darwin" ||
      typeof payload.node !== "string" ||
      !/^v?22\.\d+\.\d+$/.test(payload.node) ||
      typeof payload.bun !== "string" ||
      payload.bun !== "1.3.3"
    ) {
      return { valid: false, reason: "Unsupported runtime" };
    }
    const timestamp = Date.parse(payload.verifiedAt);
    if (
      typeof payload.verifiedAt !== "string" ||
      !Number.isFinite(timestamp) ||
      new Date(timestamp).toISOString() !== payload.verifiedAt ||
      !Number.isFinite(now) ||
      timestamp > now + 5 * 60 * 1000 ||
      timestamp < now - 7 * 24 * 60 * 60 * 1000
    ) {
      return { valid: false, reason: "Invalid or expired verification time" };
    }
    return { valid: true, reason: "Verified local CI receipt" };
  } catch {
    return { valid: false, reason: "Malformed receipt or public key" };
  }
}
