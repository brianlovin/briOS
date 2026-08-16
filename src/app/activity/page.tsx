import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { ActivityFeed } from "@/components/ActivityFeed";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { getActivityPageData } from "@/lib/activity-redis";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Activity",
  description: "A live stream of likes, visits, and other things happening on brianlovin.com.",
  path: "/activity",
});

export default function ActivityPage() {
  return (
    <Suspense fallback={<ActivityFallback />}>
      <ActivityContent />
    </Suspense>
  );
}

function ActivityFallback() {
  return (
    <ListDetailWrapper>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div data-scrollable className="relative min-w-0 flex-1 overflow-auto">
          <div className="bg-secondary border-secondary sticky top-0 z-10 hidden border-b md:block dark:bg-neutral-950">
            <div className="grid grid-cols-[2rem_minmax(0,1fr)_auto] gap-3 px-4 py-2 md:gap-4">
              <LoadingSkeleton className="h-4 w-6" />
              <LoadingSkeleton className="h-4 w-20" />
              <LoadingSkeleton className="ml-auto h-4 w-12" />
            </div>
          </div>
          <div className="divide-secondary divide-y">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 md:gap-4"
              >
                <LoadingSkeleton className="size-6" />
                <LoadingSkeleton className="h-5 w-2/3" />
                <LoadingSkeleton className="h-4 w-14" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ListDetailWrapper>
  );
}

async function ActivityContent() {
  await connection();
  const { events, totals } = await getActivityPageData();

  return <ActivityFeed initialEvents={events} initialTotals={totals} />;
}
