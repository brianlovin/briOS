import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import AMADetail from "@/app/ama/AMADetail";
import { createMetadata, truncateDescription } from "@/lib/metadata";
import { getAmaItemContent, isPlaceholderNotionBuild } from "@/lib/notion";

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
  return <CachedAmaDetail id={params.id} />;
}

async function CachedAmaDetail({ id }: { id: string }) {
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

  return <AMADetail initialQuestion={item} />;
}
