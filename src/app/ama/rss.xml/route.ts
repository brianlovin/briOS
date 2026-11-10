import { cacheLife, cacheTag } from "next/cache";

import { isPlaceholderNotionBuild } from "@/lib/notion";
import { withAxiom } from "@/lib/observability/axiom-route";
import { rssErrorResponse, rssXmlResponse } from "@/lib/rss";
import { buildAmaFeed, loadAmaFeedEntries } from "@/lib/rss-feeds";

async function getCachedFeedXml(): Promise<string> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:ama");
  if (isPlaceholderNotionBuild()) return buildAmaFeed([]).rss2();

  const { entries, complete } = await loadAmaFeedEntries();
  if (!complete) cacheLife("minutes");
  return buildAmaFeed(entries).rss2();
}

async function getHandler() {
  try {
    return rssXmlResponse(await getCachedFeedXml());
  } catch (error) {
    return rssErrorResponse("AMA", error);
  }
}

export const GET = withAxiom(getHandler, { name: "/ama/rss.xml" });
