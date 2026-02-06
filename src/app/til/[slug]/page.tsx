import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import { renderBlocks } from "@/components/renderBlocks";
import { PageTitle } from "@/components/Typography";
import { getServerLikes } from "@/lib/likes-server";
import { createArticleJsonLd, createMetadata, truncateDescription } from "@/lib/metadata";
import { getTilByShortId } from "@/lib/notion";
import { buildSlug, extractShortIdFromSlug } from "@/lib/short-id";
import { getAllTilEntries } from "@/lib/til";

export const revalidate = 3600;

// Generate static params for the 10 most recent TIL entries at build time
export async function generateStaticParams() {
  const entries = await getAllTilEntries();

  return entries
    .filter((entry) => entry.shortId)
    .slice(0, 10) // Only prebuild 10 most recent
    .map((entry) => ({
      slug: buildSlug(entry.title, entry.shortId!),
    }));
}

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

export default async function TilEntryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  const shortId = extractShortIdFromSlug(slug);
  if (!shortId) {
    notFound();
  }

  const content = await getTilByShortId(shortId);
  if (!content) {
    notFound();
  }

  const canonicalSlug = content.shortId ? buildSlug(content.title, content.shortId) : slug;

  // Fetch likes server-side
  const initialLikes = await getServerLikes([content.id]);

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
              <LikeButton pageId={content.id} />
            </div>
          </BatchLikesProvider>
        </div>
      </div>
    </>
  );
}
