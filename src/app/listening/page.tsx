import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";

import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { ListeningHistory } from "@/components/ListeningHistory";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { createMetadata } from "@/lib/metadata";
import { getListeningHistoryDatabaseItems } from "@/lib/notion";

export const metadata: Metadata = createMetadata({
  title: "Listening",
  description: "My listening history, synced from Spotify every hour",
  path: "/listening",
});

export default function ListeningPage() {
  return (
    <Suspense fallback={<ListeningFallback />}>
      <ListeningContent />
    </Suspense>
  );
}

function ListeningFallback() {
  return (
    <ListDetailWrapper>
      <div className="flex h-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    </ListDetailWrapper>
  );
}

async function ListeningContent() {
  "use cache";
  cacheLife("hours");
  cacheTag("notion:listening");
  // Fetch initial page of music data on the server
  const initialPage = await getListeningHistoryDatabaseItems(undefined, 20);

  return <ListeningHistory initialData={[initialPage]} />;
}
