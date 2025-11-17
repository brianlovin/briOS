"use client";

import { useAtom } from "jotai";
import { PropsWithChildren, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Toaster } from "sonner";

import { sidebarAtom } from "@/atoms/sidebar";
import { CommandMenu } from "@/components/CommandMenu";
import { PrimarySidebar } from "@/components/PrimarySidebar";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { useScrollDelegation } from "@/hooks/useScrollDelegation";
import { cn } from "@/lib/utils";

export function ClientShell({ children }: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarAtom);
  const isSmallScreen = useIsSmallScreen();

  useScrollDelegation();

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
    <>
      <Toaster position="bottom-center" />
      <CommandMenu />
      <main className="relative mx-auto flex h-screen w-full max-w-400 overflow-hidden md:p-2">
        <PrimarySidebar />

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
    </>
  );
}
