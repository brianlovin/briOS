import { Feed } from "feed";

import { SITE_CONFIG } from "@/lib/metadata";
import { getTilItemContent } from "@/lib/notion/queries";
import { extractPreviewText } from "@/lib/notion/types";
import { buildSlug } from "@/lib/short-id";
import { getAllTilEntries } from "@/lib/til";

export async function GET() {
  try {
    const feed = new Feed({
      title: `${SITE_CONFIG.name} - TIL`,
      description: "Today I Learned - Quick notes and discoveries",
      id: `${SITE_CONFIG.url}/til`,
      link: `${SITE_CONFIG.url}/til`,
      language: "en",
      image: `${SITE_CONFIG.url}/api/og`,
      favicon: `${SITE_CONFIG.url}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, ${SITE_CONFIG.author.name}`,
      updated: new Date(),
      feedLinks: {
        rss: `${SITE_CONFIG.url}/til/rss.xml`,
      },
      author: {
        name: SITE_CONFIG.author.name,
        link: SITE_CONFIG.url,
      },
    });

    const entries = await getAllTilEntries();
    const entriesWithShortId = entries.filter((entry) => entry.shortId);

    // Fetch content for all entries in parallel (gracefully handle failures)
    const entriesWithContent = await Promise.all(
      entriesWithShortId.map(async (entry) => {
        try {
          const content = await getTilItemContent(entry.id);
          return { entry, content };
        } catch {
          return { entry, content: null };
        }
      }),
    );

    entriesWithContent.forEach(({ entry, content }) => {
      const entryUrl = `${SITE_CONFIG.url}/til/${buildSlug(entry.title, entry.shortId!)}`;
      const publishDate = new Date(entry.published);

      // Build description with first paragraph and view link
      const descriptionParts: string[] = [];
      if (content?.blocks) {
        const previewText = extractPreviewText(content.blocks, { maxBlocks: 1 });
        if (previewText) {
          descriptionParts.push(previewText);
        }
      }
      descriptionParts.push(`View post: ${entryUrl}`);
      const description = descriptionParts.join("\n\n");

      feed.addItem({
        title: entry.title,
        id: entry.id,
        link: entryUrl,
        description,
        date: publishDate,
        published: publishDate,
        author: [
          {
            name: SITE_CONFIG.author.name,
            link: SITE_CONFIG.url,
          },
        ],
      });
    });

    return new Response(feed.rss2(), {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating TIL RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
