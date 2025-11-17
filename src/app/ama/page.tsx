import type { Metadata } from "next";

import { SpeechBubble } from "@/components/icons/SpeechBubble";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "AMA",
  description:
    "Ask me anything about design, engineering, startups, or life. I'll do my best to answer your questions.",
  path: "/ama",
});

export default function AMAPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <SpeechBubble size={100} className="opacity-10" />
    </div>
  );
}
