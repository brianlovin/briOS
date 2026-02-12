import { getListeningHistoryItems } from "@/db/queries/listening";

export type MusicItem = {
  id: string;
  name: string;
  artist: string;
  album: string;
  url?: string;
  playedAt: string;
  image?: string;
};

export async function getMusic(): Promise<MusicItem[]> {
  const { items } = await getListeningHistoryItems();
  return items as MusicItem[];
}
