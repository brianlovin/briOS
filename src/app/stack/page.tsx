import type { Metadata } from "next";

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

export const revalidate = 3600;

export default async function StackPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; platform?: string }>;
}) {
  const params = await searchParams;
  const status = params.status || "active";
  const platform = params.platform || "";

  // Fetch initial data on the server
  const allStacks = await getStacks();

  // Apply filters server-side to match what the API would return
  const filteredStacks = allStacks.filter((item) => {
    const itemStatus = item.status?.toLowerCase() || "active";
    const statusMatch = status === "all" ? true : itemStatus === status;
    const platformMatch = platform ? item.platforms?.includes(platform) : true;

    return statusMatch && platformMatch;
  });

  // Fetch likes for all items server-side
  const pageIds = filteredStacks.map((item) => item.id);
  const initialLikes = await getServerLikes(pageIds);

  return <StackPageClient initialData={filteredStacks} initialLikes={initialLikes} />;
}
