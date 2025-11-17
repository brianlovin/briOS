import type { Metadata } from "next";

import { ListeningHistory } from "@/components/ListeningHistory";
import { TopBar } from "@/components/TopBar";
import { createMetadata } from "@/lib/metadata";
import { getListeningHistoryDatabaseItems } from "@/lib/notion";

// Revalidate the page every 24 hours
export const revalidate = 86400;

export const metadata: Metadata = createMetadata({
  title: "Listening History",
  description:
    "My Spotify listening history. See what music I'm currently enjoying, synced from Spotify every hour.",
  path: "/listening-history",
});

export default async function ListeningPage() {
  // Fetch initial page of music data on the server
  const initialPage = await getListeningHistoryDatabaseItems(undefined, 20);

  return (
    <div className="flex flex-1 flex-col">
      <TopBar>
        <div className="flex-1 text-sm font-semibold">Listening history</div>
        <div className="text-quaternary pr-1.5 text-sm">Synced from Spotify every hour</div>
      </TopBar>

      <ListeningHistory initialData={[initialPage]} />
    </div>
  );
}
