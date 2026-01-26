"use client";

import { useAtomValue } from "jotai";

import { hnSubscribedAtom } from "@/atoms/hnSubscription";
import { SpeechBubble } from "@/components/icons/SpeechBubble";

import { HNCLIUpsell, HNDigestCard } from "./HNDigestCard";

export function HNPageClient() {
  const isSubscribed = useAtomValue(hnSubscribedAtom);

  return (
    <div className="bg-secondary dark:bg-primary flex flex-1 items-center justify-center p-4 md:p-6 lg:p-8">
      {isSubscribed ? (
        <SpeechBubble size={100} className="opacity-10" />
      ) : (
        <div className="flex w-full max-w-xl flex-col gap-4">
          <HNDigestCard className="bg-elevated shadow-xs" />
          <HNCLIUpsell />
        </div>
      )}
    </div>
  );
}
