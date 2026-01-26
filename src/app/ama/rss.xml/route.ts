import { Feed } from "feed";

import { getAmaQuestions } from "@/lib/ama";
import { SITE_CONFIG } from "@/lib/metadata";
import { getAmaItemContent } from "@/lib/notion/queries";
import { extractPreviewText } from "@/lib/notion/types";

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

    // Fetch content for all questions in parallel (gracefully handle failures)
    const questionsWithContent = await Promise.all(
      questions.map(async (question) => {
        try {
          const content = await getAmaItemContent(question.id);
          return { question, content };
        } catch {
          return { question, content: null };
        }
      }),
    );

    questionsWithContent.forEach(({ question, content }) => {
      const questionUrl = `${SITE_CONFIG.url}/ama/${question.id}`;
      const publishDate = new Date(question.answeredAt);

      // Build description with question details and answer preview
      const descriptionParts: string[] = [];
      if (question.description) {
        descriptionParts.push(question.description);
      }
      if (content?.blocks) {
        const answerPreview = extractPreviewText(content.blocks, { maxBlocks: 3 });
        if (answerPreview) {
          descriptionParts.push("---");
          descriptionParts.push(answerPreview);
        }
      }
      const description = descriptionParts.join("\n\n") || `AMA: ${question.title}`;

      feed.addItem({
        title: question.title,
        id: question.id,
        link: questionUrl,
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
    console.error("Error generating AMA RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
