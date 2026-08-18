import { describe, expect, test } from "bun:test";

import {
  cobeMarkerStyle,
  DEFAULT_ACTIVITY_GLOBE_CONFIG,
  globeCobeOptions,
  globeThemeColors,
  markerAgeOpacity,
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

  test("markerAgeOpacity drops 20% per older marker", () => {
    expect(markerAgeOpacity(0, 0.2)).toBe(1);
    expect(markerAgeOpacity(1, 0.2)).toBeCloseTo(0.8);
    expect(markerAgeOpacity(4, 0.2)).toBeCloseTo(0.2);
    expect(markerAgeOpacity(5, 0.2)).toBe(0);
  });
});
