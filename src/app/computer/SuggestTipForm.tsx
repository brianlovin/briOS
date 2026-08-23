"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface SuggestTipFormProps {
  autoFocus?: boolean;
  className?: string;
  onComplete?: () => void;
}

export function SuggestTipForm({ autoFocus = false, className, onComplete }: SuggestTipFormProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/computer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          details: details.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error || "Failed to submit tip. Please try again.");
        return;
      }

      setSuccess(true);
      setTitle("");
      setDetails("");
      onComplete?.();

      setTimeout(() => {
        setSuccess(false);
        document.getElementById("tip-title")?.focus();
      }, 2000);
    } catch (err) {
      console.error("Error submitting computer tip:", err);
      setError("Failed to submit tip. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-3">
        <Input
          id="tip-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tip title..."
          className="bg-elevated rounded-full pb-2.5 pl-4"
          required
          disabled={submitting}
          autoFocus={autoFocus}
        />

        <Textarea
          id="tip-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Details (optional)..."
          className="bg-elevated min-h-0 resize-none rounded-2xl px-4 py-2.5"
          rows={2}
          disabled={submitting}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center justify-end gap-3">
          <AnimatePresence>
            {success && (
              <motion.p
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-blue-500"
              >
                Thanks! It will show up if published
              </motion.p>
            )}
          </AnimatePresence>
          <Button
            type="submit"
            disabled={submitting || !title.trim() || success}
            variant={success ? "secondary" : "primary"}
          >
            {success ? "Sent" : submitting ? "Sending..." : "Suggest"}
          </Button>
        </div>
      </div>
    </form>
  );
}
