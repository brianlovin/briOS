import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import {
  getGoodWebsitesSeed,
  GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS,
  type GoodWebsiteItem,
  shuffleGoodWebsites,
} from "@/lib/goodWebsites";

/**
 * Short-lived shuffle of a days-cached Notion list.
 * Seed is taken inside this island so cacheComponents can cache Date.now(),
 * and the life matches the existing 5-minute randomization window.
 */
export async function getCachedShuffledGoodWebsites(
  items: GoodWebsiteItem[],
): Promise<GoodWebsiteItem[]> {
  "use cache";
  cacheLife({
    stale: GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS,
    revalidate: GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS,
    expire: GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS * 2,
  });
  cacheTag("notion:good-websites");
  return shuffleGoodWebsites(items, getGoodWebsitesSeed());
}
