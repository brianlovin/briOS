import { randomBytes } from "crypto";

import { safeCompare } from "@/lib/api-utils";

/** HttpOnly cookie that binds the Spotify callback to the browser that started login. */
export const SPOTIFY_STATE_COOKIE = "spotify_oauth_state";
export const SPOTIFY_STATE_MAX_AGE_SECONDS = 600;

export function createSpotifyState(): string {
  return randomBytes(24).toString("base64url");
}

/** True only when the callback's `state` matches the cookie set by /api/spotify/login. */
export function isValidSpotifyState(
  queryState: string | null | undefined,
  cookieState: string | null | undefined,
): boolean {
  return safeCompare(queryState, cookieState);
}
