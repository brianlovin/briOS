import type { Metadata } from "next";

import { TilFeed } from "@/components/TilFeed";
import { PageTitle } from "@/components/Typography";
import { getTilEntriesWithContent } from "@/db/queries/til";
import { getServerLikes } from "@/lib/likes-server";
import { createMetadata, SITE_CONFIG } from "@/lib/metadata";

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

export const dynamic = "force-dynamic";

export default async function TilPage() {
  // Fetch the first 10 entries with content for SSR
  const { items: initialEntries } = await getTilEntriesWithContent(undefined, 10);

  // Fetch likes for the initial entries
  const pageIds = initialEntries.map((entry) => entry.id);
  const initialLikes = await getServerLikes(pageIds);

  return (
    <div data-scrollable className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-12 py-16 leading-[1.6]">
        {/* Use same grid as entries so TIL title aligns with content column */}
        <div className="grid grid-cols-1 gap-2 px-4 sm:grid-cols-[140px_1fr] sm:gap-6 md:grid-cols-[180px_1fr]">
          <div className="hidden sm:block" />
          <PageTitle>TIL</PageTitle>
        </div>
        <TilFeed initialEntries={initialEntries} initialLikes={initialLikes} />
      </div>
    </div>
  );
}
