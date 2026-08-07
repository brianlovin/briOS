import type { Metadata } from "next";
import { Suspense } from "react";

import { ListeningHistory } from "@/components/ListeningHistory";
import { createMetadata } from "@/lib/metadata";
import { getListeningHistoryDatabaseItems } from "@/lib/notion";

export const metadata: Metadata = createMetadata({
  title: "Listening",
  description: "My listening history, synced from Spotify every hour",
  path: "/listening",
});

export default function ListeningPage() {
  return (
    <Suspense fallback={null}>
      <ListeningContent />
    </Suspense>
  );
}

async function ListeningContent() {
  // Fetch initial page of music data on the server
  const initialPage = await getListeningHistoryDatabaseItems(undefined, 20);

  return <ListeningHistory initialData={[initialPage]} />;
}
