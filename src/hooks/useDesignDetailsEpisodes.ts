"use client";

import { InfiniteScrollPage, useInfiniteScroll } from "./useInfiniteScroll";

export type DesignDetailsEpisode = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  episodeNumber?: number;
  publishedDate?: string;
  imageUrl?: string;
  audioUrl?: string;
};

export type DesignDetailsEpisodePage = InfiniteScrollPage<DesignDetailsEpisode>;

export function useDesignDetailsEpisodes(initialData?: DesignDetailsEpisodePage[]) {
  return useInfiniteScroll<DesignDetailsEpisode>(
    (index: number, previousPage: DesignDetailsEpisodePage | null) => {
      if (previousPage && !previousPage.nextCursor) return null;
      if (index === 0) return `/api/design-details?limit=20`;
      return `/api/design-details?cursor=${previousPage?.nextCursor}&limit=20`;
    },
    {
      fallbackData: initialData,
    },
  );
}
