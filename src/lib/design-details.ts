import {
  getDesignDetailsEpisodeDatabaseItems,
  type NotionDesignDetailsEpisodeItem,
} from "@/lib/notion";

export type DesignDetailsEpisode = NotionDesignDetailsEpisodeItem;

export async function getDesignDetailsEpisodes(): Promise<DesignDetailsEpisode[]> {
  const all: DesignDetailsEpisode[] = [];
  let cursor: string | undefined;
  do {
    const { items, nextCursor } = await getDesignDetailsEpisodeDatabaseItems(cursor);
    all.push(...items);
    cursor = nextCursor || undefined;
  } while (cursor);
  return all;
}

export type DesignDetailsEpisodePage = {
  items: DesignDetailsEpisode[];
  nextCursor: string | null;
};

export async function getDesignDetailsEpisodeById(
  id: string,
): Promise<DesignDetailsEpisode | undefined> {
  const episodes = await getDesignDetailsEpisodes();
  return episodes.find((e) => e.id === id);
}

export function designDetailsEpisodeLinks(items: DesignDetailsEpisode[]) {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    href: `/design-details/${item.id}`,
  }));
}
