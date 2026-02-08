import { desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "../client";
import { tilEntries } from "../schema/til";

export type TilEntry = {
  id: string;
  title: string;
  shortId: string | null;
  publishedAt: string;
};

export type TilEntryWithContent = TilEntry & {
  content: string;
};

export async function getTilEntries(
  cursor?: string,
  limit: number = 20,
): Promise<{ items: TilEntry[]; nextCursor: string | null }> {
  "use cache";
  cacheLife("hours");
  cacheTag("til");

  const offset = cursor ? parseInt(cursor, 10) : 0;

  const rows = await db
    .select({
      id: tilEntries.id,
      title: tilEntries.title,
      shortId: tilEntries.shortId,
      publishedAt: tilEntries.publishedAt,
    })
    .from(tilEntries)
    .orderBy(desc(tilEntries.publishedAt))
    .limit(limit)
    .offset(offset);

  const items: TilEntry[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    shortId: row.shortId,
    publishedAt: row.publishedAt?.toISOString() ?? "",
  }));

  const nextCursor = items.length === limit ? String(offset + limit) : null;
  return { items, nextCursor };
}

export async function getTilEntryByShortId(shortId: string): Promise<TilEntryWithContent | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("til");

  const [row] = await db.select().from(tilEntries).where(eq(tilEntries.shortId, shortId)).limit(1);

  if (!row) return null;
  return mapRowToEntryWithContent(row);
}

export async function getTilEntryById(id: string): Promise<TilEntryWithContent | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("til");

  const [row] = await db.select().from(tilEntries).where(eq(tilEntries.id, id)).limit(1);

  if (!row) return null;
  return mapRowToEntryWithContent(row);
}

export async function getTilEntriesWithContent(
  cursor?: string,
  limit: number = 20,
): Promise<{ items: TilEntryWithContent[]; nextCursor: string | null }> {
  "use cache";
  cacheLife("hours");
  cacheTag("til");

  const offset = cursor ? parseInt(cursor, 10) : 0;

  const rows = await db
    .select()
    .from(tilEntries)
    .orderBy(desc(tilEntries.publishedAt))
    .limit(limit)
    .offset(offset);

  const items: TilEntryWithContent[] = rows.map(mapRowToEntryWithContent);

  const nextCursor = items.length === limit ? String(offset + limit) : null;
  return { items, nextCursor };
}

export async function getAllTilSlugs(): Promise<{ shortId: string | null; title: string }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("til");

  const rows = await db
    .select({
      shortId: tilEntries.shortId,
      title: tilEntries.title,
    })
    .from(tilEntries)
    .orderBy(desc(tilEntries.publishedAt));

  return rows;
}

function mapRowToEntryWithContent(row: typeof tilEntries.$inferSelect): TilEntryWithContent {
  return {
    id: row.id,
    title: row.title,
    shortId: row.shortId,
    content: row.content ?? "",
    publishedAt: row.publishedAt?.toISOString() ?? "",
  };
}
