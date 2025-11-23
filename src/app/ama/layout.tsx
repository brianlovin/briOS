import { cacheLife, cacheTag } from "next/cache";
import React, { Suspense } from "react";

import { AMAPageSkeleton } from "@/components/ama/AMAPageSkeleton";
import { ListDetailLayout } from "@/components/ListDetailLayout";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getAmaDatabaseItems } from "@/lib/notion";

import { AMAListClient } from "./AMAListClient";
import { AskQuestionDialog } from "./AskQuestionDialog";

async function AMAList() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.amaQuestions);

  // Fetch initial page of questions on the server
  const initialPage = await getAmaDatabaseItems(undefined, 20);

  return <AMAListClient initialData={[initialPage]} />;
}

export default function AMALayout({ children }: { children: React.ReactNode }) {
  return (
    <ListDetailLayout
      headerChildren={<AskQuestionDialog />}
      title="AMA"
      backHref="/ama"
      list={
        <Suspense fallback={<AMAPageSkeleton />}>
          <AMAList />
        </Suspense>
      }
    >
      {children}
    </ListDetailLayout>
  );
}
