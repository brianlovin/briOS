import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import {
  getGoodWebsitesSeed,
  getGoodWebsitesSource,
  GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS,
  shuffleGoodWebsites,
} from "@/lib/goodWebsites";
import { isPlaceholderNotionBuild } from "@/lib/notion";

async function getCachedGoodWebsitesSource() {
  "use cache";
  cacheLife("days");
  cacheTag("notion:good-websites");
  return isPlaceholderNotionBuild() ? [] : await getGoodWebsitesSource();
}

/**
 * Short-lived shuffle of the days-cached Notion list.
 * Seed is taken inside this island so cacheComponents can cache Date.now(),
 * and the life matches the existing 5-minute randomization window.
 * No arguments — page and /api/sites must share one cached permutation.
 */
export async function getCachedShuffledGoodWebsites() {
  "use cache";
  cacheLife({
    stale: GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS,
    revalidate: GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS,
    expire: GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS * 2,
  });
  cacheTag("notion:good-websites");
  const items = await getCachedGoodWebsitesSource();
  return shuffleGoodWebsites(items, getGoodWebsitesSeed());
}
