import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import { renderBlocks } from "@/components/renderBlocks";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getDesignDetailsEpisodeDatabaseItems, getFullContent } from "@/lib/notion";

async function getEpisodeContentCached(id: string) {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.designDetailsEpisodes);

  return await getFullContent(id);
}

export async function generateStaticParams() {
  // Return at least one result for build-time validation with Cache Components
  // Fetch the first episode to use as a static param
  try {
    const { items } = await getDesignDetailsEpisodeDatabaseItems(undefined, 1);
    if (items.length > 0) {
      return [{ id: items[0].id }];
    }
  } catch (error) {
    console.error("Error fetching design details episodes for generateStaticParams:", error);
  }
  // Fallback to empty array if fetch fails
  return [{ id: "" }];
}

export default async function EpisodePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const content = await getEpisodeContentCached(id);

  if (!content) {
    notFound();
  }

  const { blocks, metadata } = content;
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
      </div>
      <div className="flex flex-col gap-6">{renderBlocks(blocks)}</div>
    </div>
  );
}
