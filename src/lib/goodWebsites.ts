import {
  getGoodWebsitesDatabaseItems,
  getGoodWebsitesDatabaseItemsForRss,
  type GoodWebsiteItem as NotionGoodWebsiteItem,
  type GoodWebsiteItemWithDate as NotionGoodWebsiteItemWithDate,
} from "@/lib/notion";

export type GoodWebsiteItem = NotionGoodWebsiteItem;
export type GoodWebsiteItemWithDate = NotionGoodWebsiteItemWithDate;

/** Sites re-randomize on this cadence. Keep shuffle caches aligned with it. */
export const GOOD_WEBSITES_SHUFFLE_INTERVAL_MS = 5 * 60 * 1000;
export const GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS = GOOD_WEBSITES_SHUFFLE_INTERVAL_MS / 1000;

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
  return Math.floor(now / GOOD_WEBSITES_SHUFFLE_INTERVAL_MS);
}

export function shuffleGoodWebsites<T>(items: readonly T[], seed: number): T[] {
  return shuffleWithSeed([...items], seed);
}

/** Prefer the server list so hydrate cannot replace first HTML with another permutation. */
export function resolveGoodWebsitesOrder(
  serverItems: GoodWebsiteItem[] | undefined,
  fetchedItems: GoodWebsiteItem[] | undefined,
  tag = "",
): GoodWebsiteItem[] {
  return filterGoodWebsites(serverItems ?? fetchedItems ?? [], { tag });
}

/** SWR must not revalidate a server-provided list; that is what flashed a second order. */
export function goodWebsitesClientKey(hasServerList: boolean, tag = ""): string | null {
  if (hasServerList) return null;

  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  const queryString = params.toString();
  return `/api/sites${queryString ? `?${queryString}` : ""}`;
}

export async function getGoodWebsitesSource(): Promise<GoodWebsiteItem[]> {
  return getGoodWebsitesDatabaseItems();
}

export async function getGoodWebsites(seed: number): Promise<GoodWebsiteItem[]> {
  const items = await getGoodWebsitesSource();
  return shuffleGoodWebsites(items, seed);
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
