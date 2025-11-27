"use client";

import { useAtomValue } from "jotai";

import { hnSubscribedAtom } from "@/atoms/hnSubscription";
import { SpeechBubble } from "@/components/icons/SpeechBubble";

import { HNDigestCard } from "./HNDigestCard";

export function HNPageClient() {
  const isSubscribed = useAtomValue(hnSubscribedAtom);

  return (
    <div className="bg-secondary dark:bg-primary flex flex-1 items-center justify-center p-4 md:p-6 lg:p-8">
      {isSubscribed ? (
        <SpeechBubble size={100} className="opacity-10" />
      ) : (
        <HNDigestCard className="bg-elevated max-w-xl shadow-xs" />
      )}
    </div>
  );
}
