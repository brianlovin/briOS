import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { GoodWebsitesPageClient } from "@/components/good-websites/GoodWebsitesPageClient";
import { getGoodWebsitesSource, type GoodWebsiteItem } from "@/lib/goodWebsites";
import { getCachedShuffledGoodWebsites } from "@/lib/goodWebsites-cached";
import { getServerLikes } from "@/lib/likes-server";
import { createMetadata, SITE_CONFIG } from "@/lib/metadata";
import { isPlaceholderNotionBuild } from "@/lib/notion";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Good websites",
    description: "A curated collection of inspirational good websites",
    path: "/sites",
  }),
  alternates: {
    types: {
      "application/rss+xml": `${SITE_CONFIG.url}/sites/rss.xml`,
    },
  },
};

export default async function GoodWebsitesPage() {
  // Keep the page-local days island live so /sites stays subscribed to the
  // Notion purge tag. Visible order comes from the shared 5-minute shuffle.
  await getCachedGoodWebsites();
  const allWebsites = await getCachedShuffledGoodWebsites();
  const initialLikes = await getServerLikes(allWebsites.map((item) => item.id));

  return <GoodWebsitesPageClient initialData={allWebsites} initialLikes={initialLikes} />;
}

async function getCachedGoodWebsites(): Promise<GoodWebsiteItem[]> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:good-websites");
  return isPlaceholderNotionBuild() ? [] : await getGoodWebsitesSource();
}
