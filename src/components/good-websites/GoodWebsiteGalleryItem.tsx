"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { LikeButton } from "@/components/likes/LikeButton";
import { PlaceholderShader } from "@/components/ui/PlaceholderShader";
import type { GoodWebsiteItem } from "@/lib/goodWebsites";
import { useLikes } from "@/lib/hooks/useLikes";
import { imageCache } from "@/lib/imageCache";

interface GoodWebsiteGalleryItemProps {
  item: GoodWebsiteItem;
}

const hoverAnimationProps = {
  initial: { opacity: 0, y: 4, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 4, scale: 0.96 },
  transition: { duration: 0.15, ease: "easeOut" as const },
};

export function GoodWebsiteGalleryItem({ item }: GoodWebsiteGalleryItemProps) {
  // Check if image is already cached (from previous view or browser cache)
  const isCached = item.previewImage ? imageCache.has(item.previewImage) : false;
  const [imageStatus, setImageStatus] = useState<"loading" | "loaded" | "error">(
    isCached ? "loaded" : "loading",
  );
  const [isHovered, setIsHovered] = useState(false);
  const { hasLiked } = useLikes(item.id);

  // Preload image using Image API to avoid broken image flicker
  useEffect(() => {
    if (!item.previewImage || isCached) return;

    const img = new Image();
    img.onload = () => {
      imageCache.add(item.previewImage!);
      setImageStatus("loaded");
    };
    img.onerror = () => setImageStatus("error");
    img.src = item.previewImage;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [item.previewImage, isCached]);

  const handleClick = () => {
    if (item.url?.trim()) window.open(item.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="group rounded-px relative cursor-pointer overflow-hidden"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="bg-tertiary relative aspect-40/21 w-full overflow-hidden">
        {item.previewImage && imageStatus !== "error" ? (
          <>
            {imageStatus === "loading" && <PlaceholderShader />}
            {imageStatus === "loaded" && (
              <picture className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.02]">
                {item.previewImageDark && (
                  <source srcSet={item.previewImageDark} media="(prefers-color-scheme: dark)" />
                )}
                <img
                  src={item.previewImage}
                  alt={`Preview of ${item.name}`}
                  className="h-full w-full object-cover object-top"
                />
              </picture>
            )}
          </>
        ) : (
          <PlaceholderShader />
        )}

        {/* Site name pill - always visible on mobile, animated on desktop */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4">
          {/* Mobile: always visible, no animation */}
          <div className="flex h-7 min-w-0 items-center self-start rounded-full bg-black/50 px-2.5 saturate-150 backdrop-blur-3xl sm:hidden">
            <span className="truncate text-sm font-medium text-white">{item.name}</span>
          </div>
          {/* Desktop: animated on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="pointer-events-auto hidden h-7 min-w-0 items-center self-start rounded-full bg-black/50 px-2.5 saturate-150 backdrop-blur-3xl hover:bg-black/90 sm:flex"
                {...hoverAnimationProps}
              >
                <span className="truncate text-sm font-medium text-white">{item.name}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Like button - always visible on mobile, or when liked, otherwise animated on hover */}
        <div className="absolute right-4 bottom-4" onClick={(e) => e.stopPropagation()}>
          {/* Mobile: always visible */}
          <div className="sm:hidden">
            <LikeButton pageId={item.id} variant="ghost-light" />
          </div>
          {/* Desktop: permanently visible if liked, otherwise animated on hover */}
          <div className="hidden sm:block">
            {hasLiked ? (
              <LikeButton pageId={item.id} variant="ghost-light" />
            ) : (
              <AnimatePresence>
                {isHovered && (
                  <motion.div {...hoverAnimationProps}>
                    <LikeButton pageId={item.id} variant="ghost-light" />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
