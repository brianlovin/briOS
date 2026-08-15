import { atom } from "jotai";

// Overlay open. Default closed for SSR safety.
export const sidebarAtom = atom(false);
