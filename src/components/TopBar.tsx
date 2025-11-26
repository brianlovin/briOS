"use client";

import { useAtom } from "jotai";
import { PropsWithChildren } from "react";

import { sidebarAtom } from "@/atoms/sidebar";
import { MenuToggle } from "@/components/icons/MenuToggle";
import { IconButton } from "@/components/ui/IconButton";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { cn } from "@/lib/utils";

export function TopBar({ children, className }: PropsWithChildren<{ className?: string }>) {
  const [primarySidebarOpen, setPrimarySidebarOpen] = useAtom(sidebarAtom);
  const isSmallScreen = useIsSmallScreen();

  return (
    <div
      className={cn(
        "border-secondary flex h-11 items-center gap-2 border-b py-3 pr-2 select-none",
        {
          "pl-2": !primarySidebarOpen || isSmallScreen,
          "pl-4": primarySidebarOpen && !isSmallScreen,
          // On mobile: always solid bg and higher z-index to stay on top of menu
          "relative z-30 bg-white dark:bg-black": isSmallScreen,
        },
        className,
      )}
    >
      {(!primarySidebarOpen || isSmallScreen) && (
        <IconButton onClick={() => setPrimarySidebarOpen(!primarySidebarOpen)}>
          <MenuToggle isOpen={primarySidebarOpen && isSmallScreen} />
        </IconButton>
      )}

      {children}
    </div>
  );
}
