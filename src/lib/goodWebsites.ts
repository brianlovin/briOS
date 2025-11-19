import { getGoodWebsitesDatabaseItems } from "@/lib/notion";

export type GoodWebsiteItem = {
  id: string;
  name: string;
  url?: string;
  x?: string;
  icon?: string;
};

export async function getGoodWebsites(): Promise<GoodWebsiteItem[]> {
  const items = await getGoodWebsitesDatabaseItems();
  return items as GoodWebsiteItem[];
}
