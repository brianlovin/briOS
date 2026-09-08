import { describe, expect, test } from "bun:test";

import { individualLikesKey } from "@/lib/hooks/useLikes";

describe("individualLikesKey", () => {
  test("does not register an individual GET when BatchLikesContext is present", () => {
    expect(individualLikesKey("page-1", true)).toBeNull();
  });

  test("uses the individual likes key when there is no batch provider", () => {
    expect(individualLikesKey("page-1", false)).toBe("/api/likes/page-1");
  });

  test("does not register a key without a page id", () => {
    expect(individualLikesKey("", false)).toBeNull();
    expect(individualLikesKey("", true)).toBeNull();
  });
});
