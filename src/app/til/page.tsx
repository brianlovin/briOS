import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { TilFeed } from "@/components/TilFeed";
import { PageTitle } from "@/components/Typography";
import { getServerLikes } from "@/lib/likes-server";
import { createMetadata, SITE_CONFIG } from "@/lib/metadata";
import { getTilDatabaseItems, getTilItemContent, isPlaceholderNotionBuild } from "@/lib/notion";
import { hydrateTilEntries, type TilPage } from "@/lib/til";

export const metadata: Metadata = createMetadata({
  title: "TIL",
  description: "Today I Learned - Quick notes and discoveries from Brian Lovin.",
  path: "/til",
  rss: `${SITE_CONFIG.url}/til/rss.xml`,
});

export default function TilPage() {
  return (
    <div data-scrollable className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-12 py-16 leading-[1.6]">
        <div className="grid grid-cols-1 gap-2 px-4 sm:grid-cols-[140px_1fr] sm:gap-6 md:grid-cols-[180px_1fr]">
          <div className="hidden sm:block" />
          <PageTitle>TIL</PageTitle>
        </div>
        <TilFeedWithLikes />
      </div>
    </div>
  );
}

async function TilFeedWithLikes() {
  const page = await getCachedTilFeed();
  const initialLikes = await getServerLikes(page.items.map((entry) => entry.id));

  return <TilFeed fallbackData={[page]} initialLikes={initialLikes} />;
}

async function getCachedTilFeed(): Promise<TilPage> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:til");
  if (isPlaceholderNotionBuild()) {
    return { items: [], nextCursor: null };
  }
  const { items, nextCursor } = await getTilDatabaseItems(undefined, 10);
  const contents = await Promise.all(items.map((entry) => getTilItemContent(entry.id)));

  return { items: hydrateTilEntries(items, contents), nextCursor };
}
