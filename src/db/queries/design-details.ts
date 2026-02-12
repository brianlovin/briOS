import { desc, eq, or } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "../client";
import { designDetailsEpisodes } from "../schema/design-details";

export type DesignDetailsEpisode = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  episodeNumber: number | null;
  publishedAt: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  notionId: string | null;
};

export type DesignDetailsEpisodeWithContent = DesignDetailsEpisode & {
  content: string;
};

export async function getDesignDetailsEpisodes(): Promise<DesignDetailsEpisode[]> {
  "use cache";
  cacheLife("days");
  cacheTag("design-details");

  const rows = await db
    .select({
      id: designDetailsEpisodes.id,
      name: designDetailsEpisodes.name,
      slug: designDetailsEpisodes.slug,
      description: designDetailsEpisodes.description,
      episodeNumber: designDetailsEpisodes.episodeNumber,
      publishedAt: designDetailsEpisodes.publishedAt,
      imageUrl: designDetailsEpisodes.imageUrl,
      audioUrl: designDetailsEpisodes.audioUrl,
      notionId: designDetailsEpisodes.notionId,
    })
    .from(designDetailsEpisodes)
    .orderBy(desc(designDetailsEpisodes.episodeNumber));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    episodeNumber: row.episodeNumber,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    imageUrl: row.imageUrl,
    audioUrl: row.audioUrl,
    notionId: row.notionId,
  }));
}

// Paginated list for the API, shape matches the client-side hook type
export async function getDesignDetailsEpisodesPaginated(
  cursor?: string,
  limit: number = 20,
): Promise<{
  items: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    episodeNumber?: number;
    publishedDate?: string;
    imageUrl?: string;
    audioUrl?: string;
  }[];
  nextCursor: string | null;
}> {
  "use cache";
  cacheLife("days");
  cacheTag("design-details");

  const offset = cursor ? parseInt(cursor, 10) : 0;

  const rows = await db
    .select()
    .from(designDetailsEpisodes)
    .orderBy(desc(designDetailsEpisodes.episodeNumber))
    .limit(limit)
    .offset(offset);

  const items = rows.map((row) => ({
    id: row.id,
    title: row.name,
    slug: row.slug ?? "",
    description: row.description ?? undefined,
    episodeNumber: row.episodeNumber ?? undefined,
    publishedDate: row.publishedAt?.toISOString() ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    audioUrl: row.audioUrl ?? undefined,
  }));

  const nextCursor = items.length === limit ? String(offset + limit) : null;
  return { items, nextCursor };
}

export async function getDesignDetailsEpisodeById(
  id: string,
): Promise<DesignDetailsEpisodeWithContent | null> {
  "use cache";
  cacheLife("days");
  cacheTag("design-details");

  // Try UUID first, fall back to notionId for backwards-compatible URLs
  const [row] = await db
    .select()
    .from(designDetailsEpisodes)
    .where(or(eq(designDetailsEpisodes.id, id), eq(designDetailsEpisodes.notionId, id)))
    .limit(1);

  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    episodeNumber: row.episodeNumber,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    imageUrl: row.imageUrl,
    audioUrl: row.audioUrl,
    content: row.content ?? "",
    notionId: row.notionId,
  };
}
