/**
 * Remove seed data from the database.
 *
 * Usage:
 *   bun scripts/clean-seed-data.ts
 */
import { eq, inArray, like } from "drizzle-orm";

import { db } from "@/db/client";
import { amaQuestions } from "@/db/schema/ama";
import { appDissectionDetails, appDissections } from "@/db/schema/app-dissection";
import { designDetailsEpisodes } from "@/db/schema/design-details";
import { goodWebsites } from "@/db/schema/good-websites";
import { listeningHistory } from "@/db/schema/listening";
import { speakingEvents } from "@/db/schema/speaking";
import { stackItems } from "@/db/schema/stack";
import { tilEntries } from "@/db/schema/til";
import { writingPosts } from "@/db/schema/writing";

async function clean(name: string, table: Parameters<typeof db.delete>[0], column: any) {
  const result = await db.delete(table).where(like(column, "seed-%")).returning();
  console.log(`${name}: deleted ${result.length} rows`);
}

async function main() {
  console.log("Cleaning seed data...\n");

  // app_dissection_details references app_dissections, delete children first
  const seedApps = await db
    .select({ id: appDissections.id })
    .from(appDissections)
    .where(like(appDissections.notionId, "seed-%"));

  if (seedApps.length > 0) {
    const ids = seedApps.map((r) => r.id);
    const result = await db
      .delete(appDissectionDetails)
      .where(inArray(appDissectionDetails.appDissectionId, ids))
      .returning();
    console.log(`app_dissection_details: deleted ${result.length} rows`);
  }

  await clean("app_dissections", appDissections, appDissections.notionId);
  await clean("writing_posts", writingPosts, writingPosts.notionId);
  await clean("til_entries", tilEntries, tilEntries.notionId);
  await clean("ama_questions", amaQuestions, amaQuestions.notionId);
  await clean("design_details_episodes", designDetailsEpisodes, designDetailsEpisodes.notionId);
  await clean("good_websites", goodWebsites, goodWebsites.notionId);
  await clean("listening_history", listeningHistory, listeningHistory.notionId);
  await clean("speaking_events", speakingEvents, speakingEvents.notionId);
  await clean("stack_items", stackItems, stackItems.notionId);

  console.log("\nDone.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Clean failed:", err);
  process.exit(1);
});
