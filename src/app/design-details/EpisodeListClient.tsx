"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { InfiniteScrollList } from "@/components/InfiniteScrollList";
import { useListNavigation } from "@/hooks/useListNavigation";
import { useScrollToSelected } from "@/hooks/useScrollToSelected";
import { cn } from "@/lib/utils";

type DesignDetailsEpisode = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  episodeNumber?: number;
  publishedDate?: string;
  imageUrl?: string;
  audioUrl?: string;
};

interface EpisodeListClientProps {
  initialEpisodes: DesignDetailsEpisode[];
  initialCursor: string | null;
}

export function EpisodeListClient({ initialEpisodes, initialCursor }: EpisodeListClientProps) {
  const pathname = usePathname();
  const [episodes, setEpisodes] = useState<DesignDetailsEpisode[]>(initialEpisodes);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const currentId = pathname.split("/").pop();
  const currentIndex = useMemo(
    () => episodes.findIndex((e) => e.id === currentId),
    [episodes, currentId],
  );

  useListNavigation(episodes, currentIndex, (item) => `/design-details/${item.id}`);
  useScrollToSelected(currentId, currentIndex);

  const handleLoadMore = useCallback(async () => {
    if (!cursor || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/design-details?cursor=${cursor}&limit=20`);
      const data = await response.json();
      setEpisodes((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
    } catch (error) {
      console.error("Error loading more episodes:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursor, isLoadingMore]);

  const renderEpisode = useCallback(
    (ep: DesignDetailsEpisode) => {
      const isSelected = ep.id === currentId;
      const date = ep.publishedDate
        ? new Date(ep.publishedDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : undefined;

      return (
        <li key={ep.id} data-id={ep.id}>
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
      isLoading={false}
      isLoadingMore={isLoadingMore}
      isReachingEnd={!cursor}
    />
  );
}
