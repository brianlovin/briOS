import { desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "../client";
import { speakingEvents } from "../schema/speaking";

export type SpeakingEvent = {
  id: string;
  title: string;
  date: string;
  href?: string;
};

export async function getSpeakingEvents(): Promise<SpeakingEvent[]> {
  "use cache";
  cacheLife("days");
  cacheTag("speaking");

  const rows = await db.select().from(speakingEvents).orderBy(desc(speakingEvents.date));

  return rows.map((row) => ({
    id: row.id,
    title: row.name,
    date: row.date?.toISOString().split("T")[0] ?? "",
    href: row.url ?? undefined,
  }));
}
