"use client";

import { useSetAtom } from "jotai";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";

import { listDetailMountedCountAtom } from "@/atoms/bodyLock";

/**
 * Wrapper for pages that use ListDetailLayout and need independent scrolling areas.
 * Uses fixed positioning below the GlobalTopBar. Body scroll is owned by BodyLock.
 */
export function ListDetailWrapper({ children }: PropsWithChildren) {
  const setMountedCount = useSetAtom(listDetailMountedCountAtom);

  useEffect(() => {
    setMountedCount((count) => count + 1);
    return () => setMountedCount((count) => count - 1);
  }, [setMountedCount]);

  return (
    <div className="fixed inset-x-0 top-14 bottom-0 flex flex-col overflow-hidden md:border-t">
      {children}
    </div>
  );
}
