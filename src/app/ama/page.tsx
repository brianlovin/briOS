import type { Metadata } from "next";

import { createMetadata, SITE_CONFIG } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createMetadata({
    title: "AMA",
    description:
      "Ask me anything about design, engineering, startups, or life. I'll do my best to answer your questions.",
    path: "/ama",
  }),
  alternates: {
    types: {
      "application/rss+xml": `${SITE_CONFIG.url}/ama/rss.xml`,
    },
  },
};

export default function AMAPage() {
  return <div className="bg-secondary dark:bg-primary flex flex-1" />;
}
