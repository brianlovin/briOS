import { activityCachedJson } from "@/lib/activity-feed";
import { getActivityPageData } from "@/lib/activity-redis";
import { withAxiom } from "@/lib/observability/axiom-route";

/** Kept for mid-deploy clients. Prefer GET /api/activity/feed. */
async function getHandler() {
  const { events } = await getActivityPageData();
  return activityCachedJson({ events });
}

export const GET = withAxiom(getHandler, { name: "/api/activity/tail" });
