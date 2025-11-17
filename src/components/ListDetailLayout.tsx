"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ArrowLeft } from "@/components/icons/ArrowLeft";
import { TopBar } from "@/components/TopBar";
import { IconButton } from "@/components/ui/IconButton";
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
        {isDetailPage && (
          <Link href={backHref} className="@3xl:hidden">
            <IconButton variant="ghost" size="sm">
              <ArrowLeft />
            </IconButton>
          </Link>
        )}
        <div className="text-primary text-sm font-medium">{title}</div>
        {headerChildren}
      </TopBar>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn("w-full border-r @3xl:max-w-[var(--secondary-sidebar-width)]", {
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
