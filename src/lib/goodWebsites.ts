import { getGoodWebsitesDatabaseItems, getGoodWebsitesDatabaseItemsForRss } from "@/lib/notion";

export type GoodWebsiteItem = {
  id: string;
  name: string;
  url?: string;
  x?: string;
  icon?: string;
  tags?: string[];
  previewImage?: string;
  previewStatus?: "Queued" | "Processing" | "Done" | "Error";
};

export type GoodWebsiteItemWithDate = GoodWebsiteItem & {
  createdTime: string;
};

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

export async function getGoodWebsites(): Promise<GoodWebsiteItem[]> {
  const items = await getGoodWebsitesDatabaseItems();

  // Create a seed based on 5-minute intervals
  // This ensures the same order for all users within a 5-minute window
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  const seed = Math.floor(now / fiveMinutes);

  // Randomize the order using the time-based seed
  const randomized = shuffleWithSeed(items as GoodWebsiteItem[], seed);

  return randomized;
}

export async function getGoodWebsitesForRss(): Promise<GoodWebsiteItemWithDate[]> {
  return getGoodWebsitesDatabaseItemsForRss();
}
