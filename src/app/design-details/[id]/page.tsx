import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";

import { renderBlocks } from "@/components/renderBlocks";
import { getDesignDetailsEpisodeDatabaseItems, getFullContent } from "@/lib/notion";

export async function generateStaticParams() {
  "use cache";
  cacheLife("days");

  // Generate static params for the first 30 podcast episodes
  const { items } = await getDesignDetailsEpisodeDatabaseItems(undefined, 30);

  return items.map((item) => ({
    id: item.id,
  }));
}

export default async function EpisodePage(props: { params: Promise<{ id: string }> }) {
  "use cache";
  cacheLife("days");

  const params = await props.params;
  const id = params.id;
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
