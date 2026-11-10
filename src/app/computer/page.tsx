import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import {
  COMPUTER_INTRO,
  COMPUTER_TITLE,
  type ComputerTip,
  publicComputerTips,
} from "@/lib/computer";
import { createMetadata, SITE_CONFIG } from "@/lib/metadata";
import { getComputerDatabaseItems, isPlaceholderNotionBuild } from "@/lib/notion";

import { ComputerCatalog } from "./ComputerCatalog";

export const metadata: Metadata = createMetadata({
  title: COMPUTER_TITLE,
  description: COMPUTER_INTRO,
  path: "/computer",
  rss: `${SITE_CONFIG.url}/computer/rss.xml`,
});

export default async function ComputerPage() {
  const tips = await getCachedComputerTips();
  return <ComputerCatalog tips={tips} />;
}

async function getCachedComputerTips(): Promise<ComputerTip[]> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:computer");
  if (isPlaceholderNotionBuild()) {
    return [];
  }
  return publicComputerTips(await getComputerDatabaseItems());
}
