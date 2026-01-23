"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { StackFilters } from "@/components/stack/StackFilters";
import { LoadingSpinner, PreviewCardProvider, PreviewCardTrigger } from "@/components/ui";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { useStacks } from "@/lib/hooks/useStacks";
import type { StackItem as StackItemType } from "@/lib/stack";

import { useTopBarActions } from "../TopBarActions";

interface StackPageClientProps {
  initialData: StackItemType[];
}

export function StackPageClient({ initialData }: StackPageClientProps) {
  const { stacks, isInitialLoading, isValidating, isError } = useStacks(initialData);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePlatformFilter = (platform: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams(searchParams.toString());
    params.set("platform", platform);
    router.push(`/stack?${params.toString()}`);
  };

  const topBarContent = useMemo(
    () => (
      <span className="hidden md:block">
        <StackFilters />
      </span>
    ),
    [],
  );
  useTopBarActions(topBarContent);

  // Only show full page loading on initial load (without fallback data)
  if (isInitialLoading && stacks.length === 0) {
    return (
      <ListDetailWrapper>
        <div className="flex h-full flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      </ListDetailWrapper>
    );
  }

  if (isError) {
    return (
      <ListDetailWrapper>
        <div className="flex h-full w-full flex-1 items-center justify-center">
          <div className="text-secondary">Error loading stack data</div>
        </div>
      </ListDetailWrapper>
    );
  }

  return (
    <PreviewCardProvider>
      <ListDetailWrapper>
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Filters */}
          <div className="border-secondary flex border-b p-4 md:hidden">
            <StackFilters isLoading={isValidating && !isInitialLoading} />
          </div>

          {/* Table */}
          <div className="relative flex-1 overflow-auto">
            {/* Table Header - Sticky (hidden on mobile) */}
            <div className="bg-secondary border-secondary sticky top-0 z-10 hidden border-b md:block dark:bg-neutral-950">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium">
                <div className="col-span-3 text-left">Name</div>
                <div className="col-span-6 text-left">Description</div>
                <div className="col-span-3 text-left">Platforms</div>
              </div>
            </div>

            {/* Table Content */}
            <div
              className={`divide-secondary divide-y ${isValidating && !isInitialLoading ? "opacity-75 transition-opacity duration-200" : ""}`}
            >
              {stacks.map((item) => (
                <StackItemComponent
                  key={item.id}
                  item={item}
                  onPlatformClick={handlePlatformFilter}
                />
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
      </ListDetailWrapper>
    </PreviewCardProvider>
  );
}

interface StackItemComponentProps {
  item: StackItemType;
  onPlatformClick: (platform: string, e: React.MouseEvent) => void;
}

function StackItemComponent({ item, onPlatformClick }: StackItemComponentProps) {
  const [imageError, setImageError] = useState(false);

  // Determine the icon source: prefer icon over image
  const iconSource = item.icon || item.image;
  // Check if the icon is an emoji (single character, not a URL)
  const isEmoji = iconSource && !iconSource.startsWith("http") && iconSource.length <= 2;

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't navigate if user clicked on an interactive element
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
  };

  const content = (
    <div className="flex gap-3 px-4 py-3 md:grid md:grid-cols-12 md:items-center md:gap-4">
      {/* Icon/Image - shown on mobile, hidden on desktop */}
      {isEmoji ? (
        <div className="flex size-10 flex-none items-center justify-center rounded-xl text-2xl md:hidden">
          {iconSource}
        </div>
      ) : iconSource && !imageError ? (
        <Image
          width={48}
          height={48}
          src={iconSource}
          alt=""
          className="dark:shadow-contrast size-12 flex-none rounded-lg object-cover ring-[0.5px] ring-black/5 md:hidden"
          onError={() => setImageError(true)}
          unoptimized
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
            width={32}
            height={32}
            src={iconSource}
            alt=""
            className="dark:shadow-contrast hidden size-8 flex-none rounded-md object-cover ring-[0.5px] ring-black/5 md:block"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="bg-tertiary hidden size-6 flex-none rounded-md md:block" />
        )}
        <div className="min-w-0 flex-1">
          {/* Name is a real link for accessibility/right-click support */}
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary block truncate font-medium"
            >
              {item.name}
            </a>
          ) : (
            <span className="text-primary block truncate font-medium">{item.name}</span>
          )}
          <div className="text-tertiary md:hidden">{item.description}</div>
        </div>
      </div>

      {/* Description column - desktop only */}
      <div className="text-tertiary hidden md:col-span-6 md:block">{item.description}</div>

      {/* Platforms column - desktop only */}
      <div className="hidden flex-wrap gap-1 md:col-span-3 md:flex">
        {item.platforms?.map((platform) => (
          <PlatformBadge
            key={platform}
            platform={platform}
            onClick={(e) => onPlatformClick(platform, e)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="border-secondary hover:bg-secondary group relative cursor-pointer border-b md:dark:hover:bg-white/5"
      onClick={handleRowClick}
    >
      <PreviewCardTrigger
        payload={{
          url: item.url || "",
          name: item.name,
          description: item.description,
          icon: iconSource && !isEmoji ? iconSource : undefined,
          previewImage: item.previewImage,
        }}
      >
        {content}
      </PreviewCardTrigger>
    </div>
  );
}
