/** Tunable COBE settings for the activity globe. */

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

  /** WebGL disc scale from visit-count buckets / age trail. */
  markerBaseSize: number;
  markerSizePerLog: number;
  markerMaxSize: number;

  /** Unused by the live WebGL path; kept so sandbox JSON stays stable. */
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

/** Newest is `markerBaseSize`; each older step shrinks, never below half that. */
export function markerSizeForAge(
  age: number,
  config: Pick<ActivityGlobeConfig, "markerBaseSize" | "markerAgeShrink">,
): number {
  const scaled = config.markerBaseSize * markerAgeScale(age, config.markerAgeShrink);
  return Math.max(config.markerBaseSize * 0.5, scaled);
}

export const DEFAULT_ACTIVITY_GLOBE_CONFIG: ActivityGlobeConfig = {
  diffuse: 0.6,
  // 19000 at DPR 2 on a ~0.72×vh mesh dropped frames on retina. 13000 keeps land readable.
  mapSamples: 13000,
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

  // Cobe clip radius ≈ size * mesh/4. 0.08 ≈ 12px disc + the old 1.15× glow.
  markerBaseSize: 0.08,
  markerSizePerLog: 0.014,
  markerMaxSize: 0.14,

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

/** Brighter orange for the briefly focused newest pin — no CSS animation. */
export function focusMarkerColor(color: RgbTriplet): RgbTriplet {
  return [
    Math.min(1, color[0] * 0.25 + 0.75),
    Math.min(1, color[1] * 0.35 + 0.55),
    Math.min(1, color[2] * 0.35 + 0.18),
  ];
}
