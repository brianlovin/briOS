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
          <div className="divide-secondary divide-y">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-8 flex-none items-center justify-center">
                  <LoadingSkeleton className="size-6" />
                </div>
                <LoadingSkeleton className="h-3 w-2/3" />
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
  const { events, count } = await getActivityPageData();

  return <ActivityFeed initialEvents={events} initialCount={count} />;
}
