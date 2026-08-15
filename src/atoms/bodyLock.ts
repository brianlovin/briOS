import { atom } from "jotai";

import { sidebarAtom } from "@/atoms/sidebar";
import { shouldLockBody } from "@/lib/body-lock";

export const listDetailMountedCountAtom = atom(0);

export const bodyLockedAtom = atom((get) =>
  shouldLockBody({
    listDetailMounted: get(listDetailMountedCountAtom) > 0,
    overlayOpen: get(sidebarAtom),
  }),
);
