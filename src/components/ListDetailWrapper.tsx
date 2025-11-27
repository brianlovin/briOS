"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";

/**
 * Wrapper for pages that use ListDetailLayout and need independent scrolling areas.
 * Uses fixed positioning below the GlobalTopBar and disables body scroll to prevent
 * double-scroll issues.
 */
export function ListDetailWrapper({ children }: PropsWithChildren) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="border-secondary fixed inset-x-0 top-14 bottom-0 flex flex-col overflow-hidden md:border-t">
      {children}
    </div>
  );
}
