import type { Metadata } from "next";

import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "AMA",
  description:
    "Ask me anything about design, engineering, startups, or life. I'll do my best to answer your questions.",
  path: "/ama",
});

export default function AMAPage() {
  return <div className="bg-secondary dark:bg-primary flex flex-1" />;
}
