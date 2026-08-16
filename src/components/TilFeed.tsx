"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import useSWR from "swr";

import { InfiniteScrollList } from "@/components/InfiniteScrollList";
import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import { renderBlocks } from "@/components/renderBlocks";
import { fetcher } from "@/lib/fetcher";
import type { LikeCount } from "@/lib/hooks/useLikes";
import type { NotionTilItemWithContent } from "@/lib/notion";
import { buildSlug } from "@/lib/short-id";
import { type TilEntry, type TilPage, useTilEntries } from "@/lib/til";

interface TilFeedProps {
  fallbackData: TilPage[];
  initialLikes?: Record<string, LikeCount>;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function TilEntryContent({ entryId }: { entryId: string }) {
  const { data, isLoading } = useSWR<NotionTilItemWithContent>(`/api/til/${entryId}`, fetcher);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="bg-tertiary h-4 w-3/4 rounded" />
        <div className="bg-tertiary h-4 w-1/2 rounded" />
      </div>
    );
  }

  if (!data || data.blocks.length === 0) {
    return null;
  }

  return <div className="notion-blocks flex flex-col gap-3">{renderBlocks(data.blocks)}</div>;
}

function TilEntry({ entry }: { entry: TilEntry }) {
  const slug = entry.shortId ? buildSlug(entry.title, entry.shortId) : null;
  const blocks = entry.blocks;
  const likeHref = slug ? `/til/${slug}` : "/til";

  return (
    <article className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_1fr] sm:items-baseline sm:gap-6 md:grid-cols-[180px_1fr]">
      {/* Date column */}
      <div className="flex flex-col md:items-end">
        <div className="text-tertiary text-base">{formatDate(entry.published)}</div>
        {/* Like button - visible on sm+ screens */}
        <div className="mt-3 hidden sm:block">
          <LikeButton pageId={entry.id} title={entry.title} href={likeHref} contentType="til" />
        </div>
      </div>

      {/* Content column */}
      <div className="flex flex-col gap-3">
        {slug ? (
          <Link href={`/til/${slug}`} className="group">
            <h2 className="text-primary text-xl font-medium underline-offset-2 group-hover:underline">
              {entry.title}
            </h2>
          </Link>
        ) : (
          <h2 className="text-primary text-xl font-medium">{entry.title}</h2>
        )}

        {blocks ? (
          blocks.length > 0 ? (
            <div className="notion-blocks flex flex-col gap-3">{renderBlocks(blocks)}</div>
          ) : null
        ) : (
          <TilEntryContent entryId={entry.id} />
        )}

        {/* Like button - visible only on mobile, below content */}
        <div className="mt-1 w-fit sm:hidden">
          <LikeButton pageId={entry.id} title={entry.title} href={likeHref} contentType="til" />
        </div>
      </div>
    </article>
  );
}

export function TilFeed({ fallbackData, initialLikes }: TilFeedProps) {
  const { items, isLoading, isLoadingMore, isReachingEnd, setSize, size } =
    useTilEntries(fallbackData);

  const pageIds = useMemo(() => items.map((entry) => entry.id), [items]);

  const loadMore = useCallback(async () => {
    await setSize(size + 1);
  }, [setSize, size]);

  return (
    <BatchLikesProvider pageIds={pageIds} initialData={initialLikes}>
      <InfiniteScrollList
        as="div"
        items={items}
        renderItem={(entry) => <TilEntry key={entry.id} entry={entry} />}
        onLoadMore={loadMore}
        isLoading={isLoading ?? false}
        isLoadingMore={isLoadingMore ?? false}
        isReachingEnd={isReachingEnd ?? false}
        className="flex flex-col gap-12 px-4"
      />
    </BatchLikesProvider>
  );
}
