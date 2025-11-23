import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { StackPageClient } from "@/components/stack/StackPageClient";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createMetadata } from "@/lib/metadata";
import { getStacks } from "@/lib/stack";

export const metadata: Metadata = createMetadata({
  title: "Stack",
  description:
    "Apps, tools, and services I use every day. My personal stack of productivity tools and software.",
  path: "/stack",
});

export default async function StackPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; platform?: string }>;
}) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.stacks);

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

  return <StackPageClient initialData={filteredStacks} />;
}
