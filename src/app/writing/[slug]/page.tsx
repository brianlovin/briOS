import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import { renderBlocks } from "@/components/renderBlocks";
import { List, ListItem, ListItemLabel } from "@/components/shared/ListComponents";
import { PageTitle } from "@/components/Typography";
import { FancySeparator } from "@/components/ui/FancySeparator";
import { getServerLikes } from "@/lib/likes-server";
import { createArticleJsonLd, createMetadata, truncateDescription } from "@/lib/metadata";
import { getWritingPostByShortId, getWritingPostContentBySlug } from "@/lib/notion";
import { buildSlug, extractShortIdFromSlug } from "@/lib/short-id";
import { getAllWritingPosts } from "@/lib/writing";

export const revalidate = 3600;

// Generate metadata for each writing post
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  // Try to extract Short ID from the URL
  const shortId = extractShortIdFromSlug(slug);
  let content = shortId ? await getWritingPostByShortId(shortId) : null;

  // Fallback to legacy slug lookup
  if (!content) {
    content = await getWritingPostContentBySlug(slug);
  }

  if (!content) {
    return {};
  }

  const { metadata } = content;

  // Use the canonical URL with Short ID if available
  const canonicalSlug = metadata.shortId ? buildSlug(metadata.title, metadata.shortId) : slug;

  // Extract text content from blocks for description
  const description = metadata.excerpt || "A post by Brian Lovin";

  return createMetadata({
    title: metadata.title,
    description: truncateDescription(description),
    path: `/writing/${canonicalSlug}`,
    type: "article",
    publishedTime: metadata.published || metadata.createdTime,
    modifiedTime: metadata.createdTime,
  });
}

function getRandomPosts<T>(posts: T[], count: number): T[] {
  const shuffled = [...posts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default async function WritingPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  // Try to extract Short ID from the URL
  const shortId = extractShortIdFromSlug(slug);
  let content = shortId ? await getWritingPostByShortId(shortId) : null;

  // Fallback to legacy slug lookup
  if (!content) {
    content = await getWritingPostContentBySlug(slug);

    // If found via legacy lookup and has a Short ID, redirect to canonical URL
    if (content && content.metadata.shortId) {
      const canonicalSlug = buildSlug(content.metadata.title, content.metadata.shortId);
      redirect(`/writing/${canonicalSlug}`);
    }
  }

  if (!content) {
    notFound();
  }

  const { blocks, metadata } = content;

  // Use canonical slug for all URLs
  const canonicalSlug = metadata.shortId ? buildSlug(metadata.title, metadata.shortId) : slug;

  // Fetch likes and related posts in parallel
  const [initialLikes, allPosts] = await Promise.all([
    getServerLikes([metadata.id]),
    getAllWritingPosts(),
  ]);

  // Get 5 random posts (excluding current post)
  const otherPosts = allPosts.filter((post) => post.shortId && post.shortId !== metadata.shortId);
  const randomPosts = getRandomPosts(otherPosts, 5);

  // Generate JSON-LD structured data
  const articleJsonLd = createArticleJsonLd({
    title: metadata.title,
    description: metadata.excerpt || "A post by Brian Lovin",
    path: `/writing/${canonicalSlug}`,
    publishedTime: metadata.published || metadata.createdTime,
    modifiedTime: metadata.createdTime,
  });

  const cleanDate = new Date(metadata.published || metadata.createdTime).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="min-w-0 flex-1">
        <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-8 px-4 py-12 md:px-6 lg:px-8 lg:py-16 xl:py-20">
          <div className="flex flex-col gap-6">
            <p className="text-tertiary">{cleanDate}</p>
            <PageTitle>{metadata.title}</PageTitle>
            <BatchLikesProvider pageIds={[metadata.id]} initialData={initialLikes}>
              <div className="w-fit">
                <LikeButton pageId={metadata.id} />
              </div>
            </BatchLikesProvider>
          </div>

          <div className="notion-blocks flex min-w-0 flex-col gap-4 text-lg">
            {renderBlocks(blocks)}
          </div>
        </div>

        <FancySeparator />

        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 md:px-6 lg:px-8 lg:py-16 xl:py-20">
          {randomPosts.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="bg-brand h-1 w-5 rounded-full" />
              <h2 className="text-tertiary text-base">Read next</h2>
              <List>
                {randomPosts.map((post) => (
                  <ListItem key={post.id} href={`/writing/${buildSlug(post.title, post.shortId!)}`}>
                    <ListItemLabel>{post.title}</ListItemLabel>
                  </ListItem>
                ))}
              </List>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
