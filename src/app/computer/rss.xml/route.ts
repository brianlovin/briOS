import { cacheLife, cacheTag } from "next/cache";

import { isPlaceholderNotionBuild } from "@/lib/notion";
import { withAxiom } from "@/lib/observability/axiom-route";
import { rssErrorResponse, rssXmlResponse } from "@/lib/rss";
import { buildComputerFeed, loadComputerFeedEntries } from "@/lib/rss-feeds";

async function getCachedFeedXml(): Promise<string> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:computer");
  if (isPlaceholderNotionBuild()) return buildComputerFeed([]).rss2();

  const { entries, complete } = await loadComputerFeedEntries();
  if (!complete) cacheLife("minutes");
  return buildComputerFeed(entries).rss2();
}

async function getHandler() {
  try {
    return rssXmlResponse(await getCachedFeedXml());
  } catch (error) {
    return rssErrorResponse("Computer", error);
  }
}

export const GET = withAxiom(getHandler, { name: "/computer/rss.xml" });
