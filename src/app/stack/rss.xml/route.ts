import { SITE_CONFIG } from "@/lib/metadata";
import { addRssItem, createRssFeed, rssErrorResponse, rssResponse } from "@/lib/rss";
import { getStacks } from "@/lib/stack";

export async function GET() {
  try {
    const feed = createRssFeed({
      title: "Stack",
      description: "Apps, tools, and services I use every day",
      path: "/stack",
    });

    const items = await getStacks();

    items
      .filter((item) => item.status?.toLowerCase() === "active")
      .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
      .forEach((item) => {
        const createdDate = new Date(item.createdTime);

        addRssItem(feed, {
          title: item.name,
          id: item.id,
          link: item.url || `${SITE_CONFIG.url}/stack`,
          description: item.description || `${item.name} - part of my daily stack`,
          date: createdDate,
          published: createdDate,
        });
      });

    return rssResponse(feed);
  } catch (error) {
    return rssErrorResponse("Stack", error);
  }
}
