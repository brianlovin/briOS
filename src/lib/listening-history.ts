import { getListeningHistoryDatabaseItems, type NotionListeningHistoryItem } from "@/lib/notion";

export type MusicItem = NotionListeningHistoryItem;

export async function getMusic(): Promise<MusicItem[]> {
  const { items } = await getListeningHistoryDatabaseItems();
  return items;
}
