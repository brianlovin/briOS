import { describe, expect, test } from "bun:test";

import { shouldLockBody } from "@/lib/body-lock";

describe("shouldLockBody", () => {
  test("locks when list-detail is mounted", () => {
    expect(shouldLockBody({ listDetailMounted: true, overlayOpen: false })).toBe(true);
  });

  test("locks when the nav overlay is open", () => {
    expect(shouldLockBody({ listDetailMounted: false, overlayOpen: true })).toBe(true);
  });

  test("keeps the lock after the overlay closes on a list-detail route", () => {
    expect(shouldLockBody({ listDetailMounted: true, overlayOpen: true })).toBe(true);
    expect(shouldLockBody({ listDetailMounted: true, overlayOpen: false })).toBe(true);
  });

  test("unlocks when neither owner needs it", () => {
    expect(shouldLockBody({ listDetailMounted: false, overlayOpen: false })).toBe(false);
  });
});
