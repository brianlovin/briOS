import { describe, expect, test } from "bun:test";

import { activityGlobeMarkerIdForLocation, activityGlobeMarkers } from "./activity-geo";
import {
  bindableGlobeMarkers,
  GLOBE_HANG,
  globeAimVisibleBias,
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
    const markers = activityGlobeMarkers([
      { meta: { latitude: 37.77, longitude: -122.42 } },
      { meta: { latitude: 51.51, longitude: -0.13 } },
    ]);
    expect(activityGlobeMarkerIdForLocation({ lat: 37.81, lng: -122.39 }, markers)).toBe(
      markers[0]?.id,
    );
    expect(activityGlobeMarkerIdForLocation({ lat: 0, lng: 0 }, markers)).toBeUndefined();
  });
});
