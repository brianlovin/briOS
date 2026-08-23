import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import ComputerDetail from "@/app/computer/ComputerDetail";
import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { COMPUTER_TITLE } from "@/lib/computer";
import { getServerLikes } from "@/lib/likes-server";
import { createMetadata, truncateDescription } from "@/lib/metadata";
import {
  getComputerItemContent,
  isPlaceholderNotionBuild,
  type NotionComputerItemWithContent,
} from "@/lib/notion";
import { extractPreviewText } from "@/lib/notion/types";

export const instant = false;

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  try {
    const item = await getComputerItemContent(id);

    if (!item) {
      return {
        title: "Tip Not Found",
      };
    }

    const preview = extractPreviewText(item.blocks, { maxBlocks: 2 });
    const description = preview || `${COMPUTER_TITLE}: ${item.title}`;

    return createMetadata({
      title: item.title,
      description: truncateDescription(description),
      path: `/computer/${id}`,
    });
  } catch {
    return {
      title: COMPUTER_TITLE,
    };
  }
}

export default async function ComputerDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const item = await getCachedComputerDetail(params.id);
  const initialLikes = await getServerLikes([item.id]);

  return (
    <BatchLikesProvider pageIds={[item.id]} initialData={initialLikes}>
      <ComputerDetail initialTip={item} />
    </BatchLikesProvider>
  );
}

async function getCachedComputerDetail(id: string): Promise<NotionComputerItemWithContent> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:computer");
  if (isPlaceholderNotionBuild()) {
    notFound();
  }

  const item = await getComputerItemContent(id);
  if (!item) {
    notFound();
  }

  return item;
}
