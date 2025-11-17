"use client";

import { useAtom } from "jotai";
import { useState } from "react";

import { hnSubscribedAtom } from "@/atoms/hnSubscription";
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
import { Input } from "@/components/ui/Input";

export function SubscribeDialog() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [, setHnSubscribed] = useAtom(hnSubscribedAtom);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/hn/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to subscribe");
        return;
      }

      setSuccess(true);
      setEmail("");
      setHnSubscribed(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm" className="ml-auto">
          Daily digest email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader>
            <DialogTitle>HN Daily Digest</DialogTitle>
            <DialogDescription>
              Get a simple email every day with the top stories from Hacker News. Unsubscribe at any
              time.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-primary text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-elevated rounded-xl text-[15px]"
                required
              />
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            {success && <div className="text-sm text-green-600">Successfully subscribed!</div>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting || !email.trim() || success}>
              {submitting ? "Subscribing..." : success ? "Subscribed!" : "Subscribe"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
