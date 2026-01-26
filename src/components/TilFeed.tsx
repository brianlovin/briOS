"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import useSWR from "swr";

import { InfiniteScrollList } from "@/components/InfiniteScrollList";
import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import { renderBlocks } from "@/components/renderBlocks";
import { fetcher } from "@/lib/fetcher";
import type { LikeData } from "@/lib/hooks/useLikes";
import type { NotionTilItem, NotionTilItemWithContent } from "@/lib/notion";
import { buildSlug } from "@/lib/short-id";
import { useTilEntries } from "@/lib/til";

interface TilFeedProps {
  initialEntries: NotionTilItemWithContent[];
  initialLikes?: Record<string, LikeData>;
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

  return <div className="flex flex-col gap-3">{renderBlocks(data.blocks)}</div>;
}

function TilEntry({
  entry,
  initialContent,
}: {
  entry: NotionTilItem;
  initialContent?: NotionTilItemWithContent;
}) {
  const slug = entry.shortId ? buildSlug(entry.title, entry.shortId) : null;
  const hasInitialContent = initialContent && initialContent.blocks.length > 0;

  return (
    <article className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_1fr] sm:items-baseline sm:gap-6 md:grid-cols-[180px_1fr]">
      {/* Date column */}
      <div className="flex flex-col md:items-end">
        <div className="text-tertiary text-base">{formatDate(entry.published)}</div>
        {/* Like button - visible on sm+ screens */}
        <div className="mt-3 hidden sm:block">
          <LikeButton pageId={entry.id} />
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

        {/* Inline expanded content */}
        {hasInitialContent ? (
          <div className="flex flex-col gap-3">{renderBlocks(initialContent.blocks)}</div>
        ) : (
          <TilEntryContent entryId={entry.id} />
        )}

        {/* Like button - visible only on mobile, below content */}
        <div className="mt-1 w-fit sm:hidden">
          <LikeButton pageId={entry.id} />
        </div>
      </div>
    </article>
  );
}

export function TilFeed({ initialEntries, initialLikes }: TilFeedProps) {
  const { items, isLoading, isLoadingMore, isReachingEnd, setSize, size } = useTilEntries();

  // Build a map of initial content for quick lookup
  const initialContentMap = new Map<string, NotionTilItemWithContent>(
    initialEntries.map((entry) => [entry.id, entry]),
  );

  // Use API-fetched items if available, otherwise fall back to initial entries
  const entries = items.length > 0 ? items : initialEntries;

  // Collect all page IDs for batch likes fetching
  const pageIds = useMemo(() => entries.map((entry) => entry.id), [entries]);

  const loadMore = useCallback(async () => {
    await setSize(size + 1);
  }, [setSize, size]);

  return (
    <BatchLikesProvider pageIds={pageIds} initialData={initialLikes}>
      <InfiniteScrollList
        as="div"
        items={entries}
        renderItem={(entry) => (
          <TilEntry key={entry.id} entry={entry} initialContent={initialContentMap.get(entry.id)} />
        )}
        onLoadMore={loadMore}
        isLoading={isLoading ?? false}
        isLoadingMore={isLoadingMore ?? false}
        isReachingEnd={isReachingEnd ?? false}
        className="flex flex-col gap-12 px-4"
      />
    </BatchLikesProvider>
  );
}
