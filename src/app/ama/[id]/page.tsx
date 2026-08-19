import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import AMADetail from "@/app/ama/AMADetail";
import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { getServerLikes } from "@/lib/likes-server";
import { createMetadata, truncateDescription } from "@/lib/metadata";
import {
  getAmaItemContent,
  isPlaceholderNotionBuild,
  type NotionAmaItemWithContent,
} from "@/lib/notion";

export const instant = false;

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  try {
    const item = await getAmaItemContent(id);

    if (!item) {
      return {
        title: "AMA Question Not Found",
      };
    }

    const description = item.description || `Question answered by Brian Lovin`;

    return createMetadata({
      title: item.title,
      description: truncateDescription(description),
      path: `/ama/${id}`,
    });
  } catch {
    return {
      title: "AMA Question",
    };
  }
}

export default async function AMADetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const item = await getCachedAmaDetail(params.id);
  const initialLikes = await getServerLikes([item.id]);

  return (
    <BatchLikesProvider pageIds={[item.id]} initialData={initialLikes}>
      <AMADetail initialQuestion={item} />
    </BatchLikesProvider>
  );
}

async function getCachedAmaDetail(id: string): Promise<NotionAmaItemWithContent> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:ama");
  if (isPlaceholderNotionBuild()) {
    notFound();
  }

  const item = await getAmaItemContent(id);
  if (!item) {
    notFound();
  }

  return item;
}
