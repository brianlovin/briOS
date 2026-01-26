import { Feed } from "feed";

import { getGoodWebsitesForRss } from "@/lib/goodWebsites";
import { SITE_CONFIG } from "@/lib/metadata";

export async function GET() {
  try {
    const feed = new Feed({
      title: `${SITE_CONFIG.name} - Good Websites`,
      description: "A curated collection of inspirational good websites",
      id: `${SITE_CONFIG.url}/sites`,
      link: `${SITE_CONFIG.url}/sites`,
      language: "en",
      image: `${SITE_CONFIG.url}/api/og`,
      favicon: `${SITE_CONFIG.url}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, ${SITE_CONFIG.author.name}`,
      updated: new Date(),
      feedLinks: {
        rss: `${SITE_CONFIG.url}/sites/rss.xml`,
      },
      author: {
        name: SITE_CONFIG.author.name,
        link: SITE_CONFIG.url,
      },
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

      feed.addItem({
        title: website.name,
        id: website.id,
        link: website.url || `${SITE_CONFIG.url}/sites`,
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
    console.error("Error generating Good Websites RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
