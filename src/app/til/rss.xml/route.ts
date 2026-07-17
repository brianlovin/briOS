import { SITE_CONFIG } from "@/lib/metadata";
import { getTilItemContent } from "@/lib/notion/queries";
import { extractPreviewText } from "@/lib/notion/types";
import { addRssItem, createRssFeed, rssErrorResponse, rssResponse } from "@/lib/rss";
import { buildSlug } from "@/lib/short-id";
import { getAllTilEntries } from "@/lib/til";

export async function GET() {
  try {
    const feed = createRssFeed({
      title: "TIL",
      description: "Today I Learned - Quick notes and discoveries",
      path: "/til",
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

      addRssItem(feed, {
        title: entry.title,
        id: entry.id,
        link: entryUrl,
        description,
        date: publishDate,
        published: publishDate,
      });
    });

    return rssResponse(feed);
  } catch (error) {
    return rssErrorResponse("TIL", error);
  }
}
