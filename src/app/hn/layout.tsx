import { cacheLife, cacheTag } from "next/cache";
import React, { Suspense } from "react";

import { HNPageSkeleton } from "@/components/hn/HNPageSkeleton";
import { ListDetailLayout } from "@/components/ListDetailLayout";
import { CACHE_PROFILES } from "@/lib/cache-profiles";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getRankedHNPosts } from "@/lib/hn";

import { HNHeaderClient } from "./HNHeaderClient";
import { HNStoriesListClient } from "./HNStoriesListClient";

async function HNStoriesList() {
  "use cache";
  cacheLife(CACHE_PROFILES.realtime);
  cacheTag(CACHE_TAGS.hnPosts);

  // Fetch HN posts from external API on the server
  const posts = await getRankedHNPosts();

  return <HNStoriesListClient initialData={posts} />;
}

export default function HNLayout({ children }: { children: React.ReactNode }) {
  return (
    <ListDetailLayout
      title="Hacker News"
      backHref="/hn"
      list={
        <Suspense fallback={<HNPageSkeleton />}>
          <HNStoriesList />
        </Suspense>
      }
      headerChildren={<HNHeaderClient />}
    >
      {children}
    </ListDetailLayout>
  );
}
