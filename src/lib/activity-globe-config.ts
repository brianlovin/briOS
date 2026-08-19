/** Tunable COBE + CSS bindable-marker settings for the activity globe. */

export type RgbTriplet = [number, number, number];

export type ActivityGlobeConfig = {
  diffuse: number;
  mapSamples: number;
  mapBrightness: number;
  mapBaseBrightness: number;
  mapBrightnessDark: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
  markerElevation: number;

  lightBaseColor: RgbTriplet;
  lightGlowColor: RgbTriplet;
  darkBaseColor: RgbTriplet;
  darkGlowColor: RgbTriplet;
  markerColor: RgbTriplet;

  /** CSS dot scale from visit-count buckets. */
  markerBaseSize: number;
  markerSizePerLog: number;
  markerMaxSize: number;

  /** Bindable CSS dots — same recipe as https://cobe.vercel.app */
  markerDotPx: number;
  markerBlurPx: number;
  markerFadeMs: number;
  /** How many recent unique locations stay on the globe. */
  markerRecentCount: number;
  /** Size drop per older marker (0.1 = each step is 90% of the one before). */
  markerAgeShrink: number;
  focusPulseScale: number;
  focusMs: number;
};

export function markerAgeScale(age: number, shrink: number): number {
  if (age < 0) return 0;
  if (shrink <= 0) return 1;
  if (shrink >= 1) return age === 0 ? 1 : 0;
  return (1 - shrink) ** age;
}

/** Newest is `markerDotPx`; each older step shrinks, never below the land-dot floor. */
export function markerDotPxForAge(
  age: number,
  config: Pick<ActivityGlobeConfig, "markerDotPx" | "markerAgeShrink">,
  minPx: number,
): number {
  const scaled = config.markerDotPx * markerAgeScale(age, config.markerAgeShrink);
  const floor = Number.isFinite(minPx) ? Math.max(0, minPx) : 0;
  return Math.max(floor, scaled);
}

export function markerDotPxForSize(
  size: number,
  config: Pick<ActivityGlobeConfig, "markerBaseSize" | "markerDotPx">,
): number {
  if (config.markerBaseSize <= 0) return config.markerDotPx;
  return config.markerDotPx * (size / config.markerBaseSize);
}

export const DEFAULT_ACTIVITY_GLOBE_CONFIG: ActivityGlobeConfig = {
  diffuse: 0.6,
  mapSamples: 19000,
  mapBrightness: 3.1,
  mapBaseBrightness: 0,
  mapBrightnessDark: 6,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  opacity: 1,
  markerElevation: 0,

  lightBaseColor: [1, 1, 1],
  lightGlowColor: [0.95, 0.95, 0.95],
  darkBaseColor: [0.3, 0.3, 0.3],
  darkGlowColor: [0.12, 0.12, 0.12],
  markerColor: [252 / 255, 83 / 255, 42 / 255],

  markerBaseSize: 0.018,
  markerSizePerLog: 0.007,
  markerMaxSize: 0.05,

  markerDotPx: 12,
  markerBlurPx: 8,
  markerFadeMs: 300,
  markerRecentCount: 10,
  markerAgeShrink: 0.1,
  focusPulseScale: 0.75,
  focusMs: 1400,
};

export function markerSizeFromCount(
  count: number,
  config: Pick<ActivityGlobeConfig, "markerBaseSize" | "markerSizePerLog" | "markerMaxSize">,
): number {
  return Math.min(
    config.markerMaxSize,
    config.markerBaseSize + Math.log2(Math.max(1, count)) * config.markerSizePerLog,
  );
}

export function globeThemeColors(
  isDark: boolean,
  config: ActivityGlobeConfig,
): { baseColor: RgbTriplet; glowColor: RgbTriplet; mapBrightness: number; dark: number } {
  return {
    baseColor: isDark ? config.darkBaseColor : config.lightBaseColor,
    glowColor: isDark ? config.darkGlowColor : config.lightGlowColor,
    mapBrightness: isDark ? config.mapBrightnessDark : config.mapBrightness,
    dark: isDark ? 1 : 0,
  };
}

/** COBE create/update fields that come from the tunable config. */
export function globeCobeOptions(isDark: boolean, config: ActivityGlobeConfig) {
  const theme = globeThemeColors(isDark, config);
  return {
    dark: theme.dark,
    diffuse: config.diffuse,
    mapSamples: config.mapSamples,
    mapBrightness: theme.mapBrightness,
    mapBaseBrightness: config.mapBaseBrightness,
    baseColor: theme.baseColor,
    markerColor: config.markerColor,
    glowColor: theme.glowColor,
    markerElevation: config.markerElevation,
    scale: config.scale,
    offset: [config.offsetX, config.offsetY] as [number, number],
    opacity: config.opacity,
  };
}

/**
 * Rounded `Npx` string for inline styles.
 *
 * `**` is not correctly rounded, so the SSR runtime and the browser can disagree
 * in the last bit: `12 * 0.9 ** 4` is `7.8732000000000015` in Bun/Node and
 * `7.873200000000001` in Chrome. React hydration compares the raw `style`
 * attribute string, so that one bit is a mismatch. Rounding kills it.
 */
export function cssPx(value: number): string {
  if (!Number.isFinite(value)) return "0px";
  return `${Number(value.toFixed(2))}px`;
}

/** Hex keeps the marker color one stable token in the serialized style attribute. */
export function rgbCss(color: RgbTriplet): string {
  const channel = (value: number) =>
    Math.round(Math.min(1, Math.max(0, value)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(color[0])}${channel(color[1])}${channel(color[2])}`;
}

/** Official COBE bindable-marker visibility: `--cobe-visible-{id}` is `N` or unset. */
export function cobeMarkerStyle(
  markerId: string,
  config: Pick<ActivityGlobeConfig, "markerBlurPx" | "markerFadeMs">,
): Record<string, string | number> {
  const visible = `--cobe-visible-${markerId}`;
  return {
    positionAnchor: `--cobe-${markerId}`,
    left: "anchor(center)",
    top: "anchor(center)",
    opacity: `var(${visible}, 0)`,
    filter: `blur(calc((1 - var(${visible}, 0)) * ${config.markerBlurPx}px))`,
    transition: `opacity ${config.markerFadeMs}ms ease, filter ${config.markerFadeMs}ms ease`,
  };
}
