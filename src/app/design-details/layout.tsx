import { cacheLife } from "next/cache";
import type { ReactNode } from "react";

import type { DesignDetailsEpisodePage } from "@/lib/design-details";
import { getDesignDetailsEpisodeDatabaseItems, isPlaceholderNotionBuild } from "@/lib/notion";

import { DesignDetailsLayoutClient } from "./DesignDetailsLayoutClient";

export default async function DesignDetailsLayout({ children }: { children: ReactNode }) {
  const initialPage = await getCachedDesignDetailsFirstPage();
  return (
    <DesignDetailsLayoutClient initialPage={initialPage}>{children}</DesignDetailsLayoutClient>
  );
}

async function getCachedDesignDetailsFirstPage(): Promise<DesignDetailsEpisodePage> {
  "use cache";
  cacheLife("days");
  if (isPlaceholderNotionBuild()) {
    return { items: [], nextCursor: null };
  }
  return getDesignDetailsEpisodeDatabaseItems(undefined, 20);
}
