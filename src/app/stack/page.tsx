import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { StackPageClient } from "@/components/stack/StackPageClient";
import { getServerLikes } from "@/lib/likes-server";
import { createMetadata, SITE_CONFIG } from "@/lib/metadata";
import { isPlaceholderNotionBuild } from "@/lib/notion";
import { getStacks, type StackItem } from "@/lib/stack";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Stack",
    description:
      "Apps, tools, and services I use every day. My personal stack of productivity tools and software.",
    path: "/stack",
  }),
  alternates: {
    types: {
      "application/rss+xml": `${SITE_CONFIG.url}/stack/rss.xml`,
    },
  },
};

export default async function StackPage() {
  const allStacks = await getCachedStacks();
  const initialLikes = await getServerLikes(allStacks.map((item) => item.id));

  return <StackPageClient initialData={allStacks} initialLikes={initialLikes} />;
}

async function getCachedStacks(): Promise<StackItem[]> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:stack");
  return isPlaceholderNotionBuild() ? [] : await getStacks();
}
