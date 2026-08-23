"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useListNavigation } from "@/hooks/useListNavigation";
import { prefetchComputerTip } from "@/lib/hooks/useComputer";
import { cn } from "@/lib/utils";

import { useComputerTipsContext } from "./ComputerContext";

export function ComputerList() {
  const pathname = usePathname();
  const { tips, isLoading } = useComputerTipsContext();

  const currentId = pathname.split("/").pop();
  const currentIndex = useMemo(
    () => tips.findIndex((tip) => tip.id === currentId),
    [tips, currentId],
  );

  useListNavigation(tips, currentIndex, (item) => `/computer/${item.id}`);

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ul className="flex flex-col pb-4">
      {tips.map((item) => {
        const isSelected = item.id === currentId;
        return (
          <li key={item.id} data-id={item.id} className="scroll-my-3">
            <Link
              className={cn(
                "hover:bg-tertiary border-secondary dark:hover:bg-secondary dark:hover:shadow-contrast flex items-center gap-2.5 border-b px-3.5 py-3 md:rounded-lg md:border-b-0",
                {
                  "bg-tertiary dark:bg-secondary dark:shadow-contrast": isSelected,
                },
              )}
              href={`/computer/${item.id}`}
              onMouseEnter={() => prefetchComputerTip(item.id)}
            >
              {item.icon ? (
                item.icon.startsWith("http") || item.icon.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.icon} alt="" className="size-5 shrink-0 rounded-sm" />
                ) : (
                  <span className="shrink-0 text-lg leading-none" aria-hidden>
                    {item.icon}
                  </span>
                )
              ) : null}
              <span className="text-primary line-clamp-3 font-medium">{item.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
