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
  focusPulseScale: number;
  focusMs: number;
};

export function markerDotPxForSize(
  size: number,
  config: Pick<ActivityGlobeConfig, "markerBaseSize" | "markerDotPx">,
): number {
  if (config.markerBaseSize <= 0) return config.markerDotPx;
  return config.markerDotPx * (size / config.markerBaseSize);
}

export const DEFAULT_ACTIVITY_GLOBE_CONFIG: ActivityGlobeConfig = {
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  mapBaseBrightness: 0,
  mapBrightnessDark: 5,
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

  markerDotPx: 10,
  markerBlurPx: 8,
  markerFadeMs: 300,
  focusPulseScale: 0.45,
  focusMs: 1200,
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

export function rgbCss(color: RgbTriplet): string {
  const channel = (value: number) => Math.round(Math.min(1, Math.max(0, value)) * 255);
  return `rgb(${channel(color[0])} ${channel(color[1])} ${channel(color[2])})`;
}

/** Official COBE bindable-marker visibility: `--cobe-visible-{id}` is `N` or unset. */
export function cobeMarkerStyle(
  markerId: string,
  config: Pick<
    ActivityGlobeConfig,
    "markerDotPx" | "markerBlurPx" | "markerFadeMs" | "markerColor"
  >,
): Record<string, string | number> {
  const visible = `--cobe-visible-${markerId}`;
  return {
    positionAnchor: `--cobe-${markerId}`,
    left: "anchor(center)",
    top: "anchor(center)",
    width: config.markerDotPx,
    height: config.markerDotPx,
    backgroundColor: rgbCss(config.markerColor),
    opacity: `var(${visible}, 0)`,
    filter: `blur(calc((1 - var(${visible}, 0)) * ${config.markerBlurPx}px))`,
    transition: `opacity ${config.markerFadeMs}ms ease, filter ${config.markerFadeMs}ms ease, transform ${config.markerFadeMs}ms ease, background-color ${config.markerFadeMs}ms ease, box-shadow ${config.markerFadeMs}ms ease`,
  };
}
