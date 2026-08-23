import { cacheLife, cacheTag } from "next/cache";
import type { ReactNode } from "react";

import { type ComputerTip, publicComputerTips } from "@/lib/computer";
import { getComputerDatabaseItems, isPlaceholderNotionBuild } from "@/lib/notion";

import { ComputerLayoutClient } from "./ComputerLayoutClient";

export default async function ComputerLayout({ children }: { children: ReactNode }) {
  const initialTips = await getCachedComputerTips();
  return <ComputerLayoutClient initialTips={initialTips}>{children}</ComputerLayoutClient>;
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
