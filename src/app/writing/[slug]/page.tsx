import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { BatchLikesProvider } from "@/components/likes/BatchLikesProvider";
import { LikeButton } from "@/components/likes/LikeButton";
import { MarkdownContent } from "@/components/MarkdownContent";
import { List, ListItem, ListItemLabel } from "@/components/shared/ListComponents";
import { PageTitle } from "@/components/Typography";
import { FancySeparator } from "@/components/ui/FancySeparator";
import {
  getAllWritingPostSlugs,
  getWritingPostByShortId,
  getWritingPostBySlug,
} from "@/db/queries/writing";
import { getServerLikes } from "@/lib/likes-server";
import { createArticleJsonLd, createMetadata, truncateDescription } from "@/lib/metadata";
import { buildSlug, extractShortIdFromSlug } from "@/lib/short-id";
import { getAllWritingPosts } from "@/lib/writing.server";

export async function generateStaticParams() {
  const posts = await getAllWritingPostSlugs();
  return posts.filter((p) => p.shortId).map((p) => ({ slug: buildSlug(p.title, p.shortId!) }));
}

// Generate metadata for each writing post
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  // Try to extract Short ID from the URL
  const shortId = extractShortIdFromSlug(slug);
  let post = shortId ? await getWritingPostByShortId(shortId) : null;

  // Fallback to legacy slug lookup
  if (!post) {
    post = await getWritingPostBySlug(slug);
  }

  if (!post) {
    return {};
  }

  // Use the canonical URL with Short ID if available
  const canonicalSlug = post.shortId ? buildSlug(post.title, post.shortId) : slug;

  const description = post.excerpt || "A post by Brian Lovin";

  return createMetadata({
    title: post.title,
    description: truncateDescription(description),
    path: `/writing/${canonicalSlug}`,
    image: post.featureImage ?? undefined,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

// Seeded random to produce stable "Read next" picks within each revalidation window
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function getRandomPosts<T>(posts: T[], count: number, seed: number): T[] {
  const shuffled = [...posts];
  const random = seededRandom(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export default async function WritingPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  // Try to extract Short ID from the URL
  const shortId = extractShortIdFromSlug(slug);
  let post = shortId ? await getWritingPostByShortId(shortId) : null;

  // Fallback to legacy slug lookup
  if (!post) {
    post = await getWritingPostBySlug(slug);

    // If found via legacy lookup and has a Short ID, redirect to canonical URL
    if (post && post.shortId) {
      const canonicalSlug = buildSlug(post.title, post.shortId);
      redirect(`/writing/${canonicalSlug}`);
    }
  }

  if (!post) {
    notFound();
  }

  // Use canonical slug for all URLs
  const canonicalSlug = post.shortId ? buildSlug(post.title, post.shortId) : slug;

  // Fetch likes and related posts in parallel
  const [initialLikes, allPosts] = await Promise.all([
    getServerLikes([post.id]),
    getAllWritingPosts(),
  ]);

  // Get 5 random posts (excluding current post)
  // Seed from post identity so each post gets a unique but stable "Read next" set
  const seed = (post.shortId ?? post.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const otherPosts = allPosts.filter((p) => p.shortId && p.shortId !== post.shortId);
  const randomPosts = getRandomPosts(otherPosts, 5, seed);

  // Generate JSON-LD structured data
  const articleJsonLd = createArticleJsonLd({
    title: post.title,
    description: post.excerpt || "A post by Brian Lovin",
    path: `/writing/${canonicalSlug}`,
    publishedTime: post.publishedAt,
    image: post.featureImage ?? undefined,
  });

  const cleanDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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
            <PageTitle>{post.title}</PageTitle>
            <BatchLikesProvider pageIds={[post.id]} initialData={initialLikes}>
              <div className="w-fit">
                <LikeButton pageId={post.id} />
              </div>
            </BatchLikesProvider>
          </div>

          <div className="notion-blocks flex min-w-0 flex-col gap-4 text-lg">
            <MarkdownContent content={post.content} />
          </div>
        </div>

        <FancySeparator />

        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 md:px-6 lg:px-8 lg:py-16 xl:py-20">
          {randomPosts.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="bg-brand h-1 w-5 rounded-full" />
              <h2 className="text-tertiary text-base">Read next</h2>
              <List>
                {randomPosts.map((p) => (
                  <ListItem key={p.id} href={`/writing/${buildSlug(p.title, p.shortId!)}`}>
                    <ListItemLabel>{p.title}</ListItemLabel>
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
