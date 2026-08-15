import { getStackDatabaseItems, type NotionStackItem } from "@/lib/notion";

export type StackItem = NotionStackItem;

export async function getStacks(): Promise<StackItem[]> {
  return getStackDatabaseItems();
}

export async function getStackBySlug(slug: string): Promise<StackItem | undefined> {
  const items = await getStackDatabaseItems();
  return items.find((item) => item.slug === slug);
}
