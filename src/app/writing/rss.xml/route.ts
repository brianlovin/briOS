import { SITE_CONFIG } from "@/lib/metadata";
import { getWritingPostContent } from "@/lib/notion/queries";
import { extractPreviewText } from "@/lib/notion/types";
import { addRssItem, createRssFeed, rssErrorResponse, rssResponse } from "@/lib/rss";
import { buildSlug } from "@/lib/short-id";
import { getAllWritingPosts } from "@/lib/writing";

export async function GET() {
  try {
    const feed = createRssFeed({
      title: "Writing",
      description: "Essays, guides, and thoughts on design, engineering, and product development",
      path: "/writing",
    });

    // Fetch all writing posts
    const posts = await getAllWritingPosts();
    const postsWithShortId = posts.filter((post) => post.shortId);

    // Fetch content for all posts in parallel (gracefully handle failures)
    const postsWithContent = await Promise.all(
      postsWithShortId.map(async (post) => {
        try {
          const content = await getWritingPostContent(post.id);
          return { post, content };
        } catch {
          return { post, content: null };
        }
      }),
    );

    // Add each post to the feed
    postsWithContent.forEach(({ post, content }) => {
      const postUrl = `${SITE_CONFIG.url}/writing/${buildSlug(post.title, post.shortId!)}`;
      const publishDate = new Date(post.published || post.createdTime);

      // Build description with content preview and view link
      const descriptionParts: string[] = [];
      if (content?.blocks) {
        const previewText = extractPreviewText(content.blocks, { maxBlocks: 2 });
        if (previewText) {
          descriptionParts.push(previewText);
        }
      } else if (post.excerpt) {
        descriptionParts.push(post.excerpt);
      }
      descriptionParts.push(`View post: ${postUrl}`);
      const description = descriptionParts.join("\n\n");

      addRssItem(feed, {
        title: post.title,
        id: post.id,
        link: postUrl,
        description,
        date: publishDate,
        published: publishDate,
        image: post.featureImage,
      });
    });

    return rssResponse(feed);
  } catch (error) {
    return rssErrorResponse("Writing", error);
  }
}
