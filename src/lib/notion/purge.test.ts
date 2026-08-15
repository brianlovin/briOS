import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";

const revalidateTag = mock(() => {});
const revalidatePath = mock(() => {});

mock.module("next/cache", () => ({
  revalidateTag,
  revalidatePath,
}));

import * as cache from "./cache";
import {
  PURGE_CACHE_TYPES,
  PURGE_CONFIG,
  PURGEABLE_CONTENT_TYPES,
  purgeContentType,
} from "./purge";

describe("PURGE_CONFIG", () => {
  test("covers every purgeable content type", () => {
    expect(Object.keys(PURGE_CONFIG).sort()).toEqual([...PURGEABLE_CONTENT_TYPES].sort());
  });

  test("maps each content type to its Redis prefix, Next tag, and paths", () => {
    expect(PURGE_CONFIG.writing).toEqual({
      patterns: ["notion:writing:*"],
      tags: ["notion:writing"],
      paths: ["/writing", "/api/writing"],
      pagePaths: ["/writing/[slug]"],
    });
    expect(PURGE_CONFIG.til).toEqual({
      patterns: ["notion:til:*"],
      tags: ["notion:til"],
      paths: ["/til", "/api/til"],
      pagePaths: ["/til/[slug]"],
    });
    expect(PURGE_CONFIG.ama).toEqual({
      patterns: ["notion:ama:*"],
      tags: ["notion:ama"],
      paths: ["/ama", "/api/ama"],
      pagePaths: ["/ama/[id]"],
    });
    expect(PURGE_CONFIG.stack).toEqual({
      patterns: ["notion:stack:*"],
      tags: ["notion:stack"],
      paths: ["/stack", "/api/stacks"],
      pagePaths: [],
    });
    expect(PURGE_CONFIG.sites).toEqual({
      patterns: ["notion:good-websites:*"],
      tags: ["notion:good-websites"],
      paths: ["/sites", "/api/sites"],
      pagePaths: [],
    });
  });

  test("includes all as a purge-cache type without its own config row", () => {
    expect(PURGE_CACHE_TYPES).toEqual(["writing", "til", "ama", "stack", "sites", "all"]);
    expect(PURGE_CONFIG).not.toHaveProperty("all");
  });
});

describe("purgeContentType", () => {
  afterEach(() => {
    revalidateTag.mockClear();
    revalidatePath.mockClear();
    mock.restore();
  });

  test("invalidates Redis, tags, and paths for writing", async () => {
    const invalidate = spyOn(cache, "invalidateNotionCache").mockResolvedValue(4);

    await expect(purgeContentType("writing")).resolves.toBe(4);
    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(invalidate).toHaveBeenCalledWith("notion:writing:*");
    expect(revalidateTag).toHaveBeenCalledWith("notion:writing", "max");
    expect(revalidatePath).toHaveBeenCalledTimes(3);
    expect(revalidatePath).toHaveBeenCalledWith("/writing");
    expect(revalidatePath).toHaveBeenCalledWith("/api/writing");
    expect(revalidatePath).toHaveBeenCalledWith("/writing/[slug]", "page");
  });

  test("uses the good-websites prefix for sites", async () => {
    const invalidate = spyOn(cache, "invalidateNotionCache").mockResolvedValue(2);

    await expect(purgeContentType("sites")).resolves.toBe(2);
    expect(invalidate).toHaveBeenCalledWith("notion:good-websites:*");
    expect(revalidateTag).toHaveBeenCalledWith("notion:good-websites", "max");
    expect(revalidatePath).toHaveBeenCalledTimes(2);
    expect(revalidatePath).toHaveBeenCalledWith("/sites");
    expect(revalidatePath).toHaveBeenCalledWith("/api/sites");
  });

  test("uses the stack prefix and has no pagePaths", async () => {
    const invalidate = spyOn(cache, "invalidateNotionCache").mockResolvedValue(1);

    await expect(purgeContentType("stack")).resolves.toBe(1);
    expect(invalidate).toHaveBeenCalledWith("notion:stack:*");
    expect(revalidateTag).toHaveBeenCalledWith("notion:stack", "max");
    expect(revalidatePath).toHaveBeenCalledTimes(2);
    expect(revalidatePath).toHaveBeenCalledWith("/stack");
    expect(revalidatePath).toHaveBeenCalledWith("/api/stacks");
  });
});

describe("webhook callers", () => {
  test("every webhook that writes Notion calls purgeContentType", () => {
    const webhooksDir = join(import.meta.dir, "../../app/api/webhooks");
    const routes = readdirSync(webhooksDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(webhooksDir, entry.name, "route.ts"));

    expect(routes.length).toBeGreaterThan(0);

    for (const route of routes) {
      const source = readFileSync(route, "utf8");
      const writesNotion =
        /notion\.(pages|blocks)\.update/.test(source) ||
        /updateWritingShortId|updateStackItem|createStackItem|createAmaQuestion/.test(source);
      if (writesNotion) {
        expect(source.includes("purgeContentType(")).toBe(true);
      }
    }
  });

  test("purge-cache uses the shared helper instead of an inline table", () => {
    const source = readFileSync(
      join(import.meta.dir, "../../app/api/purge-cache/route.ts"),
      "utf8",
    );
    expect(source.includes("purgeContentType(")).toBe(true);
    expect(source.includes("PURGE_CONFIG")).toBe(false);
  });

  test("does not re-export purge from the notion barrel (client-imported)", () => {
    const source = readFileSync(join(import.meta.dir, "index.ts"), "utf8");
    expect(source.includes("purge")).toBe(false);
  });
});
