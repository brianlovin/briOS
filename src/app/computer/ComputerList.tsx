"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useListNavigation } from "@/hooks/useListNavigation";
import { computerTipLink, isSelectedComputerTip, publicComputerTips } from "@/lib/computer";
import { prefetchComputerTip } from "@/lib/hooks/useComputer";
import { cn } from "@/lib/utils";

import { useComputerTipsContext } from "./ComputerContext";
import { ComputerTipIcon } from "./ComputerTipIcon";

export function ComputerList() {
  const pathname = usePathname();
  const { tips, isLoading } = useComputerTipsContext();

  const visibleTips = useMemo(() => publicComputerTips(tips), [tips]);
  const currentSlug = pathname.split("/").pop();
  const currentIndex = useMemo(
    () => visibleTips.findIndex((tip) => isSelectedComputerTip(tip, currentSlug)),
    [visibleTips, currentSlug],
  );

  useListNavigation(
    visibleTips,
    currentIndex,
    (item) => computerTipLink(item)?.href ?? "/computer",
  );

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-0.5 md:p-3">
      {visibleTips.map((item) => {
        const link = computerTipLink(item);
        if (!link) return null;
        const isSelected = isSelectedComputerTip(item, currentSlug);
        return (
          <li key={item.id} data-id={item.id} className="scroll-my-3">
            <Link
              className={cn(
                "hover:bg-tertiary border-secondary dark:hover:bg-secondary dark:hover:shadow-contrast flex items-center gap-2.5 border-b px-3.5 py-3 md:rounded-lg md:border-b-0",
                {
                  "bg-tertiary dark:bg-secondary dark:shadow-contrast": isSelected,
                },
              )}
              href={link.href}
              onMouseEnter={() => prefetchComputerTip(link.slug)}
            >
              <ComputerTipIcon icon={item.icon} />
              <span className="text-primary line-clamp-3 font-medium">{item.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
