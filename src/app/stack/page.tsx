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

export default function StackPage(props: {
  searchParams: Promise<{ platform?: string; status?: string }>;
}) {
  return (
    <Suspense fallback={<StackFallback />}>
      <StackContent searchParams={props.searchParams} />
    </Suspense>
  );
}

function StackFallback() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-secondary flex h-16 items-center border-b p-4 md:hidden">
        <div className="bg-tertiary h-8 w-28 animate-pulse rounded" />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="bg-secondary border-secondary hidden h-10 border-b md:block" />
        <div className="divide-secondary divide-y">
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="flex h-12 items-center gap-4 px-4">
              <div className="bg-tertiary h-4 w-1/4 animate-pulse rounded" />
              <div className="bg-tertiary h-4 w-1/3 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function StackContent({
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
