import type { Metadata } from "next";
import { Suspense } from "react";

import { GoodWebsitesPageClient } from "@/components/good-websites/GoodWebsitesPageClient";
import { getGoodWebsites } from "@/lib/goodWebsites";
import { getServerLikes } from "@/lib/likes-server";
import { createMetadata, SITE_CONFIG } from "@/lib/metadata";

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
  const allWebsites = await getGoodWebsites();

  const pageIds = allWebsites.map((item) => item.id);
  const initialLikes = await getServerLikes(pageIds);

  return (
    <Suspense>
      <GoodWebsitesPageClient initialData={allWebsites} initialLikes={initialLikes} />
    </Suspense>
  );
}
