import { cache } from "react";

import { type AmaQuestion, getAmaQuestions as getAmaQuestionsFromDb } from "@/db/queries/ama";

async function fetchAllAmaQuestions(): Promise<AmaQuestion[]> {
  const all: AmaQuestion[] = [];
  let cursor: string | undefined;
  do {
    const { items, nextCursor } = await getAmaQuestionsFromDb(cursor);
    all.push(...items);
    cursor = nextCursor || undefined;
  } while (cursor);
  return all;
}

export const getAmaQuestions = cache(fetchAllAmaQuestions);
