import { describe, expect, test } from "bun:test";

import {
  cobeMarkerStyle,
  DEFAULT_ACTIVITY_GLOBE_CONFIG,
  globeCobeOptions,
  globeThemeColors,
  markerAgeScale,
  markerDotPxForAge,
  markerDotPxForSize,
  markerSizeFromCount,
} from "./activity-globe-config";

describe("activity-globe-config", () => {
  test("markerSizeFromCount grows with visit count and caps", () => {
    const cfg = DEFAULT_ACTIVITY_GLOBE_CONFIG;
    expect(markerSizeFromCount(1, cfg)).toBeCloseTo(cfg.markerBaseSize);
    expect(markerSizeFromCount(4, cfg)).toBeGreaterThan(markerSizeFromCount(1, cfg));
    expect(markerSizeFromCount(10_000, cfg)).toBeCloseTo(cfg.markerMaxSize);
  });

  test("markerDotPxForSize scales the CSS dot with visit count", () => {
    const cfg = DEFAULT_ACTIVITY_GLOBE_CONFIG;
    expect(markerDotPxForSize(cfg.markerBaseSize, cfg)).toBeCloseTo(cfg.markerDotPx);
    expect(markerDotPxForSize(cfg.markerBaseSize * 2, cfg)).toBeCloseTo(cfg.markerDotPx * 2);
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

  test("cobeMarkerStyle matches the official visibility recipe", () => {
    const style = cobeMarkerStyle("sf", DEFAULT_ACTIVITY_GLOBE_CONFIG);
    expect(style.positionAnchor).toBe("--cobe-sf");
    expect(style.left).toBe("anchor(center)");
    expect(style.top).toBe("anchor(center)");
    expect(style.opacity).toBe("var(--cobe-visible-sf, 0)");
    expect(style.filter).toBe("blur(calc((1 - var(--cobe-visible-sf, 0)) * 8px))");
    expect(String(style.transition)).toContain("opacity 300ms");
  });

  test("markerAgeScale shrinks ~10% per older marker", () => {
    expect(markerAgeScale(0, 0.1)).toBe(1);
    expect(markerAgeScale(1, 0.1)).toBeCloseTo(0.9);
    expect(markerAgeScale(2, 0.1)).toBeCloseTo(0.81);
    expect(markerAgeScale(9, 0.1)).toBeCloseTo(0.9 ** 9);
    expect(markerAgeScale(1, DEFAULT_ACTIVITY_GLOBE_CONFIG.markerAgeShrink)).toBeCloseTo(0.9);
  });

  test("markerDotPxForAge never shrinks below the land-dot floor", () => {
    const cfg = DEFAULT_ACTIVITY_GLOBE_CONFIG;
    expect(markerDotPxForAge(0, cfg, 5)).toBeCloseTo(cfg.markerDotPx);
    expect(markerDotPxForAge(9, cfg, 5)).toBe(5);
    expect(markerDotPxForAge(9, cfg, 0)).toBeCloseTo(cfg.markerDotPx * 0.9 ** 9);
  });
});
