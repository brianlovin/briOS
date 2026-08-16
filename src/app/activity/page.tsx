import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { ActivityFeed } from "@/components/ActivityFeed";
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
    <div data-scrollable className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-16 lg:flex-row lg:gap-16">
        <div className="min-w-0 flex-1">
          <LoadingSkeleton className="h-10 w-40" />
          <LoadingSkeleton className="mt-3 h-5 w-72" />
          <div className="mt-10 flex flex-col gap-4">
            {Array.from({ length: 6 }, (_, index) => (
              <LoadingSkeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </div>
        <aside className="w-full shrink-0 lg:w-56">
          <LoadingSkeleton className="mb-3 h-4 w-20" />
          <div className="flex flex-col gap-2">
            <LoadingSkeleton className="h-5 w-full" />
            <LoadingSkeleton className="h-5 w-full" />
          </div>
        </aside>
      </div>
    </div>
  );
}

async function ActivityContent() {
  await connection();
  const { events, totals } = await getActivityPageData();

  return <ActivityFeed initialEvents={events} initialTotals={totals} />;
}
