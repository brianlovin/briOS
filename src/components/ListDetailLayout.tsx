"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ListDetailLayoutProps = {
  backHref: string;
  list: ReactNode;
  children: ReactNode;
};

export function ListDetailLayout({ backHref, list, children }: ListDetailLayoutProps) {
  const pathname = usePathname();
  const isDetailPage = pathname !== backHref && pathname !== `${backHref}/`;

  return (
    <div className="@container flex min-h-0 w-full flex-1 flex-col">
      <div className="flex min-h-0 flex-1">
        <div
          className={cn(
            "flex min-h-0 w-full flex-col border-r @3xl:max-w-(--secondary-sidebar-width)",
            {
              "hidden @3xl:flex": isDetailPage,
            },
          )}
        >
          <div className="min-h-0 flex-1 overflow-y-auto">{list}</div>
        </div>

        <div
          data-scrollable
          className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", {
            "hidden @3xl:flex": !isDetailPage,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
