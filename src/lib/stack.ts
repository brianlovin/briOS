import { getStackDatabaseItems } from "@/lib/notion";

export type StackItem = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  url?: string;
  platforms?: string[];
  status?: string;
  createdTime: string;
  previewImage?: string;
  previewStatus?: "Queued" | "Processing" | "Done" | "Error";
};

export async function getStacks(): Promise<StackItem[]> {
  const items = await getStackDatabaseItems();
  return items as StackItem[];
}

export async function getStackBySlug(slug: string): Promise<StackItem | undefined> {
  const items = await getStackDatabaseItems();
  return items.find((item) => item.slug === slug);
}
