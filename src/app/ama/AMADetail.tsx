"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { renderBlocks } from "@/components/renderBlocks";
import { FancySeparator } from "@/components/ui/FancySeparator";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAmaQuestion } from "@/lib/hooks/useAma";

export default function AMADetail() {
  const { id } = useParams();

  // Fetch the full question with content blocks from the API
  const { question, isLoading, isError } = useAmaQuestion(id as string);

  // Update document title when question is available
  useEffect(() => {
    if (question?.title) {
      document.title = `${question.title} | Brian Lovin`;
    }
  }, [question?.title]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!question || isError) {
    return <p>Question not found</p>;
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
