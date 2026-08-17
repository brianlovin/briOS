import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("GET /api/hn-digest/send", () => {
  test("opts the cron into request-time rendering without cacheComponents-incompatible segment configs", () => {
    const source = readFileSync(resolve(import.meta.dir, "route.ts"), "utf8");

    expect(source).not.toMatch(/export const dynamic/);
    expect(source).not.toMatch(/export const revalidate/);
    expect(source).toMatch(/await connection\(\)/);
    expect(source).toContain("Cache-Control");
    expect(source).toContain("no-store");
  });
});
