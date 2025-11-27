"use client";

import { isMacOs } from "react-device-detect";

/**
 * Platform-specific modifier key for keyboard shortcuts.
 * Returns "meta" (Cmd) for macOS and "ctrl" for Windows/Linux.
 */
export const MOD_KEY = isMacOs ? "meta" : "ctrl";
