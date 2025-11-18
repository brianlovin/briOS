import { atom } from "jotai";

// Default to false (closed) for SSR safety - prevents mobile flash
// Will be set correctly on client-side hydration
export const sidebarAtom = atom(false);
