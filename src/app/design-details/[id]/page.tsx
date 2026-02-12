import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import { MarkdownContent } from "@/components/MarkdownContent";
import { getDesignDetailsEpisodeById } from "@/db/queries/design-details";
import { getServerLikes } from "@/lib/likes-server";

async function EpisodeContent({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = await paramsPromise;
  const episode = await getDesignDetailsEpisodeById(id);

  if (!episode) {
    notFound();
  }

  const initialLikes = await getServerLikes([episode.id]);

  const date = episode.publishedAt
    ? new Date(episode.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex max-w-2xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-primary text-2xl font-semibold">{episode.name}</h1>
        {date && <span className="text-quaternary text-sm">{date}</span>}
        <BatchLikesProvider pageIds={[episode.id]} initialData={initialLikes}>
          <LikeButton pageId={episode.id} />
        </BatchLikesProvider>
      </div>
      {episode.content && (
        <div className="notion-blocks flex flex-col gap-6">
          <MarkdownContent content={episode.content} />
        </div>
      )}
    </div>
  );
}

export default function EpisodePage(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense>
      <EpisodeContent paramsPromise={props.params} />
    </Suspense>
  );
}
