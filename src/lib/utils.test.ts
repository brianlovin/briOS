import { describe, expect, test } from "bun:test";

import { cn, slugify, stripHtmlTags } from "@/lib/utils";

describe("cn", () => {
  test("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  test("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  test("supports conditional object syntax", () => {
    expect(cn("a", { b: true, c: false })).toBe("a b");
  });

  test("dedupes conflicting tailwind classes, keeping the last", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  test("returns an empty string with no inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("slugify", () => {
  test("lowercases and hyphenates spaces", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  test("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  test("collapses spaces, underscores, and multiple hyphens", () => {
    expect(slugify("a   b__c--d")).toBe("a-b-c-d");
  });

  test("trims leading and trailing whitespace and hyphens", () => {
    expect(slugify("  --Hello--  ")).toBe("hello");
  });

  test("keeps existing numbers", () => {
    expect(slugify("Top 10 Tips")).toBe("top-10-tips");
  });

  test("returns an empty string when nothing usable remains", () => {
    expect(slugify("!!!")).toBe("");
    expect(slugify("")).toBe("");
  });
});

describe("stripHtmlTags", () => {
  test("removes simple tags", () => {
    expect(stripHtmlTags("<p>Hello</p>")).toBe("Hello");
  });

  test("removes multiple and nested tags", () => {
    expect(stripHtmlTags("<div><span>Hi</span> there</div>")).toBe("Hi there");
  });

  test("removes deeply nested tags", () => {
    expect(stripHtmlTags("<b><i>nested</i></b>")).toBe("nested");
  });

  test("leaves plain text untouched", () => {
    expect(stripHtmlTags("no tags here")).toBe("no tags here");
  });

  test("handles an empty string", () => {
    expect(stripHtmlTags("")).toBe("");
  });
});
