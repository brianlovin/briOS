import { activityCachedJson } from "@/lib/activity-feed";
import { getActivityPageData } from "@/lib/activity-redis";
import { withAxiom } from "@/lib/observability/axiom-route";

/** Mid-deploy shim. Prefer GET /api/activity/feed. */
async function getHandler() {
  const { count } = await getActivityPageData();
  return activityCachedJson({ count });
}

export const GET = withAxiom(getHandler, { name: "/api/activity/totals" });
