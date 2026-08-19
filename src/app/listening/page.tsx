import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { ListeningHistory } from "@/components/ListeningHistory";
import { createMetadata } from "@/lib/metadata";
import { getListeningHistoryDatabaseItems, isPlaceholderNotionBuild } from "@/lib/notion";

export const metadata: Metadata = createMetadata({
  title: "Listening",
  description: "My listening history, synced from Spotify every hour",
  path: "/listening",
});

export default function ListeningPage() {
  return <ListeningContent />;
}

async function ListeningContent() {
  "use cache";
  cacheLife("hours");
  cacheTag("notion:listening");
  const initialPage = isPlaceholderNotionBuild()
    ? { items: [], nextCursor: null }
    : await getListeningHistoryDatabaseItems(undefined, 20);

  return <ListeningHistory initialData={[initialPage]} />;
}
