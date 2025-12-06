"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";

import { ListDetailLayout } from "@/components/ListDetailLayout";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { Button } from "@/components/ui";
import { useAmaQuestions } from "@/lib/ama";
import { cn } from "@/lib/utils";

import { AMAQuestionsProvider } from "./AMAContext";
import { AmaList } from "./AMAList";
import { AskQuestionForm } from "./AskQuestionForm";

export default function AMALayout({ children }: { children: React.ReactNode }) {
  const [showForm, setShowForm] = useState(false);

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
        <ListDetailLayout
          backHref="/ama"
          list={
            <div className="flex h-full flex-1 flex-col">
              <div className={cn("flex-col px-3 py-3 md:pb-0")}>
                <Button onClick={() => setShowForm(!showForm)} variant="secondary" fullWidth>
                  Ask a question
                </Button>

                <AnimatePresence initial={false}>
                  {showForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.98 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.98 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 px-0.5">
                        <AskQuestionForm onComplete={() => setShowForm(false)} autoFocus />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AmaList />
            </div>
          }
        >
          {children}
        </ListDetailLayout>
      </ListDetailWrapper>
    </AMAQuestionsProvider>
  );
}
