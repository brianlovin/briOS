import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { TilFeed } from "@/components/TilFeed";
import { PageTitle } from "@/components/Typography";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { getServerLikes } from "@/lib/likes-server";
import { createMetadata, SITE_CONFIG } from "@/lib/metadata";
import { getTilDatabaseItems } from "@/lib/notion";
import { getTilEntriesWithContent } from "@/lib/til";

export const metadata: Metadata = {
  ...createMetadata({
    title: "TIL",
    description: "Today I Learned - Quick notes and discoveries from Brian Lovin.",
    path: "/til",
  }),
  alternates: {
    types: {
      "application/rss+xml": `${SITE_CONFIG.url}/til/rss.xml`,
    },
  },
};

export default function TilPage() {
  return (
    <div data-scrollable className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-12 py-16 leading-[1.6]">
        <div className="grid grid-cols-1 gap-2 px-4 sm:grid-cols-[140px_1fr] sm:gap-6 md:grid-cols-[180px_1fr]">
          <div className="hidden sm:block" />
          <PageTitle>TIL</PageTitle>
        </div>
        <Suspense fallback={<TilFeedFallback />}>
          <TilFeedContent />
        </Suspense>
      </div>
    </div>
  );
}

function TilFeedFallback() {
  return (
    <div className="flex flex-col gap-12 px-4">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_1fr] sm:items-baseline sm:gap-6 md:grid-cols-[180px_1fr]"
        >
          <LoadingSkeleton className="h-4 w-24" />
          <div className="flex flex-col gap-3">
            <LoadingSkeleton className="h-5 w-3/4" />
            <div className="flex flex-col gap-2">
              <LoadingSkeleton className="h-4 w-full" />
              <LoadingSkeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function TilFeedContent() {
  await connection();
  // Fetch the first 10 entries for SSR
  const { items: initialEntries } = await getTilDatabaseItems(undefined, 10);

  // Fetch content (blocks) and likes for the initial entries in parallel
  const pageIds = initialEntries.map((entry) => entry.id);
  const [initialEntriesWithContent, initialLikes] = await Promise.all([
    getTilEntriesWithContent(initialEntries),
    getServerLikes(pageIds),
  ]);

  return <TilFeed initialEntries={initialEntriesWithContent} initialLikes={initialLikes} />;
}
