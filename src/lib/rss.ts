import { Feed, type Item } from "feed";

import { SITE_CONFIG } from "@/lib/metadata";

const RSS_AUTHOR = {
  name: SITE_CONFIG.author.name,
  link: SITE_CONFIG.url,
};

const RSS_CACHE_CONTROL = "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400";

/**
 * Create a `Feed` pre-populated with the site-wide RSS defaults.
 *
 * @param title - Section title, appended to the site name (e.g. "Writing").
 * @param description - Feed description.
 * @param path - Section path relative to the site root (e.g. "/writing").
 */
export function createRssFeed({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Feed {
  return new Feed({
    title: `${SITE_CONFIG.name} - ${title}`,
    description,
    id: `${SITE_CONFIG.url}${path}`,
    link: `${SITE_CONFIG.url}${path}`,
    language: "en",
    image: `${SITE_CONFIG.url}/api/og`,
    favicon: `${SITE_CONFIG.url}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${SITE_CONFIG.author.name}`,
    updated: new Date(),
    feedLinks: {
      rss: `${SITE_CONFIG.url}${path}/rss.xml`,
    },
    author: RSS_AUTHOR,
  });
}

/**
 * Add an item to the feed, defaulting the author to the site author.
 */
export function addRssItem(feed: Feed, item: Omit<Item, "author">): void {
  feed.addItem({ ...item, author: [RSS_AUTHOR] });
}

/**
 * Serialize a feed into an RSS 2.0 `Response` with the standard headers.
 */
export function rssResponse(feed: Feed): Response {
  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": RSS_CACHE_CONTROL,
    },
  });
}

/**
 * Log the error and return the standard RSS error `Response`.
 */
export function rssErrorResponse(label: string, error: unknown): Response {
  console.error(`Error generating ${label} RSS feed:`, error);
  return new Response("Error generating RSS feed", { status: 500 });
}
