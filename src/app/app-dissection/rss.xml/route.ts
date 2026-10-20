import { cacheLife, cacheTag } from "next/cache";

import { isPlaceholderNotionBuild } from "@/lib/notion";
import { withAxiom } from "@/lib/observability/axiom-route";
import { rssErrorResponse, rssXmlResponse } from "@/lib/rss";
import { buildAppDissectionFeed, loadAppDissectionFeedEntries } from "@/lib/rss-feeds";

async function getCachedFeedXml(): Promise<string> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:app-dissection");
  if (isPlaceholderNotionBuild()) return buildAppDissectionFeed([]).rss2();

  const { entries, complete } = await loadAppDissectionFeedEntries();
  if (!complete) cacheLife("minutes");
  return buildAppDissectionFeed(entries).rss2();
}

async function getHandler() {
  try {
    return rssXmlResponse(await getCachedFeedXml());
  } catch (error) {
    return rssErrorResponse("App Dissection", error);
  }
}

export const GET = withAxiom(getHandler, { name: "/app-dissection/rss.xml" });
