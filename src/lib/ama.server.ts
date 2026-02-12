import { cacheLife, cacheTag } from "next/cache";

import { type AmaQuestion, getAmaQuestions as getAmaQuestionsFromDb } from "@/db/queries/ama";

export async function getAmaQuestions(): Promise<AmaQuestion[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("ama");

  const all: AmaQuestion[] = [];
  let cursor: string | undefined;
  do {
    const { items, nextCursor } = await getAmaQuestionsFromDb(cursor);
    all.push(...items);
    cursor = nextCursor ?? undefined;
  } while (cursor);
  return all;
}
