import { describe, expect, test } from "bun:test";

import {
  DEFAULT_ACTIVITY_GLOBE_CONFIG,
  focusMarkerColor,
  globeCobeOptions,
  globeThemeColors,
  markerAgeScale,
  markerSizeForAge,
  markerSizeFromCount,
} from "./activity-globe-config";

describe("activity-globe-config", () => {
  test("markerSizeFromCount grows with visit count and caps", () => {
    const cfg = DEFAULT_ACTIVITY_GLOBE_CONFIG;
    expect(markerSizeFromCount(1, cfg)).toBeCloseTo(cfg.markerBaseSize);
    expect(markerSizeFromCount(4, cfg)).toBeGreaterThan(markerSizeFromCount(1, cfg));
    expect(markerSizeFromCount(10_000, cfg)).toBeCloseTo(cfg.markerMaxSize);
  });

  test("globeThemeColors and globeCobeOptions switch light and dark palettes", () => {
    const light = globeThemeColors(false, DEFAULT_ACTIVITY_GLOBE_CONFIG);
    const dark = globeThemeColors(true, DEFAULT_ACTIVITY_GLOBE_CONFIG);
    expect(light.dark).toBe(0);
    expect(dark.dark).toBe(1);
    expect(light.baseColor).toEqual(DEFAULT_ACTIVITY_GLOBE_CONFIG.lightBaseColor);
    expect(dark.baseColor).toEqual(DEFAULT_ACTIVITY_GLOBE_CONFIG.darkBaseColor);
    expect(globeCobeOptions(true, DEFAULT_ACTIVITY_GLOBE_CONFIG).glowColor).toEqual(
      DEFAULT_ACTIVITY_GLOBE_CONFIG.darkGlowColor,
    );
  });

  test("markerAgeScale shrinks ~10% per older marker", () => {
    expect(markerAgeScale(0, 0.1)).toBe(1);
    expect(markerAgeScale(1, 0.1)).toBeCloseTo(0.9);
    expect(markerAgeScale(2, 0.1)).toBeCloseTo(0.81);
    expect(markerAgeScale(9, 0.1)).toBeCloseTo(0.9 ** 9);
    expect(markerAgeScale(1, DEFAULT_ACTIVITY_GLOBE_CONFIG.markerAgeShrink)).toBeCloseTo(0.9);
  });

  test("markerSizeForAge shrinks from markerBaseSize and floors the trail", () => {
    const cfg = DEFAULT_ACTIVITY_GLOBE_CONFIG;
    expect(markerSizeForAge(0, cfg)).toBeCloseTo(cfg.markerBaseSize);
    expect(markerSizeForAge(1, cfg)).toBeCloseTo(cfg.markerBaseSize * 0.9);
    expect(markerSizeForAge(2, cfg)).toBeGreaterThan(0);
    // Newest discs must match the old ~12px CSS + glow weight.
    expect(markerSizeForAge(0, cfg)).toBeGreaterThanOrEqual(0.06);
    expect(markerSizeForAge(9, cfg)).toBeGreaterThanOrEqual(cfg.markerBaseSize * 0.5);
  });

  test("default mapSamples stays in the 12k–14k band", () => {
    expect(DEFAULT_ACTIVITY_GLOBE_CONFIG.mapSamples).toBeGreaterThanOrEqual(12000);
    expect(DEFAULT_ACTIVITY_GLOBE_CONFIG.mapSamples).toBeLessThanOrEqual(14000);
  });

  test("focusMarkerColor stays in 0–1 and is brighter than the base orange", () => {
    const focused = focusMarkerColor(DEFAULT_ACTIVITY_GLOBE_CONFIG.markerColor);
    expect(focused.every((channel) => channel >= 0 && channel <= 1)).toBe(true);
    expect(focused[0]).toBeGreaterThan(DEFAULT_ACTIVITY_GLOBE_CONFIG.markerColor[0]);
  });
});
