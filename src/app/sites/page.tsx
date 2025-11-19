import type { Metadata } from "next";

import { GoodWebsitesPageClient } from "@/components/good-websites/GoodWebsitesPageClient";
import { getGoodWebsites } from "@/lib/goodWebsites";
import { createMetadata } from "@/lib/metadata";

// Revalidate the page every 24 hours
export const revalidate = 86400;

export const metadata: Metadata = createMetadata({
  title: "Good websites",
  description: "A curated collection of inspirational good websites",
  path: "/sites",
});

export default async function GoodWebsitesPage() {
  // Fetch initial data on the server
  const goodWebsites = await getGoodWebsites();

  return <GoodWebsitesPageClient initialData={goodWebsites} />;
}
