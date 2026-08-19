import { cacheLife, cacheTag } from "next/cache";
import type { ReactNode } from "react";

import { getRankedHNPosts } from "@/lib/hn";
import { HackerNewsPost } from "@/types/hackernews";

import { HNLayoutClient } from "./HNLayoutClient";

export default async function HNLayout({ children }: { children: ReactNode }) {
  const initialPosts = await getCachedRankedHNPosts();
  return <HNLayoutClient initialPosts={initialPosts}>{children}</HNLayoutClient>;
}

async function getCachedRankedHNPosts(): Promise<HackerNewsPost[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("hn:ranked");
  try {
    return await getRankedHNPosts();
  } catch {
    return [];
  }
}
