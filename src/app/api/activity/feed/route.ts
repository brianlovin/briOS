import { activityCachedJson } from "@/lib/activity-feed";
import { getActivityPageData } from "@/lib/activity-redis";
import { withAxiom } from "@/lib/observability/axiom-route";

/**
 * Single public poll blob for /activity.
 * Cookie-free and unauthenticated so Vercel can CDN-cache the JSON.
 */
async function getHandler() {
  return activityCachedJson(await getActivityPageData());
}

export const GET = withAxiom(getHandler, { name: "/api/activity/feed" });
