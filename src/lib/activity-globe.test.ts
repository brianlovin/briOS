import { describe, expect, test } from "bun:test";

import { activityGlobeMarkerIdForLocation, activityRecentGlobeMarkers } from "./activity-geo";
import {
  cobeCssPxForSize,
  cobeGpuMarkers,
  cobeSizeForCssPx,
  cobeWebGLMarkers,
  GLOBE_DEVICE_PIXEL_RATIO_CAP,
  GLOBE_HANG,
  GLOBE_MAP_DOT_CHORD,
  GLOBE_MARKER_TARGET_CSS_PX,
  GLOBE_MESH_MIN,
  GLOBE_MESH_RADIUS,
  globeAimVisibleBias,
  globeDevicePixelRatio,
  globeMapDotPx,
  globeMarkerFacing,
  globeMarkersChanged,
  globeMarkerSizingForMesh,
  isGlobePerfQuery,
  latLngToGlobePose,
  latLngToVisibleGlobePose,
  projectGlobeMarker,
  shortestAngleDelta,
  shouldCommitCobeRootStyle,
  shouldRunGlobeLoop,
} from "./activity-globe";
import { DEFAULT_ACTIVITY_GLOBE_CONFIG, markerSizeForAge } from "./activity-globe-config";

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

describe("globeDevicePixelRatio", () => {
  test("matches production: cap at 2, pass through 1x and 2x", () => {
    expect(GLOBE_DEVICE_PIXEL_RATIO_CAP).toBe(2);
    expect(globeDevicePixelRatio(1)).toBe(1);
    expect(globeDevicePixelRatio(2)).toBe(2);
    expect(globeDevicePixelRatio(3)).toBe(2);
    expect(globeDevicePixelRatio(0)).toBe(1);
  });
});

describe("cobeSizeForCssPx", () => {
  test("converts the old 12px + glow target through Cobe's mesh-relative size", () => {
    expect(cobeCssPxForSize(cobeSizeForCssPx(18, 692), 692)).toBeCloseTo(18);
    expect(cobeSizeForCssPx(GLOBE_MARKER_TARGET_CSS_PX, 692)).toBeGreaterThan(0.045);
    expect(cobeSizeForCssPx(GLOBE_MARKER_TARGET_CSS_PX, 692)).toBeLessThan(0.07);
    expect(cobeSizeForCssPx(GLOBE_MARKER_TARGET_CSS_PX, 900)).toBeLessThan(
      cobeSizeForCssPx(GLOBE_MARKER_TARGET_CSS_PX, GLOBE_MESH_MIN),
    );
  });

  test("globeMarkerSizingForMesh keeps newest at the CSS target and floors the trail", () => {
    const sizing = globeMarkerSizingForMesh(692, DEFAULT_ACTIVITY_GLOBE_CONFIG);
    expect(cobeCssPxForSize(sizing.markerBaseSize, 692)).toBeCloseTo(GLOBE_MARKER_TARGET_CSS_PX);
    expect(markerSizeForAge(0, sizing)).toBeCloseTo(sizing.markerBaseSize);
    expect(markerSizeForAge(9, sizing)).toBeGreaterThanOrEqual(sizing.markerBaseSize * 0.5);
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

describe("globeMarkersChanged", () => {
  const sf = { id: "sf", location: [37.77, -122.42] as [number, number], size: 0.02 };
  const ldn = { id: "ldn", location: [51.51, -0.13] as [number, number], size: 0.018 };

  test("is a no-op for the same ref or identical id/location/size", () => {
    const markers = [sf];
    expect(globeMarkersChanged(markers, markers)).toBe(false);
    expect(globeMarkersChanged([sf], [{ ...sf, location: [37.77, -122.42] }])).toBe(false);
  });

  test("detects identity, location, size, and color changes", () => {
    expect(globeMarkersChanged(null, [sf])).toBe(true);
    expect(globeMarkersChanged([sf], [ldn])).toBe(true);
    expect(globeMarkersChanged([sf], [{ ...sf, size: 0.04 }])).toBe(true);
    expect(globeMarkersChanged([sf], [{ ...sf, location: [37.8, -122.42] }])).toBe(true);
    expect(globeMarkersChanged([sf], [{ ...sf, color: [1, 0, 0] }])).toBe(true);
  });
});

describe("shouldRunGlobeLoop", () => {
  test("pauses when the document is hidden or the globe is off-screen", () => {
    expect(shouldRunGlobeLoop({ visibilityState: "visible", isIntersecting: true })).toBe(true);
    expect(shouldRunGlobeLoop({ visibilityState: "hidden", isIntersecting: true })).toBe(false);
    expect(shouldRunGlobeLoop({ visibilityState: "visible", isIntersecting: false })).toBe(false);
  });
});

describe("cobeWebGLMarkers", () => {
  test("keeps ids and WebGL sizes greater than zero", () => {
    const recent = activityRecentGlobeMarkers(
      [
        { id: "tokyo", meta: { latitude: 35.68, longitude: 139.69 } },
        { id: "london", meta: { latitude: 51.51, longitude: -0.13 } },
      ],
      5,
    );
    const markers = cobeWebGLMarkers(recent, DEFAULT_ACTIVITY_GLOBE_CONFIG, null);
    expect(markers.length).toBe(2);
    expect(markers.every((marker) => marker.id && marker.size > 0)).toBe(true);
    expect(cobeGpuMarkers(markers).every((marker) => !("id" in marker) && marker.size > 0)).toBe(
      true,
    );
  });

  test("enlarges the focused event without changing other sizes", () => {
    const recent = activityRecentGlobeMarkers(
      [
        { id: "tokyo", meta: { latitude: 35.68, longitude: 139.69 } },
        { id: "london", meta: { latitude: 51.51, longitude: -0.13 } },
      ],
      5,
    );
    const idle = cobeWebGLMarkers(recent, DEFAULT_ACTIVITY_GLOBE_CONFIG, null);
    const focused = cobeWebGLMarkers(recent, DEFAULT_ACTIVITY_GLOBE_CONFIG, "tokyo");
    expect(focused[0]?.size).toBeGreaterThan(idle[0]?.size ?? 0);
    expect(focused[1]?.size).toBe(idle[1]?.size);
    expect(focused[0]?.color).toBeDefined();
  });
});

describe("isGlobePerfQuery", () => {
  test("is only on when globePerf=1", () => {
    expect(isGlobePerfQuery("?globePerf=1")).toBe(true);
    expect(isGlobePerfQuery("?globePerf=0")).toBe(false);
    expect(isGlobePerfQuery("")).toBe(false);
  });
});

describe("shouldCommitCobeRootStyle", () => {
  test("skips identical and empty :root writes", () => {
    expect(shouldCommitCobeRootStyle(":root{}", "")).toBe(false);
    expect(shouldCommitCobeRootStyle("", "")).toBe(false);
    expect(shouldCommitCobeRootStyle(":root{--cobe-visible-a:N;}", "")).toBe(true);
    expect(
      shouldCommitCobeRootStyle(":root{--cobe-visible-a:N;}", ":root{--cobe-visible-a:N;}"),
    ).toBe(false);
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
    expect(markers.every((marker) => marker.size > 0)).toBe(true);
    expect(markers[0]?.size).toBeGreaterThan(markers[1]?.size ?? 0);
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
