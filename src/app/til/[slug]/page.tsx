import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import { renderBlocks } from "@/components/renderBlocks";
import { PageTitle } from "@/components/Typography";
import { getServerLikes, type LikeCount } from "@/lib/likes-server";
import { createArticleJsonLd, createMetadata, truncateDescription } from "@/lib/metadata";
import {
  getTilByShortId,
  isPlaceholderNotionBuild,
  type NotionTilItemWithContent,
} from "@/lib/notion";
import { buildSlug, extractShortIdFromSlug } from "@/lib/short-id";

export const instant = false;

// Generate metadata for each TIL entry
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  const shortId = extractShortIdFromSlug(slug);
  if (!shortId) {
    return {};
  }

  const content = await getTilByShortId(shortId);
  if (!content) {
    return {};
  }

  const canonicalSlug = content.shortId ? buildSlug(content.title, content.shortId) : slug;

  return createMetadata({
    title: content.title,
    description: truncateDescription(`TIL: ${content.title}`),
    path: `/til/${canonicalSlug}`,
    type: "article",
    publishedTime: content.published,
  });
}

type CachedTilEntry = {
  content: NotionTilItemWithContent;
  canonicalSlug: string;
  cleanDate: string;
  articleJsonLd: ReturnType<typeof createArticleJsonLd>;
};

export default async function TilEntryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const entry = await getCachedTilEntry(params.slug);
  const initialLikes = await getServerLikes([entry.content.id]);

  return <TilEntryView entry={entry} initialLikes={initialLikes} />;
}

async function getCachedTilEntry(slug: string): Promise<CachedTilEntry> {
  "use cache";
  cacheLife("days");
  cacheTag("notion:til");
  if (isPlaceholderNotionBuild()) {
    notFound();
  }

  const shortId = extractShortIdFromSlug(slug);
  if (!shortId) {
    notFound();
  }

  const content = await getTilByShortId(shortId);
  if (!content) {
    notFound();
  }

  const canonicalSlug = content.shortId ? buildSlug(content.title, content.shortId) : slug;

  const cleanDate = new Date(content.published).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const articleJsonLd = createArticleJsonLd({
    title: content.title,
    description: `TIL: ${content.title}`,
    path: `/til/${canonicalSlug}`,
    publishedTime: content.published,
  });

  return { content, canonicalSlug, cleanDate, articleJsonLd };
}

function TilEntryView({
  entry,
  initialLikes,
}: {
  entry: CachedTilEntry;
  initialLikes: Record<string, LikeCount>;
}) {
  const { content, canonicalSlug, cleanDate, articleJsonLd } = entry;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="min-w-0 flex-1">
        <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-8 px-4 py-12 md:px-6 lg:px-8 lg:py-16 xl:py-20">
          <div className="flex flex-col gap-4">
            <p className="text-tertiary">TIL on {cleanDate}</p>
            <PageTitle>{content.title}</PageTitle>
          </div>

          <div className="notion-blocks flex min-w-0 flex-col gap-4 text-lg">
            {renderBlocks(content.blocks)}
          </div>
          <BatchLikesProvider pageIds={[content.id]} initialData={initialLikes}>
            <div className="w-fit">
              <LikeButton
                pageId={content.id}
                title={content.title}
                href={`/til/${canonicalSlug}`}
                contentType="til"
              />
            </div>
          </BatchLikesProvider>
        </div>
      </div>
    </>
  );
}
