import { activityCachedJson } from "@/lib/activity-feed";
import { getActivityPageData } from "@/lib/activity-redis";

/**
 * Single public poll blob for /activity.
 * Cookie-free and unauthenticated so Vercel can CDN-cache the JSON.
 */
export async function GET() {
  return activityCachedJson(await getActivityPageData());
}
