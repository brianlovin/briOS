import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

import { renderBlocks } from "@/components/renderBlocks";
import { FancySeparator } from "@/components/ui/FancySeparator";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createMetadata, truncateDescription } from "@/lib/metadata";
import { getAmaDatabaseItems, getAmaItemContent } from "@/lib/notion";

export async function generateStaticParams() {
  // Generate static params for the first 30 AMA questions
  const { items } = await getAmaDatabaseItems(undefined, 30);

  return items.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  try {
    const item = await getAmaItemContent(id);

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

async function AMADetailContent({ id }: { id: string }) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.amaQuestions);

  const question = await getAmaItemContent(id);

  if (!question) {
    notFound();
  }

  const answeredAt = question.answeredAt
    ? new Date(question.answeredAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : undefined;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-primary text-3xl font-semibold xl:text-4xl">{question.title}</h1>
        {question.description && <span className="text-secondary">{question.description}</span>}
        {question.answeredAt && (
          <span className="text-quaternary mt-4 text-sm">Asked {answeredAt}</span>
        )}
      </div>

      <FancySeparator />

      <div className="flex items-start gap-4">
        <Image
          src="/img/avatar.jpg"
          alt="Avatar"
          width={32}
          height={32}
          className="min-h-8 min-w-8 rounded-full"
        />
        <div className="flex flex-col gap-6">{renderBlocks(question.blocks)}</div>
      </div>
    </div>
  );
}

export default async function AMADetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <AMADetailContent id={params.id} />;
}
