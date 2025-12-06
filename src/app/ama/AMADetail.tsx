"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

import { renderBlocks } from "@/components/renderBlocks";
import { PageTitle } from "@/components/Typography";
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

  const createdAt = question.createdAt
    ? new Date(question.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : undefined;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 p-4 md:px-8 md:py-12">
      <div className="flex flex-col gap-6">
        {question.createdAt && <span className="text-tertiary text-lg">Asked {createdAt}</span>}
        <PageTitle>{question.title}</PageTitle>
        {question.description && (
          <span className="text-secondary text-lg">{question.description}</span>
        )}
      </div>

      <FancySeparator />

      <div className="flex flex-col gap-6 text-lg">{renderBlocks(question.blocks)}</div>
    </div>
  );
}
