import { desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "../client";
import { writingPosts } from "../schema/writing";

export type WritingPost = {
  id: string;
  title: string;
  slug: string;
  shortId: string | null;
  excerpt: string | null;
  featureImage: string | null;
  publishedAt: string;
  notionId: string | null;
};

export type WritingPostWithContent = WritingPost & {
  content: string;
};

export async function getWritingPosts(
  cursor?: string,
  limit: number = 20,
): Promise<{ items: WritingPost[]; nextCursor: string | null }> {
  "use cache";
  cacheLife("hours");
  cacheTag("writing");

  const offset = cursor ? parseInt(cursor, 10) : 0;

  const rows = await db
    .select({
      id: writingPosts.id,
      title: writingPosts.title,
      slug: writingPosts.slug,
      shortId: writingPosts.shortId,
      excerpt: writingPosts.excerpt,
      featureImage: writingPosts.featureImage,
      publishedAt: writingPosts.publishedAt,
      notionId: writingPosts.notionId,
    })
    .from(writingPosts)
    .orderBy(desc(writingPosts.publishedAt))
    .limit(limit)
    .offset(offset);

  const items: WritingPost[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortId: row.shortId,
    excerpt: row.excerpt,
    featureImage: row.featureImage,
    publishedAt: row.publishedAt?.toISOString() ?? "",
    notionId: row.notionId,
  }));

  const nextCursor = items.length === limit ? String(offset + limit) : null;
  return { items, nextCursor };
}

export async function getWritingPostBySlug(slug: string): Promise<WritingPostWithContent | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("writing");

  const [row] = await db.select().from(writingPosts).where(eq(writingPosts.slug, slug)).limit(1);

  if (!row) return null;
  return mapRowToPostWithContent(row);
}

export async function getWritingPostByShortId(
  shortId: string,
): Promise<WritingPostWithContent | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("writing");

  const [row] = await db
    .select()
    .from(writingPosts)
    .where(eq(writingPosts.shortId, shortId))
    .limit(1);

  if (!row) return null;
  return mapRowToPostWithContent(row);
}

export async function getWritingPostById(id: string): Promise<WritingPostWithContent | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("writing");

  const [row] = await db.select().from(writingPosts).where(eq(writingPosts.id, id)).limit(1);

  if (!row) return null;
  return mapRowToPostWithContent(row);
}

export async function getWritingPostByNotionId(
  notionId: string,
): Promise<WritingPostWithContent | null> {
  const [row] = await db
    .select()
    .from(writingPosts)
    .where(eq(writingPosts.notionId, notionId))
    .limit(1);

  if (!row) return null;
  return mapRowToPostWithContent(row);
}

export async function updateWritingPostShortId(id: string, shortId: string): Promise<void> {
  await db
    .update(writingPosts)
    .set({ shortId, updatedAt: new Date() })
    .where(eq(writingPosts.id, id));
}

export async function getAllWritingPostSlugs(): Promise<
  { slug: string; shortId: string | null; title: string }[]
> {
  "use cache";
  cacheLife("hours");
  cacheTag("writing");

  const rows = await db
    .select({
      slug: writingPosts.slug,
      shortId: writingPosts.shortId,
      title: writingPosts.title,
    })
    .from(writingPosts)
    .orderBy(desc(writingPosts.publishedAt));

  return rows;
}

function mapRowToPostWithContent(row: typeof writingPosts.$inferSelect): WritingPostWithContent {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortId: row.shortId,
    excerpt: row.excerpt,
    content: row.content ?? "",
    featureImage: row.featureImage,
    publishedAt: row.publishedAt?.toISOString() ?? "",
    notionId: row.notionId,
  };
}
