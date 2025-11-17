"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Textarea";

export function AskQuestionDialog() {
  const [question, setQuestion] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

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
      setQuestion("");
      setDetails("");
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto" variant="primary">
          Ask a question
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Ask me anything</DialogTitle>
            <DialogDescription className="invisible">
              Ask me anything! I&apos;ll answer it as soon as I can.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 pb-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="question" className="text-primary text-sm font-medium">
                Question
              </label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Should designers vibe?"
                className="bg-elevated resize-none rounded-xl text-[15px]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="details" className="text-primary text-sm font-medium">
                More detail <span className="text-tertiary font-normal">(optional)</span>
              </label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Any additional context or details..."
                className="bg-elevated resize-none rounded-xl text-[15px]"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting || !question.trim()}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
