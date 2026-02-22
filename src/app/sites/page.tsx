import type { Metadata } from "next";

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

export const dynamic = "force-dynamic";

export default async function GoodWebsitesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const params = await searchParams;
  const tag = params.tag || "";

  // Fetch initial data on the server
  const allWebsites = await getGoodWebsites();

  // Apply filters server-side to match what the API would return
  const filteredWebsites = allWebsites.filter((item) => {
    const tagMatch = tag ? item.tags?.includes(tag) : true;
    return tagMatch;
  });

  // Fetch likes for all items server-side
  const pageIds = filteredWebsites.map((item) => item.id);
  const initialLikes = await getServerLikes(pageIds);

  return <GoodWebsitesPageClient initialData={filteredWebsites} initialLikes={initialLikes} />;
}
