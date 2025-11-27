"use client";

import { SpeechBubble } from "@/components/icons/SpeechBubble";
import { cn } from "@/lib/utils";

import { AskQuestionForm } from "./AskQuestionForm";

export function AMACard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-tertiary dark:bg-secondary dark:shadow-contrast @container relative w-full overflow-hidden rounded-2xl ring-[0.5px] ring-black/5",
        className,
      )}
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <SpeechBubble size={24} className="text-primary fill-black dark:fill-white" />
            <div className="text-primary font-semibold">Ask me anything</div>
          </div>
        </div>

        <AskQuestionForm className="w-full" />
      </div>
    </div>
  );
}
