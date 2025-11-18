"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { ListeningHistoryPage, useListeningHistoryPaginated } from "@/hooks/useListeningHistory";

import { LoadingSpinner } from "./ui";

interface ListeningHistoryProps {
  initialData?: ListeningHistoryPage[];
}

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

  // eslint-disable-next-line
  const virtualizer = useVirtualizer({
    count: !isReachingEnd ? music.length + 1 : music.length, // Add 1 for loader row if more data available
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // Estimated row height in pixels
    overscan: 10, // Render 10 extra items outside viewport for smooth scrolling
  });

  const items = virtualizer.getVirtualItems();

  // Reset trigger when loading completes or data changes
  useEffect(() => {
    if (!isLoading && hasTriggeredLoad.current) {
      hasTriggeredLoad.current = false;
    }
  }, [isLoading, music.length]); // Dependency array now includes music.length

  // Effect to load more items when the loader row becomes visible
  useEffect(() => {
    const loaderItemVisible = items.some((item) => item.index === music.length);

    if (loaderItemVisible && !isReachingEnd && !isLoading && !hasTriggeredLoad.current) {
      hasTriggeredLoad.current = true; // Set this immediately
      // Defer setSize call slightly
      setTimeout(() => {
        setSize(size + 1);
      }, 0);
    }
  }, [items, music.length, isReachingEnd, isLoading, size, setSize]);

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
      <div className="min-w-fit">
        {/* Table Header - Now sticky within the scrollable container */}
        <div className="bg-secondary md:dark:bg-tertiary border-secondary sticky top-0 z-10 border-b">
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
            const isLoaderRow = virtualItem.index > music.length - 1;
            const item = music[virtualItem.index];

            return (
              <div
                key={virtualItem.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="border-secondary hover:bg-secondary relative border-b dark:hover:bg-white/5"
              >
                {item?.url && <Link target="_blank" href={item.url} className="absolute inset-0" />}
                {isLoaderRow ? (
                  <div className="flex h-full items-center justify-center">
                    {!isReachingEnd ? <LoadingSpinner /> : null}
                    {/* Trigger load when loader row is rendered - This logic is now in a useEffect hook */}
                  </div>
                ) : item ? (
                  <div className="flex h-full items-center gap-4 px-4 py-1 text-sm">
                    <div className="flex min-w-[200px] flex-1 items-center gap-3">
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt=""
                          className="h-5 w-5 flex-none rounded object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-primary block truncate font-medium">{item.name}</span>
                      </div>
                    </div>
                    <div className="text-tertiary min-w-[150px] flex-1 truncate">{item.artist}</div>
                    <div className="text-tertiary min-w-[150px] flex-1 truncate">{item.album}</div>
                    <div className="text-tertiary min-w-[120px] whitespace-nowrap">
                      {new Date(item.playedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
