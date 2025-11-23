import type { Metadata } from "next";

import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import AMADetail from "@/app/ama/AMADetail";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createMetadata, truncateDescription } from "@/lib/metadata";
import { getAmaDatabaseItems, getAmaItemContent } from "@/lib/notion";

async function getAmaQuestionCached(id: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.amaQuestions);

  return await getAmaItemContent(id);
}

export async function generateStaticParams() {
  // Return at least one result for build-time validation with Cache Components
  // Fetch the first question to use as a static param
  try {
    const { items } = await getAmaDatabaseItems(undefined, 1);
    if (items.length > 0) {
      return [{ id: items[0].id }];
    }
  } catch (error) {
    console.error("Error fetching AMA items for generateStaticParams:", error);
  }
  // Fallback to empty array if fetch fails
  return [{ id: "" }];
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  try {
    const item = await getAmaQuestionCached(id);

    if (!item) {
      return {
        title: "AMA Question Not Found",
      };
    }

    const description = item.description || `Question answered by Brian Lovin`;

    return createMetadata({
      title: item.title,
      description: truncateDescription(description),
      path: `/ama/${id}`,
    });
  } catch {
    return {
      title: "AMA Question",
    };
  }
}

export default async function AMADetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const question = await getAmaQuestionCached(params.id);

  if (!question) {
    notFound();
  }

  return <AMADetail question={question} />;
}
