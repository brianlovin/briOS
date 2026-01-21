import { Feed } from "feed";

import { SITE_CONFIG } from "@/lib/metadata";
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

    entries
      .filter((entry) => entry.shortId)
      .forEach((entry) => {
        const entryUrl = `${SITE_CONFIG.url}/til/${buildSlug(entry.title, entry.shortId!)}`;
        const publishDate = new Date(entry.published);

        feed.addItem({
          title: entry.title,
          id: entry.id,
          link: entryUrl,
          description: `TIL: ${entry.title}`,
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
