"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { sidebarAtom } from "@/atoms/sidebar";
import { GitHubIcon, XIcon, YouTubeIcon } from "@/components/icons/SocialIcons";
import { getMainNavigationItems, getProjectNavigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function MobileNavMenu() {
  const isOpen = useAtomValue(sidebarAtom);
  const setIsOpen = useSetAtom(sidebarAtom);
  const pathname = usePathname();

  const mainNavItems = React.useMemo(() => getMainNavigationItems(), []);
  const projectNavItems = React.useMemo(() => getProjectNavigationItems(), []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 top-11 z-20 flex origin-top flex-col bg-white dark:bg-black"
        >
          {/* Navigation - TopBar stays on top, menu opens below */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
            <div className="flex flex-col gap-1">
              {mainNavItems.map((item) => (
                <MobileNavLink
                  key={item.id}
                  href={item.href}
                  isActive={item.isActive?.(pathname) ?? false}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </MobileNavLink>
              ))}
            </div>

            <div className="mt-8">
              <span className="text-quaternary text-sm font-medium">Projects</span>
              <div className="mt-3 flex flex-col gap-1">
                {projectNavItems.map((item) => (
                  <MobileNavLink
                    key={item.id}
                    href={item.href}
                    isActive={item.isActive?.(pathname) ?? false}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </MobileNavLink>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="mt-8 flex flex-row items-center gap-4">
              <Link
                href="https://x.com/brian_lovin"
                className="text-quaternary hover:text-primary -ml-2 p-2"
                onClick={() => setIsOpen(false)}
              >
                <XIcon size={24} />
              </Link>
              <Link
                href="https://www.youtube.com/@brian_lovin"
                className="group p-2"
                onClick={() => setIsOpen(false)}
              >
                <YouTubeIcon
                  size={28}
                  className="text-quaternary group-hover:text-[#FF0302]"
                  playIconClassName="fill-[var(--background-color-elevated)] group-hover:fill-white"
                />
              </Link>
              <Link
                href="https://github.com/brianlovin"
                className="text-quaternary hover:text-primary p-2"
                onClick={() => setIsOpen(false)}
              >
                <GitHubIcon size={24} />
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileNavLink({
  href,
  isActive,
  onClick,
  children,
}: {
  href: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <div
        className={cn("py-2 text-xl font-semibold", {
          "text-primary": isActive,
          "text-tertiary hover:text-primary": !isActive,
        })}
      >
        {children}
      </div>
    </Link>
  );
}
