import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";

import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import { renderBlocks } from "@/components/renderBlocks";
import { getServerLikes, type LikeCount } from "@/lib/likes-server";
import {
  getFullContent,
  isPlaceholderNotionBuild,
  type NotionItem,
  type ProcessedBlock,
} from "@/lib/notion";

export const instant = false;

type CachedEpisode = {
  blocks: ProcessedBlock[];
  metadata: NotionItem;
  date: string;
  id: string;
};

export default async function EpisodePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const episode = await getCachedEpisode(params.id);
  let initialLikes: Record<string, LikeCount> = {};
  try {
    initialLikes = await getServerLikes([episode.metadata.id]);
  } catch (err) {
    console.error(`[design-details] getServerLikes failed for ${episode.metadata.id}:`, err);
  }

  return <EpisodeView episode={episode} initialLikes={initialLikes} />;
}

async function getCachedEpisode(id: string): Promise<CachedEpisode> {
  "use cache";
  cacheLife("days");
  if (isPlaceholderNotionBuild()) {
    notFound();
  }

  // Let Notion errors propagate to error.tsx — crawlers should see 5xx (retry)
  // rather than a 404 that could deindex a valid URL during a transient outage.
  const content = await getFullContent(id);

  if (!content) {
    notFound();
  }

  const { blocks, metadata } = content;

  const date = new Date(metadata.published || metadata.createdTime).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return { blocks, metadata, date, id };
}

function EpisodeView({
  episode,
  initialLikes,
}: {
  episode: CachedEpisode;
  initialLikes: Record<string, LikeCount>;
}) {
  const { blocks, metadata, date, id } = episode;

  return (
    <div className="flex max-w-2xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-primary text-2xl font-semibold">{metadata.title}</h1>
        <span className="text-quaternary text-sm">{date}</span>
        <BatchLikesProvider pageIds={[metadata.id]} initialData={initialLikes}>
          <LikeButton
            pageId={metadata.id}
            title={metadata.title}
            href={`/design-details/${id}`}
            contentType="design_details"
          />
        </BatchLikesProvider>
      </div>
      <div className="notion-blocks flex flex-col gap-6">{renderBlocks(blocks)}</div>
    </div>
  );
}
