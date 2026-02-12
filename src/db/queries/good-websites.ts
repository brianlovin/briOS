import { asc, desc, eq } from "drizzle-orm";

import type { GoodWebsiteItem, GoodWebsiteItemWithDate } from "@/lib/goodWebsites";

import { db } from "../client";
import { goodWebsites } from "../schema/good-websites";

export async function getGoodWebsiteItems(): Promise<GoodWebsiteItem[]> {
  const rows = await db.select().from(goodWebsites).orderBy(asc(goodWebsites.name));

  return rows.map(mapRowToItem);
}

export async function getGoodWebsiteItemsForRss(): Promise<GoodWebsiteItemWithDate[]> {
  const rows = await db.select().from(goodWebsites).orderBy(desc(goodWebsites.createdAt));

  return rows.map((row) => ({
    ...mapRowToItem(row),
    createdTime: row.createdAt.toISOString(),
  }));
}

export async function updateGoodWebsiteByNotionId(
  notionId: string,
  data: {
    icon?: string;
    previewImage?: string;
    previewImageDark?: string;
    previewStatus?: string;
  },
) {
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (data.icon !== undefined) updates.icon = data.icon;
  if (data.previewImage !== undefined) updates.previewImage = data.previewImage;
  if (data.previewImageDark !== undefined) updates.previewImageDark = data.previewImageDark;
  if (data.previewStatus !== undefined) updates.previewStatus = data.previewStatus;

  const [row] = await db
    .update(goodWebsites)
    .set(updates)
    .where(eq(goodWebsites.notionId, notionId))
    .returning();

  return row ?? null;
}

export async function getGoodWebsiteByNotionId(notionId: string) {
  const [row] = await db
    .select()
    .from(goodWebsites)
    .where(eq(goodWebsites.notionId, notionId))
    .limit(1);

  return row ?? null;
}

function mapRowToItem(row: typeof goodWebsites.$inferSelect): GoodWebsiteItem {
  return {
    id: row.id,
    name: row.name,
    url: row.url ?? undefined,
    x: row.xUrl ?? undefined,
    icon: row.icon ?? undefined,
    tags: row.tags ?? [],
    previewImage: row.previewImage ?? undefined,
    previewImageDark: row.previewImageDark ?? undefined,
    previewStatus: (row.previewStatus as GoodWebsiteItem["previewStatus"]) ?? undefined,
  };
}
