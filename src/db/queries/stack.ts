import { asc, eq } from "drizzle-orm";

import { db } from "../client";
import { stackItems } from "../schema/stack";

export type StackItem = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  url?: string;
  platforms?: string[];
  status?: string;
  createdTime: string;
  previewImage?: string;
  previewImageDark?: string;
  previewStatus?: "Queued" | "Processing" | "Done" | "Error";
};

export async function getStackItems(): Promise<StackItem[]> {
  const rows = await db.select().from(stackItems).orderBy(asc(stackItems.name));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    image: row.image ?? undefined,
    icon: row.icon ?? undefined,
    url: row.url ?? undefined,
    platforms: row.platforms ?? [],
    status: row.status ?? undefined,
    createdTime: row.createdAt.toISOString(),
    previewImage: row.previewImage ?? undefined,
    previewImageDark: row.previewImageDark ?? undefined,
    previewStatus: (row.previewStatus as StackItem["previewStatus"]) ?? undefined,
  }));
}

export async function getStackItemBySlug(slug: string): Promise<StackItem | null> {
  const [row] = await db.select().from(stackItems).where(eq(stackItems.slug, slug)).limit(1);

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    image: row.image ?? undefined,
    icon: row.icon ?? undefined,
    url: row.url ?? undefined,
    platforms: row.platforms ?? [],
    status: row.status ?? undefined,
    createdTime: row.createdAt.toISOString(),
    previewImage: row.previewImage ?? undefined,
    previewImageDark: row.previewImageDark ?? undefined,
    previewStatus: (row.previewStatus as StackItem["previewStatus"]) ?? undefined,
  };
}

export async function createStackItem(data: {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  url?: string;
  platforms?: string[];
  status?: string;
}) {
  const [row] = await db
    .insert(stackItems)
    .values({
      name: data.name,
      slug: data.slug ?? data.name.toLowerCase().replace(/\s+/g, "-"),
      description: data.description,
      image: data.image,
      icon: data.image,
      url: data.url,
      platforms: data.platforms ?? [],
      status: data.status ?? "Active",
    })
    .returning();

  return row;
}

export async function updateStackItem(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    icon?: string;
    url?: string;
    platforms?: string[];
    status?: string;
  },
) {
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (data.name !== undefined) updates.name = data.name;
  if (data.slug !== undefined) updates.slug = data.slug;
  if (data.description !== undefined) updates.description = data.description;
  if (data.image !== undefined) updates.image = data.image;
  if (data.icon !== undefined) updates.icon = data.icon;
  if (data.url !== undefined) updates.url = data.url;
  if (data.platforms !== undefined) updates.platforms = data.platforms;
  if (data.status !== undefined) updates.status = data.status;

  const [row] = await db.update(stackItems).set(updates).where(eq(stackItems.id, id)).returning();

  return row;
}

export async function updateStackItemByNotionId(notionId: string, data: { icon?: string }) {
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (data.icon !== undefined) updates.icon = data.icon;

  const [row] = await db
    .update(stackItems)
    .set(updates)
    .where(eq(stackItems.notionId, notionId))
    .returning();

  return row;
}

export async function getStackItemByNotionId(notionId: string) {
  const [row] = await db
    .select()
    .from(stackItems)
    .where(eq(stackItems.notionId, notionId))
    .limit(1);

  return row ?? null;
}
