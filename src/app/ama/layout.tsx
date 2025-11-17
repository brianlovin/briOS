"use client";

import React from "react";

import { ListDetailLayout } from "@/components/ListDetailLayout";
import { useAmaQuestions } from "@/lib/ama";

import { AMAQuestionsProvider } from "./AMAContext";
import { AmaList } from "./AMAList";
import { AskQuestionDialog } from "./AskQuestionDialog";

export default function AMALayout({ children }: { children: React.ReactNode }) {
  // Fetch questions at layout level to share with children
  const {
    items: questions,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    isError,
    size,
    setSize,
  } = useAmaQuestions();

  return (
    <AMAQuestionsProvider
      questions={questions}
      isLoading={isLoading ?? false}
      isLoadingMore={isLoadingMore ?? false}
      isReachingEnd={isReachingEnd ?? false}
      isError={isError}
      size={size}
      setSize={setSize}
    >
      <ListDetailLayout
        headerChildren={<AskQuestionDialog />}
        title="AMA"
        backHref="/ama"
        list={<AmaList />}
      >
        {children}
      </ListDetailLayout>
    </AMAQuestionsProvider>
  );
}
