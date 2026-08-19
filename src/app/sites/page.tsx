import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { GoodWebsitesPageClient } from "@/components/good-websites/GoodWebsitesPageClient";
import { getGoodWebsites, getGoodWebsitesSeed } from "@/lib/goodWebsites";
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

export default function GoodWebsitesPage() {
  return <GoodWebsitesContent />;
}

async function GoodWebsitesContent() {
  "use cache";
  cacheLife("days");
  cacheTag("notion:good-websites");
  const allWebsites = isPlaceholderNotionBuild()
    ? []
    : await getGoodWebsites(getGoodWebsitesSeed());

  return <GoodWebsitesPageClient initialData={allWebsites} />;
}
