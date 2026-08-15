"use client";

import type { DesignDetailsEpisode } from "@/lib/design-details";

import { InfiniteScrollPage, useInfiniteScroll } from "./useInfiniteScroll";

export type { DesignDetailsEpisode };

export type DesignDetailsEpisodePage = InfiniteScrollPage<DesignDetailsEpisode>;

export function useDesignDetailsEpisodes() {
  return useInfiniteScroll<DesignDetailsEpisode>(
    (index: number, previousPage: DesignDetailsEpisodePage | null) => {
      if (previousPage && !previousPage.nextCursor) return null;
      if (index === 0) return `/api/design-details?limit=20`;
      return `/api/design-details?cursor=${previousPage?.nextCursor}&limit=20`;
    },
  );
}
