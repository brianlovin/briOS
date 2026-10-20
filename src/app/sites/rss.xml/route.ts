import { cacheLife, cacheTag } from "next/cache";

import { isPlaceholderNotionBuild } from "@/lib/notion";
import { withAxiom } from "@/lib/observability/axiom-route";
import { rssErrorResponse, rssXmlResponse } from "@/lib/rss";
import { buildGoodWebsitesFeed, loadGoodWebsitesFeedItems } from "@/lib/rss-feeds";

async function getCachedFeedXml(): Promise<string> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:good-websites");
  return buildGoodWebsitesFeed(
    isPlaceholderNotionBuild() ? [] : await loadGoodWebsitesFeedItems(),
  ).rss2();
}

async function getHandler() {
  try {
    return rssXmlResponse(await getCachedFeedXml());
  } catch (error) {
    return rssErrorResponse("Good Websites", error);
  }
}

export const GET = withAxiom(getHandler, { name: "/sites/rss.xml" });
