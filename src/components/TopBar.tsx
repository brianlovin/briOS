"use client";

import { useAtom } from "jotai";
import { PropsWithChildren, useEffect, useState } from "react";

import { sidebarAtom } from "@/atoms/sidebar";
import { Menu } from "@/components/icons/Menu";
import { IconButton } from "@/components/ui/IconButton";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { cn } from "@/lib/utils";

export function TopBar({ children, className }: PropsWithChildren<{ className?: string }>) {
  const [primarySidebarOpen, setPrimarySidebarOpen] = useAtom(sidebarAtom);
  const isSmallScreen = useIsSmallScreen();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering button after client-side mount
  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const showMenuButton = mounted && (!primarySidebarOpen || isSmallScreen);

  return (
    <div
      className={cn(
        "border-secondary flex h-11 items-center gap-2 border-b py-3 pr-2 pl-4 select-none",

        className,
      )}
    >
      {showMenuButton && (
        <IconButton onClick={() => setPrimarySidebarOpen(true)} className="-ml-2">
          <Menu />
        </IconButton>
      )}

      {children}
    </div>
  );
}
