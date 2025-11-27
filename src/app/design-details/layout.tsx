"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useMemo } from "react";

import { InfiniteScrollList } from "@/components/InfiniteScrollList";
import { ListDetailLayout } from "@/components/ListDetailLayout";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { useDesignDetailsEpisodes } from "@/hooks/useDesignDetailsEpisodes";
import { useListNavigation } from "@/hooks/useListNavigation";
import { cn } from "@/lib/utils";

export default function DesignDetailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ListDetailWrapper>
      <ListDetailLayout title="Design Details" backHref="/design-details" list={<EpisodeList />}>
        {children}
      </ListDetailLayout>
    </ListDetailWrapper>
  );
}

function EpisodeList() {
  const pathname = usePathname();
  const {
    items: episodes,
    setSize,
    size,
    isReachingEnd,
    isLoading,
    isLoadingMore,
  } = useDesignDetailsEpisodes();

  const currentId = pathname.split("/").pop();
  const currentIndex = useMemo(
    () => episodes.findIndex((e) => e.id === currentId),
    [episodes, currentId],
  );

  useListNavigation(episodes, currentIndex, (item) => `/design-details/${item.id}`);

  const handleLoadMore = useCallback(async () => {
    await setSize(size + 1);
  }, [setSize, size]);

  const renderEpisode = useCallback(
    (ep: (typeof episodes)[0]) => {
      const isSelected = ep.id === currentId;
      const date = ep.publishedDate
        ? new Date(ep.publishedDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : undefined;

      return (
        <li key={ep.id} data-id={ep.id} className="scroll-my-2">
          <Link
            className={cn("hover:bg-tertiary flex w-full flex-col rounded-md px-3.5 py-2 text-sm", {
              "bg-tertiary": isSelected,
            })}
            href={`/design-details/${ep.id}`}
          >
            <span className="text-primary line-clamp-2">{ep.title}</span>
            {date && <span className="text-quaternary">{date}</span>}
          </Link>
        </li>
      );
    },
    [currentId],
  );

  return (
    <InfiniteScrollList
      items={episodes}
      renderItem={renderEpisode}
      onLoadMore={handleLoadMore}
      isLoading={isLoading || false}
      isLoadingMore={isLoadingMore || false}
      isReachingEnd={isReachingEnd || false}
    />
  );
}
