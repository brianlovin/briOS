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
export const GLOBE_MARKER_ELEVATION = 0;

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
 * Keep marker ids so COBE creates `--cobe-{id}` anchors and `--cobe-visible-{id}`,
 * but hide the WebGL discs — those do not fade. The CSS dots do.
 */
export function bindableGlobeMarkers(
  markers: ReadonlyArray<{ id: string; location: [number, number]; size?: number }>,
): Array<{ id: string; location: [number, number]; size: number }> {
  return markers.map((marker) => ({
    id: marker.id,
    location: marker.location,
    size: 0,
  }));
}
