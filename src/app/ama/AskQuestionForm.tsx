"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface AskQuestionFormProps {
  autoFocus?: boolean;
  className?: string;
  onComplete?: () => void;
}

export function AskQuestionForm({
  autoFocus = false,
  className,
  onComplete,
}: AskQuestionFormProps) {
  const [question, setQuestion] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!question.trim()) return;

    setSubmitting(true);
    try {
      await fetch("/api/ama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: question,
          description: details.trim() || undefined,
        }),
      });
      setSuccess(true);
      setQuestion("");
      setDetails("");

      onComplete?.();

      setTimeout(() => {
        setSuccess(false);
        document.getElementById("question")?.focus();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-3">
        <Input
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything..."
          className="bg-elevated rounded-full pb-2.5 pl-4"
          required
          disabled={submitting}
          autoFocus={autoFocus}
        />

        <Textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Additional context (optional)..."
          className="bg-elevated min-h-0 resize-none rounded-2xl px-4 py-2.5"
          rows={2}
          disabled={submitting}
        />

        <div className="flex items-center justify-end gap-3">
          <AnimatePresence>
            {success && (
              <motion.p
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-blue-500"
              >
                Thanks! Check back soon
              </motion.p>
            )}
          </AnimatePresence>
          <Button
            type="submit"
            disabled={submitting || !question.trim() || success}
            variant={success ? "secondary" : "primary"}
          >
            {success ? "Sent" : submitting ? "Asking..." : "Ask"}
          </Button>
        </div>
      </div>
    </form>
  );
}
