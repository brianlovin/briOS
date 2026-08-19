import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "bun:test";

const pagesDir = join(import.meta.dir, "../app");

const likePages = [
  "stack/page.tsx",
  "sites/page.tsx",
  "til/page.tsx",
  "til/[slug]/page.tsx",
  "writing/[slug]/page.tsx",
  "ama/[id]/page.tsx",
  "design-details/[id]/page.tsx",
];

describe("likes stay outside days-cached islands", () => {
  test("list and detail pages fetch public counts after the Notion island", () => {
    for (const relativePath of likePages) {
      const source = readFileSync(join(pagesDir, relativePath), "utf8");
      expect(source.includes("getServerLikes")).toBe(true);
      expect(source.includes('"use cache"')).toBe(true);

      const cachedFns = source
        .split("async function")
        .filter((block) => block.includes('"use cache"'));
      expect(cachedFns.length).toBeGreaterThan(0);
      for (const block of cachedFns) {
        expect(block.includes("getServerLikes")).toBe(false);
        expect(block.includes('cacheLife("days")')).toBe(true);
      }
    }
  });
});
