import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { renderBlocks } from "@/components/renderBlocks";
import { List, ListItem, ListItemLabel } from "@/components/shared/ListComponents";
import { PageTitle } from "@/components/Typography";
import { FancySeparator } from "@/components/ui/FancySeparator";
import { createArticleJsonLd, createMetadata, truncateDescription } from "@/lib/metadata";
import { getWritingPostContentBySlug } from "@/lib/notion";
import { getAllWritingPosts } from "@/lib/writing";

// Generate static params for all writing posts at build time
export async function generateStaticParams() {
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
  const params = await props.params;
  const slug = params.slug;
  const content = await getWritingPostContentBySlug(slug);

  if (!content) {
    notFound();
  }

  const { blocks, metadata } = content;

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
          <div className="flex flex-col gap-4">
            <PageTitle>{metadata.title}</PageTitle>
            <p className="text-tertiary">{cleanDate}</p>
          </div>

          <div className="flex min-w-0 flex-col gap-4 text-base md:text-lg">
            {renderBlocks(blocks)}
          </div>
        </div>

        <FancySeparator />

        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 md:px-6 lg:px-8 lg:py-16 xl:py-20">
          {randomPosts.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="h-1 w-5 rounded-full bg-[#FC532A]" />
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
