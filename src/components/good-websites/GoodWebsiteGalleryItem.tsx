"use client";

import { useState } from "react";

import { LikeButton } from "@/components/likes/LikeButton";
import type { GoodWebsiteItem } from "@/lib/goodWebsites";
import { cn } from "@/lib/utils";

import { Linked } from "../icons/Linked";

interface GoodWebsiteGalleryItemProps {
  item: GoodWebsiteItem;
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  );
}

export function GoodWebsiteGalleryItem({ item }: GoodWebsiteGalleryItemProps) {
  const [imageStatus, setImageStatus] = useState<"loading" | "loaded" | "error">("loading");

  const handleClick = () => {
    if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
  };

  const formattedUrl = item.url
    ?.replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .replace("www.", "");

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg"
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="bg-tertiary relative aspect-[40/21] w-full overflow-hidden">
        {item.previewImage && imageStatus !== "error" ? (
          <>
            {imageStatus === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <GlobeIcon className="text-quaternary size-8" />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.previewImage}
              alt={`Preview of ${item.name}`}
              className={cn(
                "h-full w-full object-cover object-top transition-all duration-300",
                imageStatus === "loaded" ? "opacity-100" : "opacity-0",
                "group-hover:scale-105",
              )}
              onLoad={() => setImageStatus("loaded")}
              onError={() => setImageStatus("error")}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <GlobeIcon className="text-quaternary size-8" />
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4",
            "opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          )}
        >
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white">{item.name}</div>
              {formattedUrl && (
                <div className="flex items-center gap-1 text-xs text-white/70">
                  <Linked size={12} />
                  <span className="truncate">{formattedUrl}</span>
                </div>
              )}
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <LikeButton pageId={item.id} variant="ghost-light" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
