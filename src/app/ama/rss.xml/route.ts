import { getAmaQuestions } from "@/lib/ama";
import { SITE_CONFIG } from "@/lib/metadata";
import { getAmaItemContent } from "@/lib/notion/queries";
import { extractPreviewText } from "@/lib/notion/types";
import { addRssItem, createRssFeed, rssErrorResponse, rssResponse } from "@/lib/rss";

export async function GET() {
  try {
    const feed = createRssFeed({
      title: "AMA",
      description: "Ask Me Anything - Questions and answers",
      path: "/ama",
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

      addRssItem(feed, {
        title: question.title,
        id: question.id,
        link: questionUrl,
        description,
        date: publishDate,
        published: publishDate,
      });
    });

    return rssResponse(feed);
  } catch (error) {
    return rssErrorResponse("AMA", error);
  }
}
