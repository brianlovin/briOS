import { atom } from "jotai";

/** Lifetime rail on /activity. Default open; the page collapses it on small screens. */
export const activityLifetimeSidebarAtom = atom(true);
