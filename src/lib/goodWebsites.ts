import {
  getGoodWebsitesDatabaseItems,
  getGoodWebsitesDatabaseItemsForRss,
  type GoodWebsiteItem as NotionGoodWebsiteItem,
  type GoodWebsiteItemWithDate as NotionGoodWebsiteItemWithDate,
} from "@/lib/notion";

export type GoodWebsiteItem = NotionGoodWebsiteItem;
export type GoodWebsiteItemWithDate = NotionGoodWebsiteItemWithDate;

// Seeded random number generator for consistent randomization within time windows
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

// Shuffle array using Fisher-Yates algorithm with a seeded random generator
function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const random = seededRandom(seed);

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function getGoodWebsitesSeed(now: number = Date.now()): number {
  return Math.floor(now / (5 * 60 * 1000));
}

export async function getGoodWebsites(seed: number): Promise<GoodWebsiteItem[]> {
  const items = await getGoodWebsitesDatabaseItems();
  return shuffleWithSeed(items, seed);
}

export async function getGoodWebsitesForRss(): Promise<GoodWebsiteItemWithDate[]> {
  return getGoodWebsitesDatabaseItemsForRss();
}

export function filterGoodWebsites(items: GoodWebsiteItem[], { tag = "" }: { tag?: string } = {}) {
  return items.filter((item) => (tag ? item.tags?.includes(tag) : true));
}

export function goodWebsiteLinks(items: GoodWebsiteItem[]) {
  return items.flatMap((item) =>
    item.url ? [{ id: item.id, title: item.name, href: item.url }] : [],
  );
}
