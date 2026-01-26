import { Feed } from "feed";

import { SITE_CONFIG } from "@/lib/metadata";
import { getAppDissectionDatabaseItems, getAppDissectionItemBySlug } from "@/lib/notion/queries";
import { extractPreviewText } from "@/lib/notion/rss-utils";

export async function GET() {
  try {
    const items = await getAppDissectionDatabaseItems();

    const feed = new Feed({
      title: `${SITE_CONFIG.name} - App Dissection`,
      description: "Detailed design breakdowns of iOS and Android apps",
      id: `${SITE_CONFIG.url}/app-dissection`,
      link: `${SITE_CONFIG.url}/app-dissection`,
      language: "en",
      image: `${SITE_CONFIG.url}/api/og`,
      favicon: `${SITE_CONFIG.url}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, ${SITE_CONFIG.author.name}`,
      updated: new Date(),
      feedLinks: {
        rss: `${SITE_CONFIG.url}/app-dissection/rss.xml`,
      },
      author: {
        name: SITE_CONFIG.author.name,
        link: SITE_CONFIG.url,
      },
    });

    // Fetch content for all items in parallel
    const itemsWithContent = await Promise.all(
      items.map(async (item) => {
        const content = await getAppDissectionItemBySlug(item.slug);
        return { item, content };
      }),
    );

    itemsWithContent.forEach(({ item, content }) => {
      const itemUrl = `${SITE_CONFIG.url}/app-dissection/${item.slug}`;
      const publishDate = new Date(item.published);

      // Build description with intro text and view link
      const descriptionParts: string[] = [];
      if (content?.introBlocks) {
        const introText = extractPreviewText(content.introBlocks, 1);
        if (introText) {
          descriptionParts.push(introText);
        }
      }
      descriptionParts.push(`View full dissection: ${itemUrl}`);
      const description = descriptionParts.join("\n\n") || `Design breakdown of ${item.name}`;

      feed.addItem({
        title: item.name,
        id: item.slug,
        link: itemUrl,
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
    console.error("Error generating App Dissection RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
