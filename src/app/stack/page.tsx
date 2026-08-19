import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { StackPageClient } from "@/components/stack/StackPageClient";
import { createMetadata, SITE_CONFIG } from "@/lib/metadata";
import { isPlaceholderNotionBuild } from "@/lib/notion";
import { getStacks } from "@/lib/stack";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Stack",
    description:
      "Apps, tools, and services I use every day. My personal stack of productivity tools and software.",
    path: "/stack",
  }),
  alternates: {
    types: {
      "application/rss+xml": `${SITE_CONFIG.url}/stack/rss.xml`,
    },
  },
};

export default function StackPage() {
  return <StackContent />;
}

async function StackContent() {
  "use cache";
  cacheLife("days");
  cacheTag("notion:stack");
  const allStacks = isPlaceholderNotionBuild() ? [] : await getStacks();

  return <StackPageClient initialData={allStacks} />;
}
