"use client";

import { useAtom } from "jotai";
import { PropsWithChildren, useEffect, useLayoutEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { sidebarAtom } from "@/atoms/sidebar";
import { PrimarySidebar } from "@/components/PrimarySidebar";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { useScrollDelegation } from "@/hooks/useScrollDelegation";
import { cn } from "@/lib/utils";

/**
 * AppShell - Client Component
 *
 * Handles the interactive parts of the app shell:
 * - Sidebar state management
 * - Responsive behavior
 * - Keyboard shortcuts
 * - Scroll delegation
 * - Hydration without flash
 *
 * This is kept as a client component because it needs React hooks and browser APIs.
 */
export function AppShell({ children }: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarAtom);
  const isSmallScreen = useIsSmallScreen();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);

  useScrollDelegation();

  // Set sidebar state based on viewport before making app visible
  // This prevents any flash - app stays hidden until we know the correct state
  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 769px)");
    setSidebarOpen(mediaQuery.matches);
    // Batch state updates to avoid cascading renders
    requestAnimationFrame(() => {
      setIsHydrated(true);
      // After app is visible, allow animations for future interactions
      requestAnimationFrame(() => {
        setIsInitialMount(false);
      });
    });
  }, [setSidebarOpen]);

  // Keep sidebar closed on mobile when viewport changes
  useEffect(() => {
    if (isSmallScreen) {
      setSidebarOpen(false);
    }
  }, [isSmallScreen, setSidebarOpen]);

  // Add hotkey for toggling sidebar
  useHotkeys(
    "mod+period",
    () => {
      setSidebarOpen(!sidebarOpen);
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
  );

  return (
    <main
      className={cn("relative isolate mx-auto flex h-svh w-full max-w-400 overflow-hidden md:p-2", {
        invisible: !isHydrated,
      })}
    >
      <PrimarySidebar suppressInitialAnimation={isInitialMount} />

      <div
        data-main-content
        className={cn(
          "md:bg-elevated md:dark:shadow-contrast relative flex min-w-0 flex-1 overflow-hidden md:max-h-[calc(100vh-1rem)] md:rounded-lg md:shadow-sm md:ring-[0.5px] md:ring-black/5",
          {
            "ml-3": sidebarOpen && !isSmallScreen,
          },
        )}
      >
        {children}
      </div>
    </main>
  );
}
