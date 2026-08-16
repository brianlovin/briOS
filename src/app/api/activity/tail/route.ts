import { activityCachedJson } from "@/lib/activity-feed";
import { getActivityPageData } from "@/lib/activity-redis";

/** Kept for mid-deploy clients. Prefer GET /api/activity/feed. */
export async function GET() {
  const { events } = await getActivityPageData();
  return activityCachedJson({ events });
}
