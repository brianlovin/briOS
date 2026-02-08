import { Feed } from "feed";

import { getAmaQuestionById } from "@/db/queries/ama";
import { getAmaQuestions } from "@/lib/ama.server";
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

    // Fetch full content for all questions in parallel
    const questionsWithContent = await Promise.all(
      questions.map(async (question) => {
        try {
          const full = await getAmaQuestionById(question.id);
          return { question, answer: full?.answer ?? null };
        } catch {
          return { question, answer: null };
        }
      }),
    );

    questionsWithContent.forEach(({ question, answer }) => {
      const questionUrl = `${SITE_CONFIG.url}/ama/${question.id}`;
      const publishDate = new Date(question.answeredAt);

      // Build description with question details and answer preview
      const descriptionParts: string[] = [];
      if (question.description) {
        descriptionParts.push(question.description);
      }
      if (answer) {
        const preview = answer.slice(0, 500).split("\n\n").slice(0, 3).join("\n\n");
        if (preview) {
          descriptionParts.push("---");
          descriptionParts.push(preview);
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
