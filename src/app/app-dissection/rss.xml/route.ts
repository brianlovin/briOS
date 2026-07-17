import { SITE_CONFIG } from "@/lib/metadata";
import { getAppDissectionDatabaseItems, getAppDissectionItemBySlug } from "@/lib/notion/queries";
import { extractPreviewText } from "@/lib/notion/types";
import { addRssItem, createRssFeed, rssErrorResponse, rssResponse } from "@/lib/rss";

export async function GET() {
  try {
    const items = await getAppDissectionDatabaseItems();

    const feed = createRssFeed({
      title: "App Dissection",
      description: "Detailed design breakdowns of iOS and Android apps",
      path: "/app-dissection",
    });

    // Fetch content for all items in parallel (gracefully handle failures)
    const itemsWithContent = await Promise.all(
      items.map(async (item) => {
        try {
          const content = await getAppDissectionItemBySlug(item.slug);
          return { item, content };
        } catch {
          return { item, content: null };
        }
      }),
    );

    itemsWithContent.forEach(({ item, content }) => {
      const itemUrl = `${SITE_CONFIG.url}/app-dissection/${item.slug}`;
      const publishDate = new Date(item.published);

      // Build description with intro text and view link
      const descriptionParts: string[] = [];
      if (content?.introBlocks) {
        const introText = extractPreviewText(content.introBlocks, { maxBlocks: 1 });
        if (introText) {
          descriptionParts.push(introText);
        }
      }
      descriptionParts.push(`View full dissection: ${itemUrl}`);
      const description = descriptionParts.join("\n\n");

      addRssItem(feed, {
        title: item.name,
        id: item.slug,
        link: itemUrl,
        description,
        date: publishDate,
        published: publishDate,
      });
    });

    return rssResponse(feed);
  } catch (error) {
    return rssErrorResponse("App Dissection", error);
  }
}
