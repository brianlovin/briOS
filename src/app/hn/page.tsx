import type { Metadata } from "next";

import { SpeechBubble } from "@/components/icons/SpeechBubble";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Hacker News",
  description: "A minimal, clean interface for reading Hacker News.",
  path: "/hn",
});

export default function HNPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <SpeechBubble size={100} className="opacity-10" />
    </div>
  );
}
