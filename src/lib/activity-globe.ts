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

/** Same mesh radius as cobe@2 (`GLOBE_R`). */
export const GLOBE_MESH_RADIUS = 0.8;
export const GLOBE_MARKER_ELEVATION = 0.03;

/** Fraction of the mesh that hangs past the right and bottom edges. */
export const GLOBE_HANG = 0.4;
/** Floor so a short pane cannot collapse the sphere back to a marble. */
export const GLOBE_MESH_MIN = 640;
/** Mesh is ~90% of pane/window height. No max cap. */
export const GLOBE_MESH_HEIGHT_RATIO = 0.9;

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

/** Canvas diameter ≈ 0.9 × pane/window height, clipped off the bottom-right. */
export function globeDiameterFromHeight(height: number): number {
  if (!Number.isFinite(height) || height <= 0) return GLOBE_MESH_MIN;
  return Math.round(Math.max(GLOBE_MESH_MIN, height * GLOBE_MESH_HEIGHT_RATIO));
}
