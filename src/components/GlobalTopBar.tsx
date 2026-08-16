"use client";

import { useAtom, useAtomValue } from "jotai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useCallback } from "react";

import { scrollTargetAtom } from "@/atoms/scrollTarget";
import { sidebarAtom } from "@/atoms/sidebar";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

import { MenuToggle } from "./icons/MenuToggle";
import { TopBarActionsSlot } from "./TopBarActions";
import { IconButton } from "./ui/IconButton";

function isElementVisible(element: HTMLElement): boolean {
  const style = getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

function findFallbackScrollTarget(): HTMLElement | null {
  const mainContent = document.querySelector("[data-main-content]");
  if (!(mainContent instanceof HTMLElement)) return null;

  const scrollableContainers = mainContent.querySelectorAll("[data-scrollable]");
  for (const container of scrollableContainers) {
    if (container instanceof HTMLElement && isElementVisible(container)) {
      return container;
    }
  }

  return null;
}

export function BreadcrumbDivider() {
  return <div className="text-quaternary font-medium opacity-50 dark:opacity-70">/</div>;
}

export function BreadcrumbLabel({
  href,
  children,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  if (href) {
    return (
      <Link href={href} className="text-primary p-2 font-medium" onClick={onClick}>
        {children}
      </Link>
    );
  }
  return <span className="text-primary p-2 font-medium">{children}</span>;
}

export function GlobalTopBar() {
  const [isOpen, setIsOpen] = useAtom(sidebarAtom);
  const scrollTarget = useAtomValue(scrollTargetAtom);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a")) {
        return;
      }

      const el = scrollTarget ?? findFallbackScrollTarget();
      if (el) {
        el.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [scrollTarget],
  );

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
        <Suspense fallback={<div className="h-10 w-32" aria-hidden />}>
          <TopBarBreadcrumbs onClose={() => setIsOpen(false)} />
        </Suspense>
        <TopBarActionsSlot />
      </div>
    </>
  );
}

function TopBarBreadcrumbs({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const currentNavItem = navigationItems.find((item) => item.isActive?.(pathname));

  return (
    <>
      {!isHomePage && (
        <BreadcrumbLabel href="/" onClick={onClose}>
          Brian Lovin
        </BreadcrumbLabel>
      )}
      {currentNavItem && !isHomePage && (
        <>
          <BreadcrumbDivider />
          <BreadcrumbLabel href={currentNavItem.href} onClick={onClose}>
            {currentNavItem.label}
          </BreadcrumbLabel>
        </>
      )}
    </>
  );
}
