import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";

import { GoodWebsitesPageClient } from "@/components/good-websites/GoodWebsitesPageClient";
import { GoodWebsitesPageSkeleton } from "@/components/good-websites/GoodWebsitesPageSkeleton";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getGoodWebsites } from "@/lib/goodWebsites";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Good websites",
  description: "A curated collection of inspirational good websites",
  path: "/sites",
});

async function WebsitesContent({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  "use cache: private";
  cacheLife("days");
  cacheTag(CACHE_TAGS.websites);

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

export default async function GoodWebsitesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  return (
    <Suspense fallback={<GoodWebsitesPageSkeleton />}>
      <WebsitesContent searchParams={searchParams} />
    </Suspense>
  );
}
