import { cacheLife, cacheTag } from "next/cache";

import { isPlaceholderNotionBuild } from "@/lib/notion";
import { withAxiom } from "@/lib/observability/axiom-route";
import { rssErrorResponse, rssXmlResponse } from "@/lib/rss";
import { buildWritingFeed, loadWritingFeedEntries } from "@/lib/rss-feeds";

async function getCachedFeedXml(): Promise<string> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:writing");
  if (isPlaceholderNotionBuild()) return buildWritingFeed([]).rss2();

  const { entries, complete } = await loadWritingFeedEntries();
  if (!complete) cacheLife("minutes");
  return buildWritingFeed(entries).rss2();
}

async function getHandler() {
  try {
    return rssXmlResponse(await getCachedFeedXml());
  } catch (error) {
    return rssErrorResponse("Writing", error);
  }
}

export const GET = withAxiom(getHandler, { name: "/writing/rss.xml" });
