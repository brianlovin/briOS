/** COBE camera pose and marker depth. Safe for client components. */

import { type ActivityGlobeConfig, focusMarkerColor } from "./activity-globe-config";

export type GlobePose = {
  phi: number;
  theta: number;
};

/**
 * COBE convention: rotate so `lat`/`lng` faces the camera.
 * `phi = π - (lngRad - π/2)`, `theta = latRad`.
 */
export function latLngToGlobePose(lat: number, lng: number): GlobePose {
  return {
    phi: Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2),
    theta: (lat * Math.PI) / 180,
  };
}

/** Shortest signed delta from `from` to `to` on the circle, in (-π, π]. */
export function shortestAngleDelta(from: number, to: number): number {
  const tau = Math.PI * 2;
  let delta = ((to - from) % tau) + tau;
  delta %= tau;
  if (delta > Math.PI) delta -= tau;
  return delta;
}

/** Same lat/lng → unit vector as cobe@2 `latLonTo3D`. */
export function latLngToGlobePoint(lat: number, lng: number): [number, number, number] {
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lng * Math.PI) / 180 - Math.PI;
  const cosLat = Math.cos(latRad);
  return [-cosLat * Math.cos(lonRad), Math.sin(latRad), cosLat * Math.sin(lonRad)];
}

/** Same world-to-view rotation as cobe@2 marker projection. */
export function rotateGlobePoint(
  point: [number, number, number],
  phi: number,
  theta: number,
): [number, number, number] {
  const cx = Math.cos(theta);
  const cy = Math.cos(phi);
  const sx = Math.sin(theta);
  const sy = Math.sin(phi);
  const [x, y, z] = point;
  return [cy * x + sy * z, sy * sx * x + cx * y - cy * sx * z, -sy * cx * x + sx * y + cy * cx * z];
}

/**
 * 0 behind the limb, 1 at the camera-facing apex.
 * COBE v2 `--cobe-visible-{id}` is only a boolean (`N` / unset); use this for depth.
 */
export function globeMarkerFacing(lat: number, lng: number, phi: number, theta: number): number {
  const [, , rz] = rotateGlobePoint(latLngToGlobePoint(lat, lng), phi, theta);
  return Math.min(1, Math.max(0, rz));
}

/** Same mesh radius as cobe@2 (`GLOBE_R`). */
export const GLOBE_MESH_RADIUS = 0.8;
export const GLOBE_MARKER_ELEVATION = 0;
/**
 * COBE land-dot radius in unit-sphere chord length.
 * Fragment shader: `smoothstep(8e-3, 0., distanceToLattice)`.
 */
export const GLOBE_MAP_DOT_CHORD = 0.008;

/** Fraction of the mesh that hangs past the right and bottom edges. */
export const GLOBE_HANG = 0.4;
/** Floor so a short pane cannot collapse the sphere back to a marble. */
export const GLOBE_MESH_MIN = 512;
/** Mesh is ~72% of pane/window height. No max cap. */
export const GLOBE_MESH_HEIGHT_RATIO = 0.72;

/**
 * Phi/theta delta that slides the camera-facing point into the visible
 * (unclipped) top-left of the mesh. The canvas hangs past the right and
 * bottom by `GLOBE_HANG`, so the true apex sits low-right of what you see.
 */
export function globeAimVisibleBias(hang = GLOBE_HANG): { dPhi: number; dTheta: number } {
  const visibleEdge = 1 - hang;
  const discMin = (1 - GLOBE_MESH_RADIUS) / 2;
  const visibleMid = (discMin + visibleEdge) / 2;
  const uvOffset = 0.5 - visibleMid;
  const angle = Math.asin(Math.min(0.95, (uvOffset * 2) / GLOBE_MESH_RADIUS));
  return { dPhi: -angle, dTheta: -angle };
}

/** Aim pose that reads as centered in the visible globe, not the full mesh. */
export function latLngToVisibleGlobePose(lat: number, lng: number): GlobePose {
  const pose = latLngToGlobePose(lat, lng);
  const { dPhi, dTheta } = globeAimVisibleBias();
  return { phi: pose.phi + dPhi, theta: pose.theta + dTheta };
}

/** Project a lat/lng onto the COBE canvas, matching v2 marker anchors. */
export function projectGlobeMarker(
  lat: number,
  lng: number,
  phi: number,
  theta: number,
  elevation = GLOBE_MARKER_ELEVATION,
): { x: number; y: number; facing: number } {
  const unit = latLngToGlobePoint(lat, lng);
  const radius = GLOBE_MESH_RADIUS + elevation;
  const [rx, ry] = rotateGlobePoint(
    [unit[0] * radius, unit[1] * radius, unit[2] * radius],
    phi,
    theta,
  );
  return {
    x: (rx + 1) / 2,
    y: (-ry + 1) / 2,
    facing: globeMarkerFacing(lat, lng, phi, theta),
  };
}

