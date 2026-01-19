import type { Metadata } from "next";

import { createMetadata } from "@/lib/metadata";

import { getRandomEmailPlaceholder } from "./constants";
import { HNPageClient } from "./HNPageClient";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Hacker News",
    description: "A minimal, clean interface for reading Hacker News.",
    path: "/hn",
  }),
  alternates: {
    canonical: "https://news.ycombinator.com",
  },
};

export const revalidate = 3600;

export default function HNPage() {
  const emailPlaceholder = getRandomEmailPlaceholder();
  return <HNPageClient emailPlaceholder={emailPlaceholder} />;
}
