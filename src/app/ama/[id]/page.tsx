import type { Metadata } from "next";

import AMADetail from "@/app/ama/AMADetail";
import { getAmaQuestionById } from "@/db/queries/ama";
import { createMetadata, truncateDescription } from "@/lib/metadata";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  try {
    const question = await getAmaQuestionById(id);

    if (!question) {
      return {
        title: "AMA Question Not Found",
      };
    }

    const description = question.description || `Question answered by Brian Lovin`;

    return createMetadata({
      title: question.title,
      description: truncateDescription(description),
      path: `/ama/${id}`,
    });
  } catch {
    return {
      title: "AMA Question",
    };
  }
}

export default function AMADetailPage() {
  return <AMADetail />;
}
