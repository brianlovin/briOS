import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { notFound, redirect } from "next/navigation";

import ComputerDetail from "@/app/computer/ComputerDetail";
import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { COMPUTER_TITLE, computerSlugRedirect, resolveComputerTipFromSlug } from "@/lib/computer";
import { getServerLikes } from "@/lib/likes-server";
import { createMetadata, truncateDescription } from "@/lib/metadata";
import { isPlaceholderNotionBuild, type NotionComputerItemWithContent } from "@/lib/notion";
import { computerTipPublicPath } from "@/lib/notion/computer";
import { extractPreviewText } from "@/lib/notion/types";

export const instant = false;

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  try {
    const item = await resolveComputerTipFromSlug(slug);

    if (!item) {
      return {
        title: "Tip Not Found",
      };
    }

    const preview = extractPreviewText(item.blocks, { maxBlocks: 2 });
    const description = preview || `${COMPUTER_TITLE}: ${item.title}`;
    const path = computerTipPublicPath(item) ?? `/computer/${slug}`;

    return createMetadata({
      title: item.title,
      description: truncateDescription(description),
      path,
    });
  } catch {
    return {
      title: COMPUTER_TITLE,
    };
  }
}

export default async function ComputerDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const item = await getCachedComputerDetail(params.slug);
  const initialLikes = await getServerLikes([item.id]);

  return (
    <BatchLikesProvider pageIds={[item.id]} initialData={initialLikes}>
      <ComputerDetail initialTip={item} />
    </BatchLikesProvider>
  );
}

async function getCachedComputerDetail(slug: string): Promise<NotionComputerItemWithContent> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:computer");
  if (isPlaceholderNotionBuild()) {
    notFound();
  }

  const item = await resolveComputerTipFromSlug(slug);
  if (!item) {
    notFound();
  }

  const canonicalRedirect = computerSlugRedirect(slug, item);
  if (canonicalRedirect) {
    redirect(`/computer/${canonicalRedirect}`);
  }

  return item;
}
