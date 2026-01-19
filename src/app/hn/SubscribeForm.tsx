"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";

import { hnSubscribedAtom } from "@/atoms/hnSubscription";
import { ArrowUp } from "@/components/icons/ArrowUp";
import { Checkmark } from "@/components/icons/Checkmark";
import { Input } from "@/components/ui/Input";

interface SubscribeFormProps {
  onComplete?: () => void;
  className?: string;
  placeholder: string;
}

export function SubscribeForm({ onComplete, className, placeholder }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const setHnSubscribed = useSetAtom(hnSubscribedAtom);

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

      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const isEligible = email.trim() && !submitting && !success;

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <label htmlFor="email" className="text-primary sr-only text-sm font-medium">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="bg-elevated rounded-full pr-12 pb-2.5 pl-4"
            required
          />
          <button
            type="submit"
            disabled={submitting || !email.trim() || success}
            className={`absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition-colors ${
              success
                ? "bg-green-500 text-white"
                : isEligible
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-black/10 text-white dark:bg-white/10 dark:text-neutral-500"
            }`}
          >
            {success ? (
              <Checkmark size={24} strokeWidth={2.5} />
            ) : (
              <ArrowUp size={16} strokeWidth={3} />
            )}
          </button>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}
      </div>
    </form>
  );
}
