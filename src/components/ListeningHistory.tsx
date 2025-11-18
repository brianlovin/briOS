"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

import {
  ListeningHistoryPage,
  MusicItem,
  useListeningHistoryPaginated,
} from "@/hooks/useListeningHistory";

import { LoadingSpinner } from "./ui";

interface ListeningHistoryProps {
  initialData?: ListeningHistoryPage[];
}

type VirtualItem =
  | { type: "header"; date: string; id: string }
  | { type: "song"; song: MusicItem; id: string }
  | { type: "loader"; id: string };

export function ListeningHistory({ initialData }: ListeningHistoryProps = {}) {
  const {
    items: music,
    isLoading,
    isError,
    setSize,
    size,
    isReachingEnd,
  } = useListeningHistoryPaginated(initialData);
  const parentRef = useRef<HTMLDivElement>(null);
  const hasTriggeredLoad = useRef(false);

  // Group songs by date for mobile view
  const groupedItems = useMemo(() => {
    const items: VirtualItem[] = [];
    let currentDate = "";

    music.forEach((song) => {
      const playDate = new Date(song.playedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      if (playDate !== currentDate) {
        currentDate = playDate;
        items.push({ type: "header", date: playDate, id: `header-${playDate}` });
      }

      items.push({ type: "song", song, id: song.id });
    });

    // Add loader if more data is available
    if (!isReachingEnd) {
      items.push({ type: "loader", id: "loader" });
    }

    return items;
  }, [music, isReachingEnd]);

  // eslint-disable-next-line
  const virtualizer = useVirtualizer({
    count: groupedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = groupedItems[index];
      if (!item) return 40;
      // Header height: ~32px (smaller on mobile)
      // Song height: ~40px on desktop, ~80px on mobile
      // Loader height: ~40px
      if (item.type === "header") return 32;
      if (item.type === "loader") return 40;
      return 80; // Default to mobile song height
    },
    overscan: 10,
  });

  const items = virtualizer.getVirtualItems();

  // Reset trigger when loading completes or data changes
  useEffect(() => {
    if (!isLoading && hasTriggeredLoad.current) {
      hasTriggeredLoad.current = false;
    }
  }, [isLoading, music.length]);

  // Effect to load more items when the loader row becomes visible
  useEffect(() => {
    const loaderItemVisible = items.some((virtualItem) => {
      const item = groupedItems[virtualItem.index];
      return item?.type === "loader";
    });

    if (loaderItemVisible && !isReachingEnd && !isLoading && !hasTriggeredLoad.current) {
      hasTriggeredLoad.current = true;
      setTimeout(() => {
        setSize(size + 1);
      }, 0);
    }
  }, [items, groupedItems, isReachingEnd, isLoading, size, setSize]);

  if (isLoading && music.length === 0) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="flex h-32 items-center justify-center">
          <div className="text-secondary">Error loading music data</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-auto"
      style={{
        contain: "strict",
      }}
    >
      {/* Desktop table header - hidden on mobile */}
      <div className="bg-secondary md:dark:bg-tertiary border-secondary sticky top-0 z-10 hidden border-b md:block">
        <div className="flex gap-4 px-4 py-2 text-sm font-medium">
          <div className="min-w-[200px] flex-1 text-left">Song</div>
          <div className="min-w-[150px] flex-1 text-left">Artist</div>
          <div className="min-w-[150px] flex-1 text-left">Album</div>
          <div className="min-w-[120px] text-left">Played</div>
        </div>
      </div>

      {/* Virtualized Content */}
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {items.map((virtualItem) => {
          const item = groupedItems[virtualItem.index];
          if (!item) return null;

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {item.type === "header" && (
                <div className="bg-primary sticky top-0 z-10 px-4 py-2 text-xs font-semibold tracking-wider uppercase md:top-[41px]">
                  {item.date}
                </div>
              )}

              {item.type === "song" && (
                <div className="border-secondary group relative border-b">
                  {item.song.url && (
                    <Link target="_blank" href={item.song.url} className="absolute inset-0 z-10" />
                  )}

                  {/* Mobile Layout */}
                  <div className="hover:bg-secondary flex items-center gap-3 px-4 py-3 md:hidden dark:hover:bg-white/5">
                    {item.song.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.song.image}
                        alt=""
                        className="h-14 w-14 flex-none rounded object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-primary truncate font-medium">{item.song.name}</div>
                      <div className="text-tertiary truncate text-sm">{item.song.artist}</div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hover:bg-secondary hidden h-full items-center gap-4 px-4 py-1 text-sm md:flex dark:hover:bg-white/5">
                    <div className="flex min-w-[200px] flex-1 items-center gap-3">
                      {item.song.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.song.image}
                          alt=""
                          className="h-5 w-5 flex-none rounded object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-primary block truncate font-medium">
                          {item.song.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-tertiary min-w-[150px] flex-1 truncate">
                      {item.song.artist}
                    </div>
                    <div className="text-tertiary min-w-[150px] flex-1 truncate">
                      {item.song.album}
                    </div>
                    <div className="text-tertiary min-w-[120px] whitespace-nowrap">
                      {new Date(item.song.playedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              )}

              {item.type === "loader" && (
                <div className="flex h-full items-center justify-center">
                  {!isReachingEnd ? <LoadingSpinner /> : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
