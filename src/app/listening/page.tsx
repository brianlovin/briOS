import type { Metadata } from "next";

import { ListeningHistory } from "@/components/ListeningHistory";
import { getListeningHistoryItems } from "@/db/queries/listening";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Listening",
  description: "My listening history, synced from Spotify every hour",
  path: "/listening",
});

export const dynamic = "force-dynamic";

export default async function ListeningPage() {
  // Fetch initial page of music data on the server
  const initialPage = await getListeningHistoryItems(undefined, 20);

  return <ListeningHistory initialData={[initialPage]} />;
}
