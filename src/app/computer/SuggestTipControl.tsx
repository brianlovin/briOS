"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui";

import { SuggestTipForm } from "./SuggestTipForm";

export function SuggestTipControl() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="self-start">
        <Button onClick={() => setShowForm(!showForm)} variant="secondary">
          Suggest a tip
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            className="overflow-hidden"
          >
            <SuggestTipForm onComplete={() => setShowForm(false)} autoFocus />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
