"use client";

import { useAtom } from "jotai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

import { sidebarAtom } from "@/atoms/sidebar";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

import { MenuToggle } from "./icons/MenuToggle";
import { TopBarActionsSlot } from "./TopBarActions";
import { IconButton } from "./ui/IconButton";

/**
 * Checks if an element is visible (not hidden via CSS)
 */
function isElementVisible(element: HTMLElement): boolean {
  const style = getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

/**
 * Finds the appropriate scroll target based on the current page layout.
 * Prioritizes:
 * 1. Element with data-scroll-priority="true" (set by list-detail layouts based on current view)
 * 2. Any visible [data-scrollable] container
 * 3. Any visible scrollable element with overflow-y-auto
 * 4. Falls back to window scroll
 */
function findScrollTarget(): HTMLElement | null {
  const mainContent = document.querySelector("[data-main-content]") as HTMLElement;
  if (!mainContent) return null;

  // First check for element with scroll priority (set by list-detail layouts)
  const priorityContainer = mainContent.querySelector(
    '[data-scroll-priority="true"]',
  ) as HTMLElement;
  if (priorityContainer && isElementVisible(priorityContainer)) {
    return priorityContainer;
  }

  // Look for any visible scrollable container with data-scrollable
  const scrollableContainers = mainContent.querySelectorAll(
    "[data-scrollable]",
  ) as NodeListOf<HTMLElement>;

  for (const container of scrollableContainers) {
    if (isElementVisible(container) && container.scrollHeight > container.clientHeight) {
      return container;
    }
  }

  // Fallback: find any scrollable element with overflow-y-auto
  const allScrollable = mainContent.querySelectorAll(
    '[class*="overflow-y-auto"], [class*="overflow-auto"]',
  ) as NodeListOf<HTMLElement>;

  for (const container of allScrollable) {
    if (isElementVisible(container) && container.scrollHeight > container.clientHeight) {
      return container;
    }
  }

  return null;
}

export function BreadcrumbDivider() {
  return <div className="text-quaternary font-medium">/</div>;
}

export function BreadcrumbLabel({ href, children }: { href?: string; children: React.ReactNode }) {
  if (href) {
    return (
      <Link href={href} className="text-primary p-2 font-medium">
        {children}
      </Link>
    );
  }
  return <span className="text-primary p-2 font-medium">{children}</span>;
}

export function GlobalTopBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useAtom(sidebarAtom);

  const isHomePage = pathname === "/";

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Check if click target is or is inside a button or link
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }

    const scrollTarget = findScrollTarget();
    if (scrollTarget) {
      scrollTarget.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // Find the matching navigation item for the current path
  const currentNavItem = navigationItems.find((item) => item.isActive?.(pathname));

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          "sticky top-0 z-20 flex h-14 items-center gap-1 self-start bg-white px-3 dark:bg-black",
          {
            "bg-white dark:bg-black": isOpen,
          },
        )}
      >
        <IconButton className="rounded-full" size="lg" onClick={() => setIsOpen(!isOpen)}>
          <MenuToggle isOpen={isOpen} />
        </IconButton>
        {!isHomePage && <BreadcrumbLabel href="/">Brian Lovin</BreadcrumbLabel>}
        {currentNavItem && !isHomePage && (
          <>
            <BreadcrumbDivider />
            <BreadcrumbLabel href={currentNavItem.href}>{currentNavItem.label}</BreadcrumbLabel>
          </>
        )}
        <TopBarActionsSlot />
      </div>
    </>
  );
}
