"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { TopBar } from "@/components/TopBar";
import { cn } from "@/lib/utils";

export type ListDetailLayoutProps = {
  title: string;
  backHref: string;
  list: ReactNode;
  children: ReactNode;
  headerChildren?: ReactNode;
};

export function ListDetailLayout({
  title,
  backHref,
  list,
  children,
  headerChildren,
}: ListDetailLayoutProps) {
  const pathname = usePathname();
  const isDetailPage = pathname !== backHref && pathname !== `${backHref}/`;

  return (
    <div className="@container flex w-full flex-1 flex-col">
      <TopBar>
        <div className="text-primary font-medium">{title}</div>
        {headerChildren}
      </TopBar>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn("w-full border-r @3xl:max-w-(--secondary-sidebar-width)", {
            "hidden @3xl:flex": isDetailPage,
          })}
        >
          {list}
        </div>

        <div
          data-scrollable
          className={cn("flex flex-1 flex-col overflow-y-auto", {
            "hidden @3xl:flex": !isDetailPage,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
