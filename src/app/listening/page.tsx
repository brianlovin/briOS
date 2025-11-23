import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { ListeningHistory } from "@/components/ListeningHistory";
import { TopBar } from "@/components/TopBar";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createMetadata } from "@/lib/metadata";
import { getListeningHistoryDatabaseItems } from "@/lib/notion";

export const metadata: Metadata = createMetadata({
  title: "Listening",
  description: "My listening history, synced from Spotify every hour",
  path: "/listening",
});

export default async function ListeningPage() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.listening);

  // Fetch initial page of music data on the server
  const initialPage = await getListeningHistoryDatabaseItems(undefined, 20);

  return (
    <div className="flex flex-1 flex-col">
      <TopBar>
        <div className="flex-1 text-sm font-semibold">Listening</div>
        <div className="text-quaternary hidden pr-1.5 text-sm sm:visible">
          Synced from Spotify every hour
        </div>
      </TopBar>

      <ListeningHistory initialData={[initialPage]} />
    </div>
  );
}
