import { getStackDatabaseItems } from "@/lib/notion";

export type StackItem = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  url?: string;
  platforms?: string[];
  status?: string;
};

export async function getStacks(): Promise<StackItem[]> {
  const items = await getStackDatabaseItems();
  return items as StackItem[];
}

export async function getStackBySlug(slug: string): Promise<StackItem | undefined> {
  const items = await getStackDatabaseItems();
  return items.find((item) => item.slug === slug);
}
