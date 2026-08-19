import { cacheLife, cacheTag } from "next/cache";
import type { ReactNode } from "react";

import { type AmaPage } from "@/lib/ama";
import { getAmaDatabaseItems, isPlaceholderNotionBuild } from "@/lib/notion";

import { AMALayoutClient } from "./AMALayoutClient";

export default async function AMALayout({ children }: { children: ReactNode }) {
  const initialPage = await getCachedAmaFirstPage();
  return <AMALayoutClient initialPage={initialPage}>{children}</AMALayoutClient>;
}

async function getCachedAmaFirstPage(): Promise<AmaPage> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:ama");
  if (isPlaceholderNotionBuild()) {
    return { items: [], nextCursor: null };
  }
  return getAmaDatabaseItems(undefined, 20);
}
