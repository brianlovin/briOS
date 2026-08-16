import { describe, expect, test } from "bun:test";
import { createStore } from "jotai";

import { bodyLockedAtom, listDetailMountedCountAtom } from "@/atoms/bodyLock";
import { sidebarAtom } from "@/atoms/sidebar";

describe("bodyLockedAtom", () => {
  test("stays locked when the overlay closes on a mounted list-detail view", () => {
    const store = createStore();
    store.set(listDetailMountedCountAtom, 1);
    store.set(sidebarAtom, true);

    expect(store.get(bodyLockedAtom)).toBe(true);

    store.set(sidebarAtom, false);

    expect(store.get(bodyLockedAtom)).toBe(true);
  });

  test("unlocks only after list-detail unmounts and the overlay is closed", () => {
    const store = createStore();
    store.set(listDetailMountedCountAtom, 1);
    store.set(sidebarAtom, true);

    store.set(sidebarAtom, false);
    expect(store.get(bodyLockedAtom)).toBe(true);

    store.set(listDetailMountedCountAtom, 0);
    expect(store.get(bodyLockedAtom)).toBe(false);
  });
});
