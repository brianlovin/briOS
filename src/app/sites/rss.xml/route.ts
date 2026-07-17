import { getGoodWebsitesForRss } from "@/lib/goodWebsites";
import { SITE_CONFIG } from "@/lib/metadata";
import { addRssItem, createRssFeed, rssErrorResponse, rssResponse } from "@/lib/rss";

export async function GET() {
  try {
    const feed = createRssFeed({
      title: "Good Websites",
      description: "A curated collection of inspirational good websites",
      path: "/sites",
    });

    const websites = await getGoodWebsitesForRss();

    websites.forEach((website) => {
      const publishDate = new Date(website.createdTime);

      // Build description with view link and tags
      const descriptionParts: string[] = [];
      if (website.url) {
        descriptionParts.push(`View: ${website.url}`);
      }
      if (website.tags?.length) {
        descriptionParts.push(`Tags: ${website.tags.join(", ")}`);
      }
      const description = descriptionParts.join("\n\n") || "A good website";

      addRssItem(feed, {
        title: website.name,
        id: website.id,
        link: website.url || `${SITE_CONFIG.url}/sites`,
        description,
        date: publishDate,
        published: publishDate,
      });
    });

    return rssResponse(feed);
  } catch (error) {
    return rssErrorResponse("Good Websites", error);
  }
}
