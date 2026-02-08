import type { Metadata } from "next";
import { Suspense } from "react";

import { StackPageClient } from "@/components/stack/StackPageClient";
import { getServerLikes } from "@/lib/likes-server";
import { createMetadata, SITE_CONFIG } from "@/lib/metadata";
import { getStacks } from "@/lib/stack";

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
  const allStacks = await getStacks();

  const pageIds = allStacks.map((item) => item.id);
  const initialLikes = await getServerLikes(pageIds);

  return (
    <Suspense>
      <StackPageClient initialData={allStacks} initialLikes={initialLikes} />
    </Suspense>
  );
}
