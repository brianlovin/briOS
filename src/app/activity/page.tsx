import type { Metadata } from "next";
import { connection } from "next/server";

import { ActivityFeed } from "@/components/ActivityFeed";
import { getActivityPageData } from "@/lib/activity-redis";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Activity",
  description: "A live stream of likes, visits, and other things happening on brianlovin.com.",
  path: "/activity",
});

export default async function ActivityPage() {
  await connection();
  const { events, totals } = await getActivityPageData();

  return <ActivityFeed initialEvents={events} initialTotals={totals} />;
}
