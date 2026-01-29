"use client";

import { useAtom } from "jotai";
import Image from "next/image";
import { useMemo, useState, useSyncExternalStore } from "react";

import { sitesViewModeAtom } from "@/atoms/sitesViewMode";
import { GoodWebsiteGalleryItem } from "@/components/good-websites/GoodWebsiteGalleryItem";
import { GoodWebsitesFilters } from "@/components/good-websites/GoodWebsitesFilters";
import { ViewToggle } from "@/components/good-websites/ViewToggle";
import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { LoadingSpinner, PreviewCardProvider, PreviewCardTrigger } from "@/components/ui";
import type { GoodWebsiteItem } from "@/lib/goodWebsites";
import { useGoodWebsites } from "@/lib/hooks/useGoodWebsites";
import type { LikeData } from "@/lib/hooks/useLikes";

import { Linked } from "../icons/Linked";
import { XIcon } from "../icons/SocialIcons";
import { useTopBarActions } from "../TopBarActions";

interface GoodWebsitesPageClientProps {
  initialData: GoodWebsiteItem[];
  initialLikes?: Record<string, LikeData>;
}

// Hydration check using useSyncExternalStore to avoid layout flicker
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function GoodWebsitesPageClient({ initialData, initialLikes }: GoodWebsitesPageClientProps) {
  const { goodWebsites, isInitialLoading, isValidating, isError } = useGoodWebsites(initialData);
  const [viewMode, setViewMode] = useAtom(sitesViewModeAtom);
  const isHydrated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Collect all page IDs for batch likes fetching
  const pageIds = useMemo(() => goodWebsites.map((item) => item.id), [goodWebsites]);

  const topBarContent = useMemo(
    () => (
      <span className="hidden items-center gap-3 md:flex">
        <ViewToggle view={viewMode} onChange={setViewMode} />
        <GoodWebsitesFilters />
      </span>
    ),
    [viewMode, setViewMode],
  );
  useTopBarActions(topBarContent);

  // Wait for hydration to avoid layout flicker from view mode preference
  // Also show loading on initial data load (without fallback data)
  if (!isHydrated || (isInitialLoading && goodWebsites.length === 0)) {
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
          <div className="text-secondary">Error loading good websites data</div>
        </div>
      </ListDetailWrapper>
    );
  }

  return (
    <BatchLikesProvider pageIds={pageIds} initialData={initialLikes}>
      <PreviewCardProvider>
        <ListDetailWrapper>
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Filters - mobile only */}
            <div className="border-secondary flex items-center justify-between border-b p-4 md:hidden">
              <ViewToggle view={viewMode} onChange={setViewMode} />
              <GoodWebsitesFilters isLoading={isValidating && !isInitialLoading} />
            </div>

            {/* Content */}
            <div className="relative flex-1 overflow-auto">
              {viewMode === "list" ? (
                <>
                  {/* Table Header - Sticky (hidden on mobile) */}
                  <div className="bg-secondary border-secondary sticky top-0 z-20 hidden border-b md:block dark:bg-neutral-950">
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 font-medium">
                      <div className="col-span-7 text-left">Name</div>
                      <div className="col-span-3 text-left">Site</div>
                      <div className="col-span-1" />
                      <div className="col-span-1" />
                    </div>
                  </div>

                  {/* Table Content */}
                  <div
                    className={`divide-secondary divide-y ${isValidating && !isInitialLoading ? "opacity-75 transition-opacity duration-200" : ""}`}
                  >
                    {goodWebsites.map((item) => (
                      <GoodWebsiteItemComponent key={item.id} item={item} />
                    ))}
                  </div>
                </>
              ) : (
                /* Gallery View */
                <div
                  className={`bg-tertiary grid grid-cols-1 gap-0.5 p-0.5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 dark:bg-transparent ${isValidating && !isInitialLoading ? "opacity-75 transition-opacity duration-200" : ""}`}
                >
                  {goodWebsites.map((item) => (
                    <GoodWebsiteGalleryItem key={item.id} item={item} />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {goodWebsites.length === 0 && !isValidating && (
                <div className="flex h-32 items-center justify-center">
                  <div className="text-secondary">No good websites found</div>
                </div>
              )}

              {/* Loading state for empty results */}
              {goodWebsites.length === 0 && isValidating && (
                <div className="flex h-32 items-center justify-center">
                  <div className="text-secondary">Loading good websites...</div>
                </div>
              )}
            </div>
          </div>
        </ListDetailWrapper>
      </PreviewCardProvider>
    </BatchLikesProvider>
  );
}

function GoodWebsiteItemComponent({ item }: { item: GoodWebsiteItem }) {
  const [iconError, setIconError] = useState(false);

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't navigate if user clicked on an interactive element
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
  };

  const content = (
    <div className="flex gap-3 px-4 py-3 md:grid md:grid-cols-12 md:items-center md:gap-4">
      {/* Icon - shown on mobile, hidden on desktop */}
      {item.icon && !iconError ? (
        <Image
          width={48}
          height={48}
          src={item.icon}
          alt=""
          className="size-12 flex-none rounded-md object-cover md:hidden"
          onError={() => setIconError(true)}
          unoptimized
        />
      ) : (
        <div className="flex size-12 flex-none items-center justify-center rounded-md md:hidden">
          <Linked size={24} className="text-quaternary" />
        </div>
      )}

      {/* Name column - contains icon on desktop */}
      <div className="min-w-0 flex-1 md:col-span-7 md:flex md:items-center md:gap-3">
        {/* Icon - hidden on mobile, shown on desktop */}
        {item.icon && !iconError ? (
          <Image
            width={32}
            height={32}
            src={item.icon}
            alt=""
            className="hidden size-8 flex-none rounded-md object-cover md:block"
            onError={() => setIconError(true)}
            unoptimized
          />
        ) : (
          <div className="hidden size-8 flex-none items-center justify-center rounded-md md:flex">
            <Linked size={24} className="text-quaternary" />
          </div>
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
          {/* URL - shown on mobile below name */}
          {item.url && (
            <div className="text-tertiary truncate md:hidden">
              {item.url
                .replace(/^https?:\/\//, "")
                .replace(/\/$/, "")
                .replace("www.", "")}
            </div>
          )}
        </div>
      </div>

      {/* Like button - mobile only, positioned at start */}
      <div className="flex-none self-center md:hidden" onClick={(e) => e.stopPropagation()}>
        <LikeButton pageId={item.id} />
      </div>

      {/* Good Website URL - desktop only */}
      <div className="hidden md:col-span-3 md:block">
        {item.url && (
          <span className="text-tertiary truncate">
            {item.url
              .replace(/^https?:\/\//, "")
              .replace(/\/$/, "")
              .replace("www.", "")}
          </span>
        )}
      </div>

      {/* X (Twitter) URL - desktop only */}
      <div className="hidden md:col-span-1 md:block">
        {item.x && (
          <a
            href={item.x}
            target="_blank"
            rel="noopener noreferrer"
            className="text-tertiary hover:text-primary"
          >
            <XIcon size={16} />
          </a>
        )}
      </div>

      {/* Likes column - desktop only */}
      <div className="hidden md:col-span-1 md:flex" onClick={(e) => e.stopPropagation()}>
        <LikeButton pageId={item.id} />
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
          icon: item.icon,
          previewImage: item.previewImage,
          previewImageDark: item.previewImageDark,
        }}
      >
        {content}
      </PreviewCardTrigger>
    </div>
  );
}
