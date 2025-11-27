"use client";

import { useAtomValue } from "jotai";

import { sidebarAtom } from "@/atoms/sidebar";
import { TopBar } from "@/components/TopBar";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";

export function HomeTopBar() {
  const sidebarOpen = useAtomValue(sidebarAtom);
  const isSmallScreen = useIsSmallScreen();

  // On desktop with sidebar open, no need for TopBar (sidebar handles navigation)
  // On desktop with sidebar closed, show TopBar with menu button to re-open sidebar
  // On mobile, always show TopBar for mobile nav access
  if (!isSmallScreen && sidebarOpen) return null;

  return <TopBar className="border-b-0" />;
}
