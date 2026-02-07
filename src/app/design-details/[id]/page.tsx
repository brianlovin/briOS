import { notFound } from "next/navigation";

import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import { renderBlocks } from "@/components/renderBlocks";
import { getServerLikes } from "@/lib/likes-server";
import { getDesignDetailsEpisodeDatabaseItems, getFullContent } from "@/lib/notion";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { items } = await getDesignDetailsEpisodeDatabaseItems(undefined, 100);
  return items.map((episode) => ({ id: episode.id }));
}

export default async function EpisodePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const content = await getFullContent(id);

  if (!content) {
    notFound();
  }

  const { blocks, metadata } = content;

  // Fetch likes server-side
  const initialLikes = await getServerLikes([metadata.id]);

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
