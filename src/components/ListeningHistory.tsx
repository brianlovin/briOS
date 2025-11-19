"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ListeningHistoryPage, useListeningHistoryPaginated } from "@/hooks/useListeningHistory";

import { LoadingSpinner } from "./ui";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Check on mount
    checkMobile();

    // Listen for resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

interface ListeningHistoryProps {
  initialData?: ListeningHistoryPage[];
}

interface ListeningHistoryRowProps {
  item: {
    name: string;
    artist: string;
    album: string;
    image?: string;
    url?: string;
    playedAt: string;
  };
}

function ListeningHistoryRow({ item }: ListeningHistoryRowProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex h-full gap-3 px-4 py-3 text-sm md:items-center md:gap-4 md:py-1">
      {item.url && <Link target="_blank" href={item.url} className="absolute inset-0" />}

      {/* Image - shown on mobile, hidden on desktop */}
      {item.image && !imageError ? (
        <Image
          width={40}
          height={40}
          src={item.image}
          alt=""
          className="dark:shadow-contrast size-10 flex-none rounded object-cover ring-[0.5px] ring-black/5 md:hidden"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="bg-tertiary size-10 flex-none rounded md:hidden" />
      )}

      {/* Song name + Artist (mobile), Song column (desktop) */}
      <div className="min-w-0 flex-1 md:flex md:min-w-[200px] md:items-center md:gap-3">
        {/* Image - hidden on mobile, shown on desktop */}
        {item.image && !imageError ? (
          <Image
            width={20}
            height={20}
            src={item.image}
            alt=""
            className="hidden size-5 flex-none rounded object-cover md:block"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="bg-tertiary hidden size-5 flex-none rounded md:block" />
        )}
        <div className="min-w-0 flex-1">
          <span className="text-primary block truncate font-medium">{item.name}</span>
          <div className="text-tertiary truncate text-sm md:hidden">{item.artist}</div>
        </div>
      </div>

      {/* Desktop-only columns */}
      <div className="text-tertiary hidden min-w-[150px] flex-1 truncate md:block">
        {item.artist}
      </div>
      <div className="text-tertiary hidden min-w-[150px] flex-1 truncate md:block">
        {item.album}
      </div>
      <div className="text-tertiary hidden min-w-[120px] whitespace-nowrap md:block">
        {new Date(item.playedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    </div>
  );
}

function LoaderRow({ isReachingEnd }: { isReachingEnd: boolean }) {
  return (
    <div className="flex h-full items-center justify-center">
      {!isReachingEnd ? <LoadingSpinner /> : null}
    </div>
  );
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
  const isMobile = useIsMobile();

  // eslint-disable-next-line
  const virtualizer = useVirtualizer({
    count: !isReachingEnd ? music.length + 1 : music.length, // Add 1 for loader row if more data available
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isMobile ? 64 : 40), // Mobile: 64px (py-3 + 40px image + text), Desktop: 40px
    overscan: 10, // Render 10 extra items outside viewport for smooth scrolling
  });

  const items = virtualizer.getVirtualItems();

  // Recalculate virtualizer measurements when viewport size changes
  useEffect(() => {
    virtualizer.measure();
  }, [isMobile, virtualizer]);

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
        {/* Table Header - Desktop only */}
        <div className="bg-secondary md:dark:bg-tertiary border-secondary sticky top-0 z-10 hidden border-b md:block">
          <div className="flex gap-4 px-4 py-2 text-sm font-medium">
            <div className="min-w-[200px] flex-1 text-left text-[13px]">Song</div>
            <div className="min-w-[150px] flex-1 text-left text-[13px]">Artist</div>
            <div className="min-w-[150px] flex-1 text-left text-[13px]">Album</div>
            <div className="min-w-[120px] text-left text-[13px]">Played</div>
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
                {isLoaderRow ? (
                  <LoaderRow isReachingEnd={isReachingEnd} />
                ) : item ? (
                  <ListeningHistoryRow item={item} />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
