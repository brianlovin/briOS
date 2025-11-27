"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { GoodWebsitesFilters } from "@/components/good-websites/GoodWebsitesFilters";
import { TopBar } from "@/components/TopBar";
import { LoadingSpinner } from "@/components/ui";
import type { GoodWebsiteItem } from "@/lib/goodWebsites";
import { useGoodWebsites } from "@/lib/hooks/useGoodWebsites";

import { Linked } from "../icons/Linked";
import { XIcon } from "../icons/SocialIcons";

interface GoodWebsitesPageClientProps {
  initialData: GoodWebsiteItem[];
}

export function GoodWebsitesPageClient({ initialData }: GoodWebsitesPageClientProps) {
  const { goodWebsites, isInitialLoading, isValidating, isError } = useGoodWebsites(initialData);

  // Only show full page loading on initial load (without fallback data)
  if (isInitialLoading && goodWebsites.length === 0) {
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
          <div className="text-secondary">Error loading good websites data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <TopBar>
        <div className="font-medium">Good websites</div>
        <div className="flex-1" />
        {/* Filters */}
        <div className="hidden md:block">
          <GoodWebsitesFilters isLoading={isValidating && !isInitialLoading} />
        </div>
      </TopBar>

      <div className="border-secondary flex border-b p-2 md:hidden">
        <GoodWebsitesFilters isLoading={isValidating && !isInitialLoading} />
      </div>

      {/* Table */}
      <div className="relative flex-1 overflow-auto">
        {/* Table Header - Sticky (hidden on mobile) */}
        <div className="bg-secondary md:dark:bg-tertiary border-secondary sticky top-0 z-20 hidden border-b md:block">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium">
            <div className="col-span-7 text-left text-[13px]">Name</div>
            <div className="col-span-3 text-left text-[13px]">Site</div>
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
  );
}

function GoodWebsiteItemComponent({ item }: { item: GoodWebsiteItem }) {
  const [iconError, setIconError] = useState(false);

  return (
    <div className="border-secondary hover:bg-secondary group relative border-b md:dark:hover:bg-white/5">
      {item.url && <Link target="_blank" href={item.url} className="absolute inset-0" />}
      <div className="flex gap-3 px-4 py-3 text-sm md:grid md:grid-cols-12 md:items-center md:gap-4">
        {/* Icon - shown on mobile, hidden on desktop */}
        {item.icon && !iconError ? (
          <Image
            width={40}
            height={40}
            src={item.icon}
            alt=""
            className="size-10 flex-none rounded-md object-cover md:hidden"
            onError={() => setIconError(true)}
            unoptimized
          />
        ) : (
          <div className="flex size-10 flex-none items-center justify-center rounded-md md:hidden">
            <Linked className="text-neutral-500" />
          </div>
        )}

        {/* Name column - contains icon on desktop */}
        <div className="min-w-0 flex-1 md:col-span-7 md:flex md:items-center md:gap-3">
          {/* Icon - hidden on mobile, shown on desktop */}
          {item.icon && !iconError ? (
            <Image
              width={24}
              height={24}
              src={item.icon}
              alt=""
              className="hidden size-6 flex-none rounded-md object-cover md:block"
              onError={() => setIconError(true)}
              unoptimized
            />
          ) : (
            <div className="hidden size-6 flex-none items-center justify-center rounded-md md:flex">
              <Linked className="text-neutral-500" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <span className="text-primary block truncate font-medium">{item.name}</span>
            {/* URL - shown on mobile below name */}
            {item.url && (
              <div className="text-tertiary truncate text-sm md:hidden">
                {item.url
                  .replace(/^https?:\/\//, "")
                  .replace(/\/$/, "")
                  .replace("www.", "")}
              </div>
            )}
          </div>
        </div>

        {/* Good Website URL - desktop only */}
        <div className="hidden md:col-span-3 md:block">
          {item.url && (
            <Link
              target="_blank"
              href={item.url}
              className="text-tertiary hover:text-primary relative z-10 truncate text-sm"
            >
              {item.url
                .replace(/^https?:\/\//, "")
                .replace(/\/$/, "")
                .replace("www.", "")}
            </Link>
          )}
        </div>

        {/* X (Twitter) URL - desktop only */}
        <div className="hidden md:col-span-2 md:block">
          {item.x && (
            <Link
              href={item.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-tertiary hover:text-primary relative z-10 truncate text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <XIcon size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
