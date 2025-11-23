import { cacheLife, cacheTag } from "next/cache";
import React from "react";

import { ListDetailLayout } from "@/components/ListDetailLayout";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getDesignDetailsEpisodeDatabaseItems } from "@/lib/notion";

import { EpisodeListClient } from "./EpisodeListClient";

async function getInitialEpisodes() {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.designDetailsEpisodes);

  const { items, nextCursor } = await getDesignDetailsEpisodeDatabaseItems(undefined, 20);
  return { items, nextCursor };
}

export default async function DesignDetailsLayout({ children }: { children: React.ReactNode }) {
  const { items: initialEpisodes, nextCursor } = await getInitialEpisodes();

  return (
    <ListDetailLayout
      title="Design Details"
      backHref="/design-details"
      list={<EpisodeListClient initialEpisodes={initialEpisodes} initialCursor={nextCursor} />}
    >
      {children}
    </ListDetailLayout>
  );
}
