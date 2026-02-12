import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import { MarkdownContent } from "@/components/MarkdownContent";
import { PageTitle } from "@/components/Typography";
import { getAllTilSlugs, getTilEntryByShortId } from "@/db/queries/til";
import { getServerLikes } from "@/lib/likes-server";
import { createArticleJsonLd, createMetadata, truncateDescription } from "@/lib/metadata";
import { buildSlug, extractShortIdFromSlug } from "@/lib/short-id";

export async function generateStaticParams() {
  const entries = await getAllTilSlugs();
  return entries.filter((e) => e.shortId).map((e) => ({ slug: buildSlug(e.title, e.shortId!) }));
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

  const entry = await getTilEntryByShortId(shortId);
  if (!entry) {
    return {};
  }

  const canonicalSlug = entry.shortId ? buildSlug(entry.title, entry.shortId) : slug;

  return createMetadata({
    title: entry.title,
    description: truncateDescription(`TIL: ${entry.title}`),
    path: `/til/${canonicalSlug}`,
    type: "article",
    publishedTime: entry.publishedAt || entry.createdAt,
  });
}

export default async function TilEntryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  const shortId = extractShortIdFromSlug(slug);
  if (!shortId) {
    notFound();
  }

  const entry = await getTilEntryByShortId(shortId);
  if (!entry) {
    notFound();
  }

  const canonicalSlug = entry.shortId ? buildSlug(entry.title, entry.shortId) : slug;

  // Fetch likes server-side
  const initialLikes = await getServerLikes([entry.id]);

  const publishedAt = entry.publishedAt || entry.createdAt;
  const parsedDate = new Date(publishedAt);
  const cleanDate = Number.isNaN(parsedDate.getTime())
    ? "Unknown date"
    : parsedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });

  const articleJsonLd = createArticleJsonLd({
    title: entry.title,
    description: `TIL: ${entry.title}`,
    path: `/til/${canonicalSlug}`,
    publishedTime: publishedAt,
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
            <PageTitle>{entry.title}</PageTitle>
          </div>

          <div className="notion-blocks flex min-w-0 flex-col gap-4 text-lg">
            <MarkdownContent content={entry.content} />
          </div>
          <BatchLikesProvider pageIds={[entry.id]} initialData={initialLikes}>
            <div className="w-fit">
              <LikeButton pageId={entry.id} />
            </div>
          </BatchLikesProvider>
        </div>
      </div>
    </>
  );
}
