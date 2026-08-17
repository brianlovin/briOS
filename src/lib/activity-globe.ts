/** COBE camera pose and marker depth. Safe for client components. */

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

export const GLOBE_SIZE_MIN = 240;
export const GLOBE_SIZE_MAX = 456;

/** Diameter ≈ 1/3 of the activity pane height, clamped for short and very tall viewports. */
export function globeDiameterFromHeight(height: number): number {
  if (!Number.isFinite(height) || height <= 0) return GLOBE_SIZE_MIN;
  return Math.round(Math.min(GLOBE_SIZE_MAX, Math.max(GLOBE_SIZE_MIN, height / 3)));
}
