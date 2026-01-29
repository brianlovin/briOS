"use client";

import { Dithering } from "@paper-design/shaders-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { LikeButton } from "@/components/likes/LikeButton";
import type { GoodWebsiteItem } from "@/lib/goodWebsites";
import { useLikes } from "@/lib/hooks/useLikes";
import { cn } from "@/lib/utils";

interface GoodWebsiteGalleryItemProps {
  item: GoodWebsiteItem;
}

function PlaceholderShader() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Dithering
      speed={0.17}
      shape="warp"
      type="4x4"
      size={3.4}
      scale={1.98}
      colorBack="#00000000"
      colorFront={isDark ? "#1F1F1F" : "#eeeeee"}
      className="absolute inset-0"
      style={{ backgroundColor: isDark ? "#000000" : "#f6f7f8", width: "100%", height: "100%" }}
    />
  );
}

const hoverAnimationProps = {
  initial: { opacity: 0, y: 4, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 4, scale: 0.96 },
  transition: { duration: 0.15, ease: "easeOut" as const },
};

export function GoodWebsiteGalleryItem({ item }: GoodWebsiteGalleryItemProps) {
  const [imageStatus, setImageStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [isHovered, setIsHovered] = useState(false);
  const { hasLiked } = useLikes(item.id);

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
          <PlaceholderShader />
        )}

        {/* Site name pill - always visible on mobile, animated on desktop */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4">
          {/* Mobile: always visible, no animation */}
          <div className="flex h-7 min-w-0 items-center self-start rounded-full bg-black/50 px-2.5 saturate-150 backdrop-blur-3xl hover:bg-black/90 sm:hidden">
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
