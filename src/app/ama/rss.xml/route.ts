import { Feed } from "feed";

import { getAmaQuestions } from "@/lib/ama";
import { SITE_CONFIG } from "@/lib/metadata";

export async function GET() {
  try {
    const feed = new Feed({
      title: `${SITE_CONFIG.name} - AMA`,
      description: "Ask Me Anything - Questions and answers",
      id: `${SITE_CONFIG.url}/ama`,
      link: `${SITE_CONFIG.url}/ama`,
      language: "en",
      image: `${SITE_CONFIG.url}/api/og`,
      favicon: `${SITE_CONFIG.url}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, ${SITE_CONFIG.author.name}`,
      updated: new Date(),
      feedLinks: {
        rss: `${SITE_CONFIG.url}/ama/rss.xml`,
      },
      author: {
        name: SITE_CONFIG.author.name,
        link: SITE_CONFIG.url,
      },
    });

    const questions = await getAmaQuestions();

    questions.forEach((question) => {
      const questionUrl = `${SITE_CONFIG.url}/ama/${question.id}`;
      const publishDate = new Date(question.answeredAt);

      feed.addItem({
        title: question.title,
        id: question.id,
        link: questionUrl,
        description: question.description || `AMA: ${question.title}`,
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
    console.error("Error generating AMA RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
