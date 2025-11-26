"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { sidebarAtom } from "@/atoms/sidebar";
import { DoubleChevronLeft } from "@/components/icons/DoubleChevronLeft";
import { IconButton } from "@/components/ui/IconButton";
import { getMainNavigationItems, getProjectNavigationItems } from "@/config/navigation";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { cn } from "@/lib/utils";

export function PrimarySidebar({
  suppressInitialAnimation = false,
}: {
  suppressInitialAnimation?: boolean;
}) {
  const isOpen = useAtomValue(sidebarAtom);
  const pathname = usePathname();
  const isSmallScreen = useIsSmallScreen();

  // Memoize navigation items to avoid recomputing on every render
  const mainNavItems = React.useMemo(() => getMainNavigationItems(), []);
  const projectNavItems = React.useMemo(() => getProjectNavigationItems(), []);

  const duration = 0.2;
  const ease = "easeInOut" as const;
  const transition = { duration, ease };

  // Don't render on mobile - MobileNavMenu handles that
  if (isSmallScreen) return null;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={
            suppressInitialAnimation
              ? { width: "var(--primary-sidebar-width)", opacity: 1 }
              : { width: 0, opacity: 0 }
          }
          animate={{ width: "var(--primary-sidebar-width)", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={suppressInitialAnimation ? { duration: 0 } : transition}
          data-primary-sidebar
          className="group/primary-sidebar z-20 flex-none overflow-hidden"
        >
          <motion.div
            initial={suppressInitialAnimation ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={suppressInitialAnimation ? { duration: 0 } : transition}
            className="flex h-full min-w-[var(--primary-sidebar-width)] flex-col"
          >
            <SidebarHeader />

            <div className="flex flex-1 flex-col gap-px overflow-y-auto px-1 py-4">
              {mainNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <SidebarItem
                    key={item.id}
                    icon={<IconComponent />}
                    label={item.label}
                    href={item.href}
                    isActive={item.isActive?.(pathname) ?? false}
                  />
                );
              })}

              <div className="mt-4 px-3 pb-1">
                <span className="text-quaternary text-[13px] font-medium select-none">
                  Projects
                </span>
              </div>

              {projectNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <SidebarItem
                    key={item.id}
                    icon={<IconComponent />}
                    label={item.label}
                    href={item.href}
                    isActive={item.isActive?.(pathname) ?? false}
                  />
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SidebarItem({
  icon,
  label,
  href,
  isActive,
  onClick,
  trailingAccessory,
}: {
  icon: React.ReactNode;
  label: string | React.ReactNode;
  href: string;
  isActive: boolean;
  onClick?: (e: React.MouseEvent) => void;
  trailingAccessory?: React.ReactNode;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <div
        className={cn("group/sidebar-item flex h-[30px] items-center gap-2 rounded-md px-2", {
          "hover:bg-black/5 dark:hover:bg-white/[0.08]": !isActive,
          "bg-black/5 hover:bg-black/5 dark:bg-white/[0.08] dark:hover:bg-white/[0.08]": isActive,
        })}
      >
        <span
          className={cn(
            "group-hover/sidebar-item:text-primary flex h-5 w-5 items-center justify-center",
            { "text-primary": isActive, "text-neutral-500": !isActive },
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            "group-hover/sidebar-item:text-primary line-clamp-1 flex-1 text-sm font-medium select-none",
            {
              "text-primary": isActive,
              "text-secondary": !isActive,
            },
          )}
        >
          {label}
        </span>
        {trailingAccessory}
      </div>
    </Link>
  );
}

function SidebarHeader() {
  const setIsOpen = useSetAtom(sidebarAtom);

  return (
    <div className="mr-2 ml-1 flex h-11 flex-none items-center justify-between select-none">
      <Link href="/" className="flex items-center gap-2 px-2 py-1">
        <Image
          src="/img/avatar.jpg"
          alt="Brian Lovin"
          width={40}
          height={40}
          className="h-5 w-5 rounded-full"
          draggable={false}
        />
        <span className="text-sm font-medium">Brian Lovin</span>
      </Link>

      <IconButton
        size="sm"
        onClick={() => setIsOpen(false)}
        className="text-quaternary opacity-0 transition-opacity duration-200 group-hover/primary-sidebar:opacity-100"
      >
        <DoubleChevronLeft size={28} className="group-hover/button:text-primary" />
      </IconButton>
    </div>
  );
}
