"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import { motion, MotionValue, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import type { NotionAppDissectionItem } from "@/lib/notion/types";

const SCALE = 1.4; // max scale factor of an icon
const DISTANCE = 110; // pixels before mouse affects an icon
const NUDGE = 30; // pixels icons are moved away from mouse
const SPRING = {
  mass: 0.1,
  stiffness: 150,
  damping: 7,
};

// Number of items to show on each side of current item
const ITEMS_PER_SIDE_DESKTOP = 3; // Shows 7 total (current + 3 on each side)

interface Props {
  items: NotionAppDissectionItem[];
  currentSlug: string;
}

export function AppDissectionDock({ items, currentSlug }: Props) {
  const mouseLeft = useMotionValue(-Infinity);
  const mouseRight = useMotionValue(-Infinity);
  const left = useTransform(mouseLeft, [0, 40], [0, -40]);
  const right = useTransform(mouseRight, [0, 40], [0, -40]);
  const leftSpring = useSpring(left, SPRING);
  const rightSpring = useSpring(right, SPRING);

  // Find current item index
  const currentIndex = items.findIndex((item) => item.slug === currentSlug);

  // Calculate visible items - always try to show 7 total, redistributing as needed
  const totalToShow = ITEMS_PER_SIDE_DESKTOP * 2 + 1; // 7 for desktop (3 + 1 + 3)
  const halfWindow = Math.floor(totalToShow / 2); // 3

  // Start with centered window
  let startIndex = currentIndex - halfWindow;
  let endIndex = currentIndex + halfWindow + 1; // +1 because slice is exclusive

  // Adjust if we're near the beginning - show more on the right
  if (startIndex < 0) {
    endIndex = Math.min(items.length, endIndex + Math.abs(startIndex));
    startIndex = 0;
  }

  // Adjust if we're near the end - show more on the left
  if (endIndex > items.length) {
    startIndex = Math.max(0, startIndex - (endIndex - items.length));
    endIndex = items.length;
  }

  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div className="relative mx-auto flex items-center gap-2">
      <motion.div
        onMouseMove={(e) => {
          const { left, right } = e.currentTarget.getBoundingClientRect();
          const offsetLeft = e.clientX - left;
          const offsetRight = right - e.clientX;
          mouseLeft.set(offsetLeft);
          mouseRight.set(offsetRight);
        }}
        onMouseLeave={() => {
          mouseLeft.set(-Infinity);
          mouseRight.set(-Infinity);
        }}
        className="relative flex h-16 items-end gap-3 px-2 pb-3"
      >
        <motion.div
          className="bg-secondary/50 dark:bg-secondary/30 border-secondary/50 dark:border-secondary/20 absolute inset-y-0 -z-10 rounded-2xl border shadow-lg backdrop-blur-xl"
          style={{ left: leftSpring, right: rightSpring }}
        />

        {visibleItems.map((item) => (
          <AppIcon key={item.slug} mouseLeft={mouseLeft} item={item} currentSlug={currentSlug} />
        ))}
      </motion.div>
    </div>
  );
}

interface AppIconProps {
  mouseLeft: MotionValue;
  item: NotionAppDissectionItem;
  currentSlug: string;
}

function AppIcon({ mouseLeft, item, currentSlug }: AppIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isActive = item.slug === currentSlug;

  const distance = useTransform(() => {
    const bounds = ref.current
      ? { x: ref.current.offsetLeft, width: ref.current.offsetWidth }
      : { x: 0, width: 0 };

    return mouseLeft.get() - bounds.x - bounds.width / 2;
  });

  const scale = useTransform(distance, [-DISTANCE, 0, DISTANCE], [1, SCALE, 1]);
  const x = useTransform(() => {
    const d = distance.get();
    if (d === -Infinity) {
      return 0;
    } else if (d < -DISTANCE || d > DISTANCE) {
      return Math.sign(d) * -1 * NUDGE;
    } else {
      return (-d / DISTANCE) * NUDGE * scale.get();
    }
  });

  const scaleSpring = useSpring(scale, SPRING);
  const xSpring = useSpring(x, SPRING);

  return (
    <Tooltip.Provider delay={0}>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <motion.div
              ref={ref}
              style={{ x: xSpring, scale: scaleSpring, translateZ: 0 }}
              className="relative origin-bottom"
            />
          }
        >
          <Link
            href={`/app-dissection/${item.slug}`}
            className="relative block will-change-transform"
          >
            {item.icon ? (
              <Image
                src={item.icon}
                width={60}
                height={60}
                alt={`${item.name} icon`}
                className="border-secondary/50 dark:border-secondary/30 aspect-square rounded-xl border shadow-sm"
              />
            ) : (
              <div className="border-secondary/50 dark:border-secondary/30 bg-tertiary flex h-[60px] w-[60px] items-center justify-center rounded-xl border shadow-sm">
                <span className="text-tertiary text-xl font-medium">{item.name.charAt(0)}</span>
              </div>
            )}
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-black dark:bg-white"
              />
            )}
          </Link>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side="bottom" sideOffset={20}>
            <Tooltip.Popup className="bg-elevated dark:shadow-contrast text-primary border-secondary z-50 origin-(--transform-origin) rounded-lg border px-2 py-1.5 text-sm font-medium shadow-sm transition-[transform,scale,opacity] duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
              {item.name}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
