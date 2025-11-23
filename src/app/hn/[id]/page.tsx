import type { Metadata } from "next";

import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import { CACHE_TAGS } from "@/lib/cache-tags";
import { getPostById, getRankedHNPosts } from "@/lib/hn";
import { createMetadata, truncateDescription } from "@/lib/metadata";
import { stripHtmlTags } from "@/lib/utils";

import HNPostPageClient from "./HNPostPageClient";

async function getHNPostCached(id: string) {
  "use cache";
  cacheLife({ stale: 10, revalidate: 60 });
  cacheTag(CACHE_TAGS.hnPosts);

  return await getPostById(id, true);
}

export async function generateStaticParams() {
  // Return at least one result for build-time validation with Cache Components
  // Fetch the first post to use as a static param
  try {
    const posts = await getRankedHNPosts();
    if (posts && posts.length > 0 && posts[0]) {
      return [{ id: posts[0].id.toString() }];
    }
  } catch (error) {
    console.error("Error fetching HN posts for generateStaticParams:", error);
  }
  // Fallback to empty array if fetch fails
  return [{ id: "" }];
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  try {
    const post = await getHNPostCached(id);

    if (!post) {
      return {
        title: "Hacker News Post Not Found",
      };
    }

    // Extract text from title (remove HTML if any)
    const cleanTitle = post.title ? stripHtmlTags(post.title) : "Hacker News Post";

    return createMetadata({
      title: cleanTitle,
      description: truncateDescription(
        post.content || `A discussion on Hacker News with ${post.comments_count || 0} comments.`,
      ),
      path: `/hn/${id}`,
    });
  } catch {
    return {
      title: "Hacker News Post",
    };
  }
}

export default async function HNPostPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const post = await getHNPostCached(params.id);

  if (!post) {
    notFound();
  }

  return <HNPostPageClient post={post} />;
}
