import type { Metadata } from "next";

import { GoodWebsitesPageClient } from "@/components/good-websites/GoodWebsitesPageClient";
import { getGoodWebsites } from "@/lib/goodWebsites";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Good websites",
  description: "A curated collection of inspirational good websites",
  path: "/sites",
});

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

  return <GoodWebsitesPageClient initialData={filteredWebsites} />;
}
