import { describe, expect, test } from "bun:test";

import { ACTIVITY_REGISTRY, isRegisteredActivityEvent } from "@/lib/activity-registry";

describe("activity registry", () => {
  test("allows first-party brios types and the listed external pairs", () => {
    expect(isRegisteredActivityEvent("brios", "visit")).toBe(true);
    expect(isRegisteredActivityEvent("brios", "like")).toBe(true);
    expect(isRegisteredActivityEvent("shiori", "link_saved")).toBe(true);
    expect(isRegisteredActivityEvent("shiori", "link_clicked")).toBe(true);
    expect(isRegisteredActivityEvent("shiori", "download")).toBe(true);
    expect(isRegisteredActivityEvent("tax-ui", "visit")).toBe(true);
    expect(isRegisteredActivityEvent("tax-ui", "download")).toBe(true);
    expect(isRegisteredActivityEvent("staff-design", "visit")).toBe(true);
    expect(isRegisteredActivityEvent("design-details", "visit")).toBe(true);
  });

  test("registers GitHub PR types on brios and github", () => {
    expect(isRegisteredActivityEvent("brios", "pr_opened")).toBe(true);
    expect(isRegisteredActivityEvent("brios", "pr_merged")).toBe(true);
    expect(isRegisteredActivityEvent("brios", "repo_starred")).toBe(true);
    expect(isRegisteredActivityEvent("github", "pr_opened")).toBe(true);
    expect(isRegisteredActivityEvent("github", "pr_merged")).toBe(true);
    expect(isRegisteredActivityEvent("github", "repo_starred")).toBe(true);
    expect(isRegisteredActivityEvent("brios", "github")).toBe(false);
    expect(isRegisteredActivityEvent("github", "visit")).toBe(false);
  });

  test("rejects impersonation and unknown types", () => {
    expect(isRegisteredActivityEvent("staff-design", "like")).toBe(false);
    expect(isRegisteredActivityEvent("evil", "visit")).toBe(false);
    expect(isRegisteredActivityEvent("brios", "weird_new_thing")).toBe(false);
    expect(isRegisteredActivityEvent("design-details", "download")).toBe(false);
    expect(ACTIVITY_REGISTRY["staff-design"]).toEqual(["visit"]);
  });
});
