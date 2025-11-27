"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isDetailView = pathname !== "/ama";

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
        <ListDetailLayout
          backHref="/ama"
          list={
            <div>
              {/* Mobile: always visible */}
              <div
                className={cn("flex flex-col gap-3 px-3 py-3 md:hidden", {
                  "border-b border-black/10 bg-linear-to-t from-neutral-50 to-white dark:border-white/10 dark:from-neutral-950 dark:to-black":
                    showForm,
                })}
              >
                <Button onClick={() => setShowForm(!showForm)} variant="secondary" fullWidth>
                  Ask a question
                </Button>

                <AnimatePresence>
                  {showForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden p-1"
                    >
                      <AskQuestionForm onComplete={() => setShowForm(false)} autoFocus />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop: animate in when viewing a question */}
              <AnimatePresence>
                {isDetailView && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cn(
                        "hidden flex-col gap-3 overflow-hidden px-3 py-3 md:flex",
                        showForm && "border-b border-black/10 dark:border-white/10",
                      )}
                    >
                      <Button onClick={() => setShowForm(!showForm)} variant="secondary" fullWidth>
                        Ask a question
                      </Button>

                      <AnimatePresence>
                        {showForm && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden p-1"
                          >
                            <AskQuestionForm onComplete={() => setShowForm(false)} autoFocus />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
