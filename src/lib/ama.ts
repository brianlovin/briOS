import { cache } from "react";

import { InfiniteScrollPage, useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { createAmaQuestion, getAmaDatabaseItems, NotionAmaItem } from "@/lib/notion";

export type AmaQuestion = NotionAmaItem;

async function fetchAllAmaQuestions(): Promise<AmaQuestion[]> {
  const all: AmaQuestion[] = [];
  let cursor: string | undefined;
  do {
    const { items, nextCursor } = await getAmaDatabaseItems(cursor);
    all.push(...items);
    cursor = nextCursor || undefined;
  } while (cursor);
  return all;
}

export const getAmaQuestions = cache(fetchAllAmaQuestions);

export type AmaPage = InfiniteScrollPage<AmaQuestion>;

export function amaQuestionLinks(items: AmaQuestion[]) {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    href: `/ama/${item.id}`,
  }));
}

export function useAmaQuestions(fallbackData?: AmaPage[]) {
  return useInfiniteScroll<AmaQuestion>(
    (index: number, previousPage: AmaPage | null) => {
      // If we've reached the end, don't fetch more
      if (previousPage && !previousPage.nextCursor) return null;

      // For the first page, just fetch with limit
      if (index === 0) return `/api/ama?limit=20`;

      // For subsequent pages, use the cursor from the previous page
      return `/api/ama?cursor=${previousPage?.nextCursor}&limit=20`;
    },
    { fallbackData },
  );
}

export async function submitAmaQuestion(title: string) {
  await createAmaQuestion(title);
}
