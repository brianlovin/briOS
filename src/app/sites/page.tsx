import type { Metadata } from "next";
import { Suspense } from "react";

import { GoodWebsitesPageClient } from "@/components/good-websites/GoodWebsitesPageClient";
import { getGoodWebsites, getGoodWebsitesSeed } from "@/lib/goodWebsites";
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

export default function GoodWebsitesPage(props: { searchParams: Promise<{ tag?: string }> }) {
  return (
    <Suspense fallback={<GoodWebsitesFallback />}>
      <GoodWebsitesContent searchParams={props.searchParams} />
    </Suspense>
  );
}

function GoodWebsitesFallback() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-secondary flex items-center justify-between border-b p-4 md:hidden">
        <div className="bg-tertiary h-8 w-20 animate-pulse rounded" />
        <div className="bg-tertiary h-8 w-24 animate-pulse rounded" />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="bg-secondary border-secondary hidden h-10 border-b md:block" />
        <div className="divide-secondary divide-y">
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="flex h-10 items-center gap-4 px-4">
              <div className="bg-tertiary h-4 w-1/3 animate-pulse rounded" />
              <div className="bg-tertiary h-4 w-1/4 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function GoodWebsitesContent({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const params = await searchParams;
  const tag = params.tag || "";

  // Fetch initial data on the server
  const allWebsites = await getGoodWebsites(getGoodWebsitesSeed());

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
