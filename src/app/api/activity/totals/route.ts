import { activityCachedJson } from "@/lib/activity-feed";
import { getActivityPageData } from "@/lib/activity-redis";

/** Mid-deploy shim. Prefer GET /api/activity/feed. */
export async function GET() {
  const { count } = await getActivityPageData();
  return activityCachedJson({ count });
}
