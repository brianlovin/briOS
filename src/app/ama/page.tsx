import type { Metadata } from "next";

import { createMetadata } from "@/lib/metadata";

import { AMACard } from "./AMACard";

export const metadata: Metadata = createMetadata({
  title: "AMA",
  description:
    "Ask me anything about design, engineering, startups, or life. I'll do my best to answer your questions.",
  path: "/ama",
});

export default function AMAPage() {
  return (
    <div className="bg-secondary dark:bg-primary flex flex-1 items-center justify-center p-4 md:p-6 lg:p-8">
      <AMACard className="bg-elevated max-w-xl shadow-xs" />
    </div>
  );
}
