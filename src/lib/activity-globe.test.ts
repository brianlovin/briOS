import { describe, expect, test } from "bun:test";

import { activityGlobeMarkerIdForLocation, activityRecentGlobeMarkers } from "./activity-geo";
import {
  bindableGlobeMarkers,
  GLOBE_HANG,
  GLOBE_MAP_DOT_CHORD,
  GLOBE_MESH_RADIUS,
  globeAimVisibleBias,
  globeMapDotPx,
  globeMarkerFacing,
  latLngToGlobePose,
  latLngToVisibleGlobePose,
  projectGlobeMarker,
  shortestAngleDelta,
} from "./activity-globe";

describe("latLngToGlobePose", () => {
  test("uses the COBE phi/theta convention", () => {
    const origin = latLngToGlobePose(0, 0);
    expect(origin.phi).toBeCloseTo(Math.PI - (0 - Math.PI / 2));
    expect(origin.theta).toBeCloseTo(0);

    const sf = latLngToGlobePose(37.77, -122.42);
    expect(sf.phi).toBeCloseTo(Math.PI - ((-122.42 * Math.PI) / 180 - Math.PI / 2));
    expect(sf.theta).toBeCloseTo((37.77 * Math.PI) / 180);
  });

  test("visible aim pose sits the location in the unclipped top-left of the mesh", () => {
    const visibleEdge = 1 - GLOBE_HANG;
    const samples: Array<[number, number]> = [
      [0, 0],
      [37.77, -122.42],
      [-33.87, 151.21],
      [51.51, -0.13],
    ];
    for (const [lat, lng] of samples) {
      const { phi, theta } = latLngToVisibleGlobePose(lat, lng);
      const projected = projectGlobeMarker(lat, lng, phi, theta);
      expect(projected.x).toBeLessThan(0.5);
      expect(projected.y).toBeLessThan(0.5);
      expect(projected.x).toBeGreaterThan(0.25);
      expect(projected.y).toBeGreaterThan(0.25);
      expect(projected.x).toBeLessThan(visibleEdge);
      expect(projected.y).toBeLessThan(visibleEdge);
      expect(projected.facing).toBeGreaterThan(0.8);
    }
  });

  test("visible bias is toward decreasing phi and theta", () => {
    const { dPhi, dTheta } = globeAimVisibleBias();
    expect(dPhi).toBeLessThan(0);
    expect(dTheta).toBeLessThan(0);
  });

  test("aimed pose puts the location at the camera apex", () => {
    const samples: Array<[number, number]> = [
      [0, 0],
      [37.77, -122.42],
      [-33.87, 151.21],
      [51.51, -0.13],
    ];
    for (const [lat, lng] of samples) {
      const { phi, theta } = latLngToGlobePose(lat, lng);
      expect(globeMarkerFacing(lat, lng, phi, theta)).toBeCloseTo(1);
      const projected = projectGlobeMarker(lat, lng, phi, theta);
      expect(projected.x).toBeCloseTo(0.5);
      expect(projected.y).toBeCloseTo(0.5);
      expect(projected.facing).toBeCloseTo(1);
    }
  });
});

describe("shortestAngleDelta", () => {
  test("takes the shortest path around the circle", () => {
    expect(shortestAngleDelta(0, 0.2)).toBeCloseTo(0.2);
    expect(shortestAngleDelta(0, -0.2)).toBeCloseTo(-0.2);
    expect(shortestAngleDelta(0.1, Math.PI * 2 - 0.1)).toBeCloseTo(-0.2);
    expect(shortestAngleDelta(Math.PI * 2 - 0.1, 0.1)).toBeCloseTo(0.2);
    expect(Math.abs(shortestAngleDelta(0, Math.PI))).toBeCloseTo(Math.PI);
  });

  test("unwraps an accumulated idle-spin phi toward a canonical target", () => {
    const target = latLngToGlobePose(0, 0).phi;
    const spun = target + Math.PI * 2 * 3 + 0.4;
    expect(shortestAngleDelta(spun, target)).toBeCloseTo(-0.4);
  });
});

describe("globeMapDotPx", () => {
  test("matches a facing-center COBE land dot on the mesh", () => {
    expect(globeMapDotPx(512)).toBeCloseTo(GLOBE_MAP_DOT_CHORD * GLOBE_MESH_RADIUS * 512);
    expect(globeMapDotPx(1000)).toBeGreaterThan(globeMapDotPx(512));
    expect(globeMapDotPx(512, 1.2)).toBeCloseTo(globeMapDotPx(512) * 1.2);
    expect(globeMapDotPx(0)).toBe(2);
  });
});

describe("bindableGlobeMarkers", () => {
  test("keeps ids and locations so COBE can bind CSS anchors", () => {
    const markers = bindableGlobeMarkers([
      { id: "sf", location: [37.77, -122.42], size: 0.02 },
    ]);
    expect(markers).toEqual([{ id: "sf", location: [37.77, -122.42], size: 0 }]);
  });
});

describe("activityGlobeMarkerIdForLocation", () => {
  test("matches a nearby visit to the existing 0.1° bucket", () => {
    const markers = activityRecentGlobeMarkers(
      [
        { id: "sf", meta: { latitude: 37.77, longitude: -122.42 } },
        { id: "ldn", meta: { latitude: 51.51, longitude: -0.13 } },
      ],
      5,
    );
    expect(activityGlobeMarkerIdForLocation({ lat: 37.81, lng: -122.39 }, markers)).toBe(
      markers[0]?.id,
    );
    expect(activityGlobeMarkerIdForLocation({ lat: 0, lng: 0 }, markers)).toBeUndefined();
  });
});

describe("activityRecentGlobeMarkers", () => {
  test("keeps the newest unique locations and ages the rest", () => {
    const markers = activityRecentGlobeMarkers(
      [
        { id: "tokyo", meta: { latitude: 35.68, longitude: 139.69 } },
        { id: "tokyo-again", meta: { latitude: 35.68, longitude: 139.69 } },
        { id: "london", meta: { latitude: 51.51, longitude: -0.13 } },
        { id: "sf", meta: { latitude: 37.77, longitude: -122.42 } },
        { id: "sydney", meta: { latitude: -33.87, longitude: 151.21 } },
      ],
      3,
    );
    expect(markers.map((marker) => marker.eventId)).toEqual(["tokyo", "london", "sf"]);
    expect(markers.map((marker) => marker.age)).toEqual([0, 1, 2]);
  });

  test("places GitHub and Notion publish events in San Francisco", () => {
    const markers = activityRecentGlobeMarkers(
      [
        { id: "pr", type: "pr_merged", source: "github" },
        { id: "stack", type: "stack_added", source: "brios" },
        { id: "tokyo", meta: { latitude: 35.68, longitude: 139.69 } },
      ],
      5,
    );
    expect(markers).toHaveLength(2);
    expect(markers[0]?.location).toEqual([37.77, -122.42]);
    expect(markers[0]?.eventId).toBe("pr");
    expect(markers[1]?.location).toEqual([35.68, 139.69]);
  });
});
