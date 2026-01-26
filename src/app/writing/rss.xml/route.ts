import { Feed } from "feed";

import { SITE_CONFIG } from "@/lib/metadata";
import { getWritingPostContent } from "@/lib/notion/queries";
import { extractPreviewText } from "@/lib/notion/rss-utils";
import { buildSlug } from "@/lib/short-id";
import { getAllWritingPosts } from "@/lib/writing";

export async function GET() {
  try {
    // Create the feed
    const feed = new Feed({
      title: `${SITE_CONFIG.name} - Writing`,
      description: "Essays, guides, and thoughts on design, engineering, and product development",
      id: `${SITE_CONFIG.url}/writing`,
      link: `${SITE_CONFIG.url}/writing`,
      language: "en",
      image: `${SITE_CONFIG.url}/api/og`,
      favicon: `${SITE_CONFIG.url}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, ${SITE_CONFIG.author.name}`,
      updated: new Date(),
      feedLinks: {
        rss: `${SITE_CONFIG.url}/writing/rss.xml`,
      },
      author: {
        name: SITE_CONFIG.author.name,
        link: SITE_CONFIG.url,
      },
    });

    // Fetch all writing posts
    const posts = await getAllWritingPosts();
    const postsWithShortId = posts.filter((post) => post.shortId);

    // Fetch content for all posts in parallel
    const postsWithContent = await Promise.all(
      postsWithShortId.map(async (post) => {
        const content = await getWritingPostContent(post.id);
        return { post, content };
      }),
    );

    // Add each post to the feed
    postsWithContent.forEach(({ post, content }) => {
      const postUrl = `${SITE_CONFIG.url}/writing/${buildSlug(post.title, post.shortId!)}`;
      const publishDate = new Date(post.published || post.createdTime);

      // Build description with content preview and view link
      const descriptionParts: string[] = [];
      if (content?.blocks) {
        const previewText = extractPreviewText(content.blocks, 2);
        if (previewText) {
          descriptionParts.push(previewText);
        }
      } else if (post.excerpt) {
        descriptionParts.push(post.excerpt);
      }
      descriptionParts.push(`View post: ${postUrl}`);
      const description = descriptionParts.join("\n\n");

      feed.addItem({
        title: post.title,
        id: post.id,
        link: postUrl,
        description,
        date: publishDate,
        published: publishDate,
        image: post.featureImage,
        author: [
          {
            name: SITE_CONFIG.author.name,
            link: SITE_CONFIG.url,
          },
        ],
      });
    });

    // Return RSS XML with proper content-type
    return new Response(feed.rss2(), {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
