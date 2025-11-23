import { cacheLife, cacheTag } from "next/cache";
import React, { Suspense } from "react";

import { DesignDetailsPageSkeleton } from "@/components/design-details/DesignDetailsPageSkeleton";
import { ListDetailLayout } from "@/components/ListDetailLayout";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getDesignDetailsEpisodeDatabaseItems } from "@/lib/notion";

import { EpisodeListClient } from "./EpisodeListClient";

async function EpisodeList() {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.designDetailsEpisodes);

  // Fetch initial page of episodes on the server
  const initialPage = await getDesignDetailsEpisodeDatabaseItems(undefined, 20);

  return <EpisodeListClient initialData={[initialPage]} />;
}

export default function DesignDetailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ListDetailLayout
      title="Design Details"
      backHref="/design-details"
      list={
        <Suspense fallback={<DesignDetailsPageSkeleton />}>
          <EpisodeList />
        </Suspense>
      }
    >
      {children}
    </ListDetailLayout>
  );
}
