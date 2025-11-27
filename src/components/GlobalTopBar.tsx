"use client";

import { useAtom } from "jotai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { sidebarAtom } from "@/atoms/sidebar";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

import { MenuToggle } from "./icons/MenuToggle";
import { TopBarActionsSlot } from "./TopBarActions";
import { IconButton } from "./ui/IconButton";

export function BreadcrumbDivider() {
  return <div className="text-quaternary font-medium">/</div>;
}

export function BreadcrumbLabel({ href, children }: { href?: string; children: React.ReactNode }) {
  if (href) {
    return (
      <Link href={href} className="text-primary font-medium">
        {children}
      </Link>
    );
  }
  return <span className="text-primary font-medium">{children}</span>;
}

export function GlobalTopBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useAtom(sidebarAtom);
  const [isVisible, setIsVisible] = useState(false);

  const isHomePage = pathname === "/";

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if click target is or is inside a button or link
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Observe the home title element to show/hide topbar on scroll
  useEffect(() => {
    if (!isHomePage) return;

    const titleElement = document.getElementById("home-title");
    if (!titleElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show topbar when title is NOT intersecting (scrolled past)
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-56px 0px 0px 0px", // Account for topbar height (h-14 = 56px)
      },
    );

    observer.observe(titleElement);

    return () => observer.disconnect();
  }, [isHomePage]);

  // Find the matching navigation item for the current path
  const currentNavItem = navigationItems.find((item) => item.isActive?.(pathname));

  // On homepage, use scroll-based visibility with animation
  // On other pages, always visible
  const shouldShow = isHomePage ? isVisible : true;

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          "sticky top-0 z-20 flex h-14 items-center gap-3 self-start bg-white px-3 dark:bg-black",
          {
            "transition-opacity duration-150": isHomePage,
            "opacity-100": shouldShow && isHomePage,
            "pointer-events-none opacity-0": !shouldShow && isHomePage,
            "bg-white dark:bg-black": isOpen,
          },
        )}
      >
        <IconButton className="rounded-full" size="lg" onClick={() => setIsOpen(!isOpen)}>
          <MenuToggle isOpen={isOpen} />
        </IconButton>
        <BreadcrumbLabel href="/">Brian Lovin</BreadcrumbLabel>
        {currentNavItem && (
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
