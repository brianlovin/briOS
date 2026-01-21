import type { Metadata } from "next";

import { getPostById, getPostIds } from "@/lib/hn";
import { createMetadata, truncateDescription } from "@/lib/metadata";
import { stripHtmlTags } from "@/lib/utils";

import HNPostPageClient from "./HNPostPageClient";

export const revalidate = 3600;

// Allow dynamic params for posts not pre-generated
export const dynamicParams = true;

// Pre-generate top 24 HN posts at build time
export async function generateStaticParams() {
  try {
    const ids = await getPostIds();
    // Pre-generate top 24 posts (matches getHNPosts behavior)
    return ids.slice(0, 24).map((id) => ({
      id: id.toString(),
    }));
  } catch (error) {
    console.error("[HN] Error generating static params:", error);
    // Return empty array to allow dynamic generation
    return [];
  }
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  try {
    const post = await getPostById(id, false);

    if (!post) {
      return {
        title: "Hacker News Post Not Found",
      };
    }

    // Extract text from title (remove HTML if any)
    const cleanTitle = post.title ? stripHtmlTags(post.title) : "Hacker News Post";

    return {
      ...createMetadata({
        title: `${cleanTitle} - Hacker News`,
        description: truncateDescription(
          post.content || `A discussion on Hacker News with ${post.comments_count || 0} comments.`,
        ),
        path: `/hn/${id}`,
      }),
      alternates: {
        canonical: `https://news.ycombinator.com/item?id=${id}`,
      },
    };
  } catch {
    return {
      title: "Hacker News Post",
    };
  }
}

export default async function HNPostPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  // Fetch post with comments on server - React cache() deduplicates with generateMetadata
  const post = await getPostById(id, true);

  // Pass server-fetched data to client as initialData to avoid double-fetch
  return <HNPostPageClient initialPost={post} />;
}
