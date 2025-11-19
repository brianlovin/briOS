"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { StackFilters } from "@/components/stack/StackFilters";
import { TopBar } from "@/components/TopBar";
import { LoadingSpinner } from "@/components/ui";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { useStacks } from "@/lib/hooks/useStacks";
import type { StackItem } from "@/lib/stack";

interface StackPageClientProps {
  initialData: StackItem[];
}

export function StackPageClient({ initialData }: StackPageClientProps) {
  const { stacks, isInitialLoading, isValidating, isError } = useStacks(initialData);

  // Only show full page loading on initial load (without fallback data)
  if (isInitialLoading && stacks.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="flex h-full flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="flex h-32 items-center justify-center">
          <div className="text-secondary">Error loading stack data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <TopBar>
        <div className="text-sm font-medium">My Stack</div>
        <div className="flex-1" />

        {/* Filters */}
        <div className="hidden md:block">
          <StackFilters isLoading={isValidating && !isInitialLoading} />
        </div>
      </TopBar>

      <div className="border-secondary flex border-b p-2 md:hidden">
        <StackFilters isLoading={isValidating && !isInitialLoading} />
      </div>

      {/* Table */}
      <div className="relative flex-1 overflow-auto">
        {/* Table Header - Sticky (hidden on mobile) */}
        <div className="bg-secondary md:dark:bg-tertiary border-secondary sticky top-0 z-10 hidden border-b md:block">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium">
            <div className="col-span-3 text-left text-[13px]">Name</div>
            <div className="col-span-6 text-left text-[13px]">Description</div>
            <div className="col-span-3 text-left text-[13px]">Platforms</div>
          </div>
        </div>

        {/* Table Content */}
        <div
          className={`divide-secondary divide-y ${isValidating && !isInitialLoading ? "opacity-75 transition-opacity duration-200" : ""}`}
        >
          {stacks.map((item) => (
            <StackItem key={item.id} item={item} />
          ))}
        </div>

        {/* Empty state */}
        {stacks.length === 0 && !isValidating && (
          <div className="flex h-32 items-center justify-center">
            <div className="text-secondary">No stack items found</div>
          </div>
        )}

        {/* Loading state for empty results during filter changes */}
        {stacks.length === 0 && isValidating && (
          <div className="flex h-32 items-center justify-center">
            <div className="text-secondary">Loading filtered results...</div>
          </div>
        )}
      </div>
    </div>
  );
}

function StackItem({ item }: { item: StackItem }) {
  const [imageError, setImageError] = useState(false);

  // Determine the icon source: prefer icon over image
  const iconSource = item.icon || item.image;
  // Check if the icon is an emoji (single character, not a URL)
  const isEmoji = iconSource && !iconSource.startsWith("http") && iconSource.length <= 2;

  return (
    <div className="border-secondary hover:bg-secondary group relative border-b md:dark:hover:bg-white/5">
      {item.url && <Link target="_blank" href={item.url} className="absolute inset-0" />}
      <div className="flex gap-3 px-4 py-3 text-sm md:grid md:grid-cols-12 md:items-center md:gap-4">
        {/* Icon/Image - shown on mobile, hidden on desktop */}
        {isEmoji ? (
          <div className="flex size-10 flex-none items-center justify-center rounded-xl text-2xl md:hidden">
            {iconSource}
          </div>
        ) : iconSource && !imageError ? (
          <Image
            width={40}
            height={40}
            src={iconSource}
            alt=""
            className="dark:shadow-contrast size-10 flex-none rounded-lg object-cover ring-[0.5px] ring-black/5 md:hidden"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="bg-tertiary size-10 flex-none rounded-xl md:hidden" />
        )}

        {/* Name + Description container (mobile), Name column (desktop) */}
        <div className="min-w-0 flex-1 md:col-span-3 md:flex md:items-center md:gap-3">
          {/* Icon/Image - hidden on mobile, shown on desktop */}
          {isEmoji ? (
            <div className="hidden size-6 flex-none items-center justify-center rounded-md text-base md:flex">
              {iconSource}
            </div>
          ) : iconSource && !imageError ? (
            <Image
              width={24}
              height={24}
              src={iconSource}
              alt=""
              className="dark:shadow-contrast hidden size-6 flex-none rounded-md object-cover ring-[0.5px] ring-black/5 md:block"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="bg-tertiary hidden size-6 flex-none rounded-md md:block" />
          )}
          <div className="min-w-0 flex-1">
            <span className="text-primary block truncate font-medium">{item.name}</span>
            <div className="text-tertiary text-sm md:hidden">{item.description}</div>
          </div>
        </div>

        {/* Description column - desktop only */}
        <div className="text-tertiary hidden text-sm md:col-span-6 md:block">
          {item.description}
        </div>

        {/* Platforms column - desktop only */}
        <div className="hidden flex-wrap gap-1 md:col-span-3 md:flex">
          {item.platforms?.map((platform) => (
            <PlatformBadge key={platform} platform={platform} />
          ))}
        </div>
      </div>
    </div>
  );
}
