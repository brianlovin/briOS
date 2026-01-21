"use client";

import Link from "next/link";
import { useCallback } from "react";
import useSWR from "swr";

import { InfiniteScrollList } from "@/components/InfiniteScrollList";
import { renderBlocks } from "@/components/renderBlocks";
import { fetcher } from "@/lib/fetcher";
import type { NotionTilItem, NotionTilItemWithContent } from "@/lib/notion";
import { buildSlug } from "@/lib/short-id";
import { useTilEntries } from "@/lib/til";

interface TilFeedProps {
  initialEntries: NotionTilItemWithContent[];
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
      <div className="text-tertiary text-base">{formatDate(entry.published)}</div>

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
      </div>
    </article>
  );
}

export function TilFeed({ initialEntries }: TilFeedProps) {
  const { items, isLoading, isLoadingMore, isReachingEnd, setSize, size } = useTilEntries();

  // Build a map of initial content for quick lookup
  const initialContentMap = new Map<string, NotionTilItemWithContent>(
    initialEntries.map((entry) => [entry.id, entry]),
  );

  // Use API-fetched items if available, otherwise fall back to initial entries
  const entries = items.length > 0 ? items : initialEntries;

  const loadMore = useCallback(async () => {
    await setSize(size + 1);
  }, [setSize, size]);

  return (
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
  );
}
