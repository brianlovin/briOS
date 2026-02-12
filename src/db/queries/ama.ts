import { desc, eq, or } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "../client";
import { amaQuestions } from "../schema/ama";

export type AmaQuestion = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  answeredAt: string;
  createdAt: string;
};

export type AmaQuestionWithAnswer = AmaQuestion & {
  answer: string | null;
};

export async function getAmaQuestions(
  cursor?: string,
  limit: number = 20,
): Promise<{ items: AmaQuestion[]; nextCursor: string | null }> {
  "use cache";
  cacheLife("hours");
  cacheTag("ama");

  const offset = cursor ? parseInt(cursor, 10) : 0;

  const rows = await db
    .select({
      id: amaQuestions.id,
      title: amaQuestions.title,
      description: amaQuestions.description,
      status: amaQuestions.status,
      answeredAt: amaQuestions.answeredAt,
      createdAt: amaQuestions.createdAt,
    })
    .from(amaQuestions)
    .where(eq(amaQuestions.status, "Answered"))
    .orderBy(desc(amaQuestions.answeredAt))
    .limit(limit)
    .offset(offset);

  const items: AmaQuestion[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status ?? "Unanswered",
    answeredAt: row.answeredAt?.toISOString() ?? "",
    createdAt: row.createdAt.toISOString(),
  }));

  const nextCursor = items.length === limit ? String(offset + limit) : null;
  return { items, nextCursor };
}

export async function getAmaQuestionById(id: string): Promise<AmaQuestionWithAnswer | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("ama");

  // Try UUID first, fall back to notionId for backwards-compatible URLs
  const [row] = isUuid(id)
    ? await db
        .select()
        .from(amaQuestions)
        .where(or(eq(amaQuestions.id, id), eq(amaQuestions.notionId, id)))
        .limit(1)
    : await db.select().from(amaQuestions).where(eq(amaQuestions.notionId, id)).limit(1);

  if (!row) return null;
  return mapRowToQuestionWithAnswer(row);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function createAmaQuestion(
  title: string,
  description?: string,
): Promise<{ id: string }> {
  const [row] = await db
    .insert(amaQuestions)
    .values({
      title,
      description: description ?? null,
      status: "Unanswered",
    })
    .returning({ id: amaQuestions.id });

  return row;
}

export async function getAllAmaIds(): Promise<{ id: string }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("ama");

  const rows = await db
    .select({ id: amaQuestions.id })
    .from(amaQuestions)
    .where(eq(amaQuestions.status, "Answered"))
    .orderBy(desc(amaQuestions.answeredAt));

  return rows;
}

function mapRowToQuestionWithAnswer(row: typeof amaQuestions.$inferSelect): AmaQuestionWithAnswer {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status ?? "Unanswered",
    answer: row.answer,
    answeredAt: row.answeredAt?.toISOString() ?? "",
    createdAt: row.createdAt.toISOString(),
  };
}
