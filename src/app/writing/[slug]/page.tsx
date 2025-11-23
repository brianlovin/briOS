import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";

import { renderBlocks } from "@/components/renderBlocks";
import { List, ListItem, ListItemLabel } from "@/components/shared/ListComponents";
import { TopBar } from "@/components/TopBar";
import { FancySeparator } from "@/components/ui/FancySeparator";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createArticleJsonLd, createMetadata, truncateDescription } from "@/lib/metadata";
import { getWritingPostContentBySlug } from "@/lib/notion";
import { getAllWritingPosts } from "@/lib/writing";

// Generate static params for all writing posts at build time
export async function generateStaticParams() {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.writingPosts);

  const posts = await getAllWritingPosts();

  return posts
    .filter((post) => post.slug) // Only include posts with slugs
    .map((post) => ({
      slug: post.slug,
    }));
}

// Generate metadata for each writing post
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.writingPosts);

  const params = await props.params;
  const slug = params.slug;
  const content = await getWritingPostContentBySlug(slug);

  if (!content) {
    return {};
  }

  const { metadata } = content;

  // Extract text content from blocks for description
  const description = metadata.excerpt || "A post by Brian Lovin";

  return createMetadata({
    title: metadata.title,
    description: truncateDescription(description),
    path: `/writing/${slug}`,
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
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.writingPosts);

  const params = await props.params;
  const slug = params.slug;
  const content = await getWritingPostContentBySlug(slug);

  if (!content) {
    notFound();
  }

  const { blocks, metadata } = content;

  const date = new Date(metadata.published || metadata.createdTime).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Get all posts and select 5 random ones (excluding current post)
  const allPosts = await getAllWritingPosts();
  const otherPosts = allPosts.filter((post) => post.slug && post.slug !== slug);
  const randomPosts = getRandomPosts(otherPosts, 5);

  // Generate JSON-LD structured data
  const articleJsonLd = createArticleJsonLd({
    title: metadata.title,
    description: metadata.excerpt || "A post by Brian Lovin",
    path: `/writing/${slug}`,
    publishedTime: metadata.published || metadata.createdTime,
    modifiedTime: metadata.createdTime,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <TopBar className="pr-3">
        <div className="flex flex-1 items-center gap-2">
          <Link href="/writing" className="hover:text-primary text-secondary text-sm font-medium">
            Writing
          </Link>
          <div className="text-quaternary text-sm font-medium">/</div>
          <div className="line-clamp-1 text-sm font-medium">{metadata.title}</div>
          <div className="text-tertiary ml-auto hidden text-sm sm:flex">{date}</div>
        </div>
      </TopBar>
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-8 px-4 py-12 md:px-6 lg:px-8 lg:py-16 xl:py-20">
          <div className="flex flex-col gap-2">
            <h1 className="text-primary text-3xl font-bold -tracking-[0.64px] xl:text-4xl">
              {metadata.title}
            </h1>
            {metadata.source && (
              <a
                href={metadata.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-tertiary hover:underline"
              >
                {metadata.source}
              </a>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-4 text-base">{renderBlocks(blocks)}</div>
        </div>

        <FancySeparator />

        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 md:px-6 lg:px-8 lg:py-16 xl:py-20">
          {randomPosts.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-tertiary text-base">Read next</h2>
              <List>
                {randomPosts.map((post) => (
                  <ListItem key={post.id} href={`/writing/${post.slug}`}>
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