/** Canvas diameter ≈ 0.72 × pane/window height, clipped off the bottom-right. */
export function globeDiameterFromHeight(height: number): number {
  if (!Number.isFinite(height) || height <= 0) return GLOBE_MESH_MIN;
  return Math.round(Math.max(GLOBE_MESH_MIN, height * GLOBE_MESH_HEIGHT_RATIO));
}

/**
 * Same cap as production: retina land dots stay sharp. Do not drop this to 1 —
 * a 1x backing store is what made the preview look soft.
 */
export const GLOBE_DEVICE_PIXEL_RATIO_CAP = 2;

export function globeDevicePixelRatio(
  dpr: number = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1,
): number {
  return Math.min(GLOBE_DEVICE_PIXEL_RATIO_CAP, dpr || 1);
}

export type GlobeMarkerSnapshot = {
  id: string;
  location: readonly [number, number];
  size: number;
  color?: readonly [number, number, number];
};

function rgbEqual(
  a: readonly [number, number, number] | undefined,
  b: readonly [number, number, number] | undefined,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

/** True when Cobe must re-upload the marker GPU buffer. Same ref is a no-op. */
export function globeMarkersChanged(
  prev: readonly GlobeMarkerSnapshot[] | null | undefined,
  next: readonly GlobeMarkerSnapshot[],
): boolean {
  if (prev === next) return false;
  if (!prev || prev.length !== next.length) return true;
  for (let i = 0; i < next.length; i++) {
    const a = prev[i];
    const b = next[i];
    if (!a || !b) return true;
    if (a.id !== b.id || a.size !== b.size) return true;
    if (a.location[0] !== b.location[0] || a.location[1] !== b.location[1]) return true;
    if (!rgbEqual(a.color, b.color)) return true;
  }
  return false;
}

/** Run the rAF loop only when the tab is visible and the globe is on screen. */
export function shouldRunGlobeLoop(input: {
  visibilityState: DocumentVisibilityState | string;
  isIntersecting: boolean;
}): boolean {
  return input.visibilityState === "visible" && input.isIntersecting;
}

export function isGlobePerfQuery(search: string): boolean {
  try {
    return new URLSearchParams(search).get("globePerf") === "1";
  } catch {
    return false;
  }
}

/** CSS px of one COBE country-shape dot at the facing center of the mesh. */
export function globeMapDotPx(meshSize: number, scale = 1): number {
  if (!Number.isFinite(meshSize) || meshSize <= 0) return 2;
  const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
  return Math.max(2, GLOBE_MAP_DOT_CHORD * GLOBE_MESH_RADIUS * meshSize * safeScale);
}

/**
 * GPU payload for Cobe. Ids stay on {@link GlobeMarkerSnapshot} for identity
 * compares, but are omitted here so Cobe never creates CSS-anchor nodes or
 * rewrites `--cobe-visible-*` on every `update()`.
 */
export function cobeGpuMarkers(
  markers: readonly GlobeMarkerSnapshot[],
): Array<{ location: [number, number]; size: number; color?: [number, number, number] }> {
  return markers.map((marker) => ({
    location: [marker.location[0], marker.location[1]],
    size: marker.size,
    ...(marker.color
      ? { color: [marker.color[0], marker.color[1], marker.color[2]] as [number, number, number] }
      : {}),
  }));
}

/**
 * WebGL discs from the recent-location trail. Ids are kept for change detection.
 * Focus is a one-shot size/color bump (dirty once on, once off) — not a
 * per-frame pulse, so panning never re-uploads the marker buffer.
 */
export function cobeWebGLMarkers(
  markers: ReadonlyArray<{
    id: string;
    eventId: string;
    location: [number, number];
    size: number;
  }>,
  config: Pick<ActivityGlobeConfig, "markerColor" | "focusPulseScale">,
  focusEventId: string | null,
): GlobeMarkerSnapshot[] {
  return markers.map((marker) => {
    const focused = focusEventId !== null && marker.eventId === focusEventId;
    const size = focused ? marker.size * (1 + config.focusPulseScale) : marker.size;
    return {
      id: marker.id,
      location: marker.location,
      size,
      ...(focused ? { color: focusMarkerColor(config.markerColor) } : {}),
    };
  });
}
