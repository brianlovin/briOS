import { Feed } from "feed";

import { SITE_CONFIG } from "@/lib/metadata";
import { getStacks } from "@/lib/stack";

export async function GET() {
  try {
    const feed = new Feed({
      title: `${SITE_CONFIG.name} - Stack`,
      description: "Apps, tools, and services I use every day",
      id: `${SITE_CONFIG.url}/stack`,
      link: `${SITE_CONFIG.url}/stack`,
      language: "en",
      image: `${SITE_CONFIG.url}/api/og`,
      favicon: `${SITE_CONFIG.url}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, ${SITE_CONFIG.author.name}`,
      updated: new Date(),
      feedLinks: {
        rss: `${SITE_CONFIG.url}/stack/rss.xml`,
      },
      author: {
        name: SITE_CONFIG.author.name,
        link: SITE_CONFIG.url,
      },
    });

    const items = await getStacks();

    items
      .filter((item) => item.status?.toLowerCase() === "active")
      .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
      .forEach((item) => {
        const createdDate = new Date(item.createdTime);

        feed.addItem({
          title: item.name,
          id: item.id,
          link: item.url || `${SITE_CONFIG.url}/stack`,
          description: item.description || `${item.name} - part of my daily stack`,
          date: createdDate,
          published: createdDate,
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
    console.error("Error generating Stack RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
