import type { Metadata } from "next";
import { Suspense } from "react";

import { Section } from "@/components/shared/ListComponents";
import { PageTitle } from "@/components/Typography";
import { WritingPostsList } from "@/components/writing/WritingPostsList";
import { WritingPostsListSkeleton } from "@/components/writing/WritingPostsListSkeleton";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Writing",
  description:
    "Thoughts on design, engineering, and building products. Essays and reflections from Brian Lovin.",
  path: "/writing",
});

export default function WritingPage() {
  return (
    <div data-scrollable className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-xl flex-1 flex-col gap-16 py-16 leading-[1.6]">
        <Section>
          <PageTitle>Writing</PageTitle>
        </Section>
        <Suspense fallback={<WritingPostsListSkeleton />}>
          <WritingPostsList />
        </Suspense>
      </div>
    </div>
  );
}
