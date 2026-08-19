import { describe, expect, test } from "bun:test";

import { activityEventLocation } from "./activity-geo";
import {
  clusterVisitLocationRuns,
  rollupActivityEvents,
  visitClusterSourceRuns,
} from "./activity-rollup";
import {
  resetSandboxIds,
  SANDBOX_PAGES,
  SANDBOX_PLACES,
  SANDBOX_SCENARIOS,
  sandboxLike,
  sandboxMysteriousVisit,
  sandboxPullMerged,
  sandboxSiteAdded,
  sandboxStackAdded,
  sandboxVisit,
  stampBatch,
} from "./activity-sandbox";
import { isActivitySandboxPath, visitLocationClusterKey } from "./activity-shared";

describe("isActivitySandboxPath", () => {
  test("matches the sandbox route only", () => {
    expect(isActivitySandboxPath("/activity/sandbox")).toBe(true);
    expect(isActivitySandboxPath("/activity/sandbox/")).toBe(true);
    expect(isActivitySandboxPath("/activity")).toBe(false);
    expect(isActivitySandboxPath("/activity/nested")).toBe(false);
  });
});

describe("sandbox fixtures", () => {
  test("visits include geo meta so the globe can place a dot", () => {
    resetSandboxIds();
    const event = sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.writing);
    expect(event.type).toBe("visit");
    expect(event.meta?.city).toBe("San Francisco");
    expect(event.meta?.latitude).toBe(37.77);
    expect(event.meta?.longitude).toBe(-122.42);
    expect(activityEventLocation(event)).toEqual({ lat: 37.77, lng: -122.42 });
    expect(visitLocationClusterKey(event)).toBe("san francisco, california");
  });

  test("mysterious visits have no globe location", () => {
    const event = sandboxMysteriousVisit();
    expect(activityEventLocation(event)).toBeUndefined();
    expect(visitLocationClusterKey(event)).toBe("a mysterious place on earth");
  });

  test("GitHub and Notion publishes pin to San Francisco", () => {
    expect(activityEventLocation(sandboxPullMerged())).toEqual({ lat: 37.77, lng: -122.42 });
    expect(activityEventLocation(sandboxStackAdded())).toEqual({ lat: 37.77, lng: -122.42 });
    expect(activityEventLocation(sandboxSiteAdded())).toEqual({ lat: 37.77, lng: -122.42 });
  });

  test("stampBatch is newest-first", () => {
    const events = stampBatch([
      sandboxVisit(SANDBOX_PLACES.sf, SANDBOX_PAGES.ama),
      sandboxVisit(SANDBOX_PLACES.london, SANDBOX_PAGES.home),
    ]);
    expect(Date.parse(events[0]!.ts)).toBeGreaterThan(Date.parse(events[1]!.ts));
  });
});

describe("sandbox scenarios", () => {
  test("SF cluster rolls into one location block with a rail", () => {
    const items = clusterVisitLocationRuns(
      rollupActivityEvents(SANDBOX_SCENARIOS["sf-cluster"].build()),
    );
    expect(items).toHaveLength(1);
    expect(items[0]?.type).toBe("visit-cluster");
    if (items[0]?.type === "visit-cluster") {
      expect(items[0].actions.length).toBeGreaterThan(1);
      expect(items[0].locationHeader).toContain("San Francisco");
    }
  });

  test("same-page visits stack into one ×N row", () => {
    const stacks = rollupActivityEvents(SANDBOX_SCENARIOS["same-page-rollup"].build());
    expect(stacks).toHaveLength(1);
    expect(stacks[0]?.count).toBe(4);
  });

  test("globe burst covers many distinct coordinates", () => {
    const events = SANDBOX_SCENARIOS["globe-burst"].build();
    const coords = new Set(
      events.map((event) => {
        const location = activityEventLocation(event);
        return location ? `${location.lat},${location.lng}` : "";
      }),
    );
    expect(coords.size).toBe(events.length);
  });

  test("property hop stays one location cluster with two source runs", () => {
    const items = clusterVisitLocationRuns(
      rollupActivityEvents(SANDBOX_SCENARIOS["property-hop"].build()),
    );
    expect(items).toHaveLength(1);
    expect(items[0]?.type).toBe("visit-cluster");
    if (items[0]?.type !== "visit-cluster") return;
    expect(visitClusterSourceRuns(items[0].actions).map((run) => run.source)).toEqual([
      "brios",
      "staff-design",
    ]);
  });

  test("interrupted cluster splits SF visits around a like", () => {
    const items = clusterVisitLocationRuns(
      rollupActivityEvents(SANDBOX_SCENARIOS.interrupt.build()),
    );
    expect(items.map((item) => item.type)).toEqual(["visit-cluster", "row", "visit-cluster"]);
  });

  test("likes stack together", () => {
    const stacks = rollupActivityEvents([
      sandboxLike("Cursor", "/stack"),
      sandboxLike("Listening", "/listening"),
    ]);
    expect(stacks).toHaveLength(1);
    expect(stacks[0]?.likeTargets?.map((target) => target.title)).toEqual(["Cursor", "Listening"]);
  });
});
