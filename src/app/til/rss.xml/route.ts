import { cacheLife, cacheTag } from "next/cache";

import { isPlaceholderNotionBuild } from "@/lib/notion";
import { withAxiom } from "@/lib/observability/axiom-route";
import { rssErrorResponse, rssXmlResponse } from "@/lib/rss";
import { buildTilFeed, loadTilFeedEntries } from "@/lib/rss-feeds";

async function getCachedFeedXml(): Promise<string> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:til");
  if (isPlaceholderNotionBuild()) return buildTilFeed([]).rss2();

  const { entries, complete } = await loadTilFeedEntries();
  if (!complete) cacheLife("minutes");
  return buildTilFeed(entries).rss2();
}

async function getHandler() {
  try {
    return rssXmlResponse(await getCachedFeedXml());
  } catch (error) {
    return rssErrorResponse("TIL", error);
  }
}

export const GET = withAxiom(getHandler, { name: "/til/rss.xml" });
