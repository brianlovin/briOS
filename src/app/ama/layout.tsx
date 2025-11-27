"use client";

import React from "react";

import { ListDetailLayout } from "@/components/ListDetailLayout";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { useAmaQuestions } from "@/lib/ama";

import { AMAQuestionsProvider } from "./AMAContext";
import { AmaList } from "./AMAList";

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
      <ListDetailWrapper>
        <ListDetailLayout backHref="/ama" list={<AmaList />}>
          {children}
        </ListDetailLayout>
      </ListDetailWrapper>
    </AMAQuestionsProvider>
  );
}
