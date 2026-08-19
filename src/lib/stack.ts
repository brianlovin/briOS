import { getStackDatabaseItems, type NotionStackItem } from "@/lib/notion";

export type StackItem = NotionStackItem;

export type StackFilters = {
  status?: string;
  platform?: string;
};

export async function getStacks(): Promise<StackItem[]> {
  return getStackDatabaseItems();
}

export async function getStackBySlug(slug: string): Promise<StackItem | undefined> {
  const items = await getStackDatabaseItems();
  return items.find((item) => item.slug === slug);
}

export function filterStacks(
  items: StackItem[],
  { status = "active", platform = "" }: StackFilters = {},
): StackItem[] {
  return items.filter((item) => {
    const itemStatus = item.status?.toLowerCase() || "active";
    const statusMatch = status === "all" ? true : itemStatus === status;
    const platformMatch = platform ? item.platforms?.includes(platform) : true;

    return statusMatch && platformMatch;
  });
}

export function stackItemLinks(items: StackItem[]) {
  return items.flatMap((item) =>
    item.url ? [{ id: item.id, title: item.name, href: item.url }] : [],
  );
}
