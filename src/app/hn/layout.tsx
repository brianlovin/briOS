import { cacheLife, cacheTag } from "next/cache";
import React from "react";

import { CACHE_TAGS } from "@/lib/cache-tags";
import { getRankedHNPosts } from "@/lib/hn";

import { HNLayoutClient } from "./HNLayoutClient";

async function getInitialHNPosts() {
  "use cache";
  cacheLife({ stale: 10, revalidate: 60 });
  cacheTag(CACHE_TAGS.hnPosts);

  return await getRankedHNPosts();
}

export default async function HNLayout({ children }: { children: React.ReactNode }) {
  const initialPosts = await getInitialHNPosts();

  return <HNLayoutClient initialPosts={initialPosts}>{children}</HNLayoutClient>;
}
