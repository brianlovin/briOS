import { cacheLife, cacheTag } from "next/cache";
import React from "react";

import { ListDetailLayout } from "@/components/ListDetailLayout";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getAmaDatabaseItems } from "@/lib/notion";

import { AmaList } from "./AMAList";
import { AskQuestionDialog } from "./AskQuestionDialog";

async function getInitialAmaQuestions() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.amaQuestions);

  const { items, nextCursor } = await getAmaDatabaseItems(undefined, 20);
  return { items, nextCursor };
}

export default async function AMALayout({ children }: { children: React.ReactNode }) {
  const { items: initialQuestions, nextCursor } = await getInitialAmaQuestions();

  return (
    <ListDetailLayout
      headerChildren={<AskQuestionDialog />}
      title="AMA"
      backHref="/ama"
      list={<AmaList initialQuestions={initialQuestions} initialCursor={nextCursor} />}
    >
      {children}
    </ListDetailLayout>
  );
}
