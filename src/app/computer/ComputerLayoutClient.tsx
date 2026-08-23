"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";

import { ListDetailLayout } from "@/components/ListDetailLayout";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { Button } from "@/components/ui";
import { COMPUTER_INTRO, COMPUTER_TITLE, type ComputerTip } from "@/lib/computer";
import { useComputerTips } from "@/lib/hooks/useComputer";
import { cn } from "@/lib/utils";

import { ComputerTipsProvider } from "./ComputerContext";
import { ComputerList } from "./ComputerList";
import { SuggestTipForm } from "./SuggestTipForm";

export function ComputerLayoutClient({
  children,
  initialTips,
}: {
  children: React.ReactNode;
  initialTips?: ComputerTip[];
}) {
  const [showForm, setShowForm] = useState(false);
  const { tips, isLoading, isError } = useComputerTips(initialTips);

  return (
    <ComputerTipsProvider tips={tips} isLoading={isLoading ?? false} isError={isError}>
      <ListDetailWrapper>
        <ListDetailLayout
          backHref="/computer"
          list={
            <div className="flex h-full flex-1 flex-col">
              <div className={cn("flex flex-col gap-3 px-3 py-3 md:pb-0")}>
                <div className="flex flex-col gap-2 px-0.5">
                  <h1 className="text-primary text-lg font-semibold">{COMPUTER_TITLE}</h1>
                  <p className="text-tertiary text-sm leading-relaxed">{COMPUTER_INTRO}</p>
                </div>

                <Button onClick={() => setShowForm(!showForm)} variant="secondary" fullWidth>
                  Suggest a tip
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
                        <SuggestTipForm onComplete={() => setShowForm(false)} autoFocus />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ComputerList />
            </div>
          }
        >
          {children}
        </ListDetailLayout>
      </ListDetailWrapper>
    </ComputerTipsProvider>
  );
}
