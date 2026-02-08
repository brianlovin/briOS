import { getStackItems } from "@/db/queries/stack";

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
  previewImageDark?: string;
  previewStatus?: "Queued" | "Processing" | "Done" | "Error";
};

export async function getStacks(): Promise<StackItem[]> {
  const items = await getStackItems();
  return items as StackItem[];
}

export async function getStackBySlug(slug: string): Promise<StackItem | undefined> {
  const items = await getStackItems();
  return items.find((item) => item.slug === slug);
}
