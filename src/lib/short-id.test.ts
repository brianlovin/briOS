import { describe, expect, test } from "bun:test";

import { buildSlug, extractShortIdFromSlug, generateShortId, isValidShortId } from "@/lib/short-id";

describe("generateShortId", () => {
  test("returns a 7-character base62 id", () => {
    const id = generateShortId();
    expect(id).toHaveLength(7);
    expect(isValidShortId(id)).toBe(true);
  });

  test("produces unique-looking ids across many calls", () => {
    const ids = new Set(Array.from({ length: 500 }, () => generateShortId()));
    // Collisions are astronomically unlikely, so all should be distinct.
    expect(ids.size).toBe(500);
  });
});

describe("isValidShortId", () => {
  test("accepts exactly 7 alphanumeric characters", () => {
    expect(isValidShortId("aB3xK9m")).toBe(true);
    expect(isValidShortId("0000000")).toBe(true);
  });

  test("rejects wrong lengths", () => {
    expect(isValidShortId("abc")).toBe(false);
    expect(isValidShortId("abcdefgh")).toBe(false);
    expect(isValidShortId("")).toBe(false);
  });

  test("rejects non-alphanumeric characters", () => {
    expect(isValidShortId("aB3-K9m")).toBe(false);
    expect(isValidShortId("aB3 K9m")).toBe(false);
    expect(isValidShortId("aB3_K9m")).toBe(false);
  });
});

describe("extractShortIdFromSlug", () => {
  test("extracts the id from a title slug", () => {
    expect(extractShortIdFromSlug("my-blog-post-aB3xK9m")).toBe("aB3xK9m");
  });

  test("returns null when the last segment is not a valid id", () => {
    expect(extractShortIdFromSlug("my-blog-post-short")).toBeNull();
  });

  test("returns null when there is no separator", () => {
    expect(extractShortIdFromSlug("aB3xK9m")).toBeNull();
  });

  test("handles a slug that is only a title and id", () => {
    expect(extractShortIdFromSlug("title-1234567")).toBe("1234567");
  });
});

describe("buildSlug", () => {
  test("combines a slugified title with the short id", () => {
    expect(buildSlug("My Blog Post", "aB3xK9m")).toBe("my-blog-post-aB3xK9m");
  });

  test("strips special characters from the title", () => {
    expect(buildSlug("Hello, World!", "1234567")).toBe("hello-world-1234567");
  });

  test("round-trips with extractShortIdFromSlug", () => {
    const id = generateShortId();
    const slug = buildSlug("Some Great Title", id);
    expect(extractShortIdFromSlug(slug)).toBe(id);
  });
});
