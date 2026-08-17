import { describe, expect, test } from "bun:test";

import { globeMarkerFacing, latLngToGlobePose, shortestAngleDelta } from "./activity-globe";

describe("latLngToGlobePose", () => {
  test("uses the COBE phi/theta convention", () => {
    const origin = latLngToGlobePose(0, 0);
    expect(origin.phi).toBeCloseTo(Math.PI - (0 - Math.PI / 2));
    expect(origin.theta).toBeCloseTo(0);

    const sf = latLngToGlobePose(37.77, -122.42);
    expect(sf.phi).toBeCloseTo(Math.PI - ((-122.42 * Math.PI) / 180 - Math.PI / 2));
    expect(sf.theta).toBeCloseTo((37.77 * Math.PI) / 180);
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
