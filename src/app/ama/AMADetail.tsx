import Image from "next/image";

import { renderBlocks } from "@/components/renderBlocks";
import { FancySeparator } from "@/components/ui/FancySeparator";
import { NotionAmaItemWithContent } from "@/lib/notion";

interface AMADetailProps {
  question: NotionAmaItemWithContent;
}

export default function AMADetail({ question }: AMADetailProps) {
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
