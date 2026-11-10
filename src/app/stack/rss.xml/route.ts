import { cacheLife, cacheTag } from "next/cache";

import { isPlaceholderNotionBuild } from "@/lib/notion";
import { withAxiom } from "@/lib/observability/axiom-route";
import { rssErrorResponse, rssXmlResponse } from "@/lib/rss";
import { buildStackFeed, loadStackFeedItems } from "@/lib/rss-feeds";

async function getCachedFeedXml(): Promise<string> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:stack");
  return buildStackFeed(isPlaceholderNotionBuild() ? [] : await loadStackFeedItems()).rss2();
}

async function getHandler() {
  try {
    return rssXmlResponse(await getCachedFeedXml());
  } catch (error) {
    return rssErrorResponse("Stack", error);
  }
}

export const GET = withAxiom(getHandler, { name: "/stack/rss.xml" });
