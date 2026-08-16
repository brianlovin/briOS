"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense, useRef } from "react";

import { useRegisterScrollTarget } from "@/hooks/useRegisterScrollTarget";
import { cn } from "@/lib/utils";

export type ListDetailLayoutProps = {
  backHref: string;
  list: ReactNode;
  children: ReactNode;
};

export function ListDetailLayout({ backHref, list, children }: ListDetailLayoutProps) {
  return (
    <div className="@container flex min-h-0 w-full flex-1 flex-col">
      <Suspense fallback={<ListDetailFallback list={list} />}>
        <ListDetailContent backHref={backHref} list={list}>
          {children}
        </ListDetailContent>
      </Suspense>
    </div>
  );
}

function ListDetailContent({ backHref, list, children }: ListDetailLayoutProps) {
  const pathname = usePathname();
  const isDetailPage = pathname !== backHref && pathname !== `${backHref}/`;
  const listRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useRegisterScrollTarget(listRef, !isDetailPage);
  useRegisterScrollTarget(detailRef, isDetailPage);

  return (
    <div className="flex min-h-0 flex-1">
      <div
        className={cn(
          "flex min-h-0 w-full flex-col border-r @3xl:max-w-(--secondary-sidebar-width)",
          {
            "hidden @3xl:flex": isDetailPage,
          },
        )}
      >
        <div ref={listRef} data-list-container className="min-h-0 flex-1 overflow-y-auto">
          {list}
        </div>
      </div>

      <div
        ref={detailRef}
        data-scrollable
        data-detail-container
        className={cn("flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto", {
          "hidden @3xl:flex": !isDetailPage,
        })}
      >
        {children}
      </div>
    </div>
  );
}

function ListDetailFallback({ list }: { list: ReactNode }) {
  const listRef = useRef<HTMLDivElement>(null);
  useRegisterScrollTarget(listRef);

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-h-0 w-full flex-col border-r @3xl:max-w-(--secondary-sidebar-width)">
        <div ref={listRef} data-list-container className="min-h-0 flex-1 overflow-y-auto">
          {list}
        </div>
      </div>
      <div className="hidden min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto @3xl:flex" />
    </div>
  );
}
