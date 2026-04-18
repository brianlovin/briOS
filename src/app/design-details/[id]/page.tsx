import { notFound } from "next/navigation";

import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import { renderBlocks } from "@/components/renderBlocks";
import { getServerLikes, type LikeData } from "@/lib/likes-server";
import { getFullContent } from "@/lib/notion";

export const dynamic = "force-dynamic";

export default async function EpisodePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  // Let Notion errors propagate to error.tsx — crawlers should see 5xx (retry)
  // rather than a 404 that could deindex a valid URL during a transient outage.
  const content = await getFullContent(id);

  if (!content) {
    notFound();
  }

  const { blocks, metadata } = content;

  // Likes are non-essential — if the fetch fails, render zero counts instead
  // of crashing the whole page. The client-side BatchLikesProvider will
  // refresh the real count after hydration.
  let initialLikes: Record<string, LikeData>;
  try {
    initialLikes = await getServerLikes([metadata.id]);
  } catch (err) {
    console.error(`[design-details] getServerLikes failed for ${metadata.id}:`, err);
    initialLikes = {
      [metadata.id]: { count: 0, userLikes: 0, hasLiked: false, canLike: true },
    };
  }

  const date = new Date(metadata.published || metadata.createdTime).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex max-w-2xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-primary text-2xl font-semibold">{metadata.title}</h1>
        <span className="text-quaternary text-sm">{date}</span>
        <BatchLikesProvider pageIds={[metadata.id]} initialData={initialLikes}>
          <LikeButton pageId={metadata.id} />
        </BatchLikesProvider>
      </div>
      <div className="notion-blocks flex flex-col gap-6">{renderBlocks(blocks)}</div>
    </div>
  );
}
