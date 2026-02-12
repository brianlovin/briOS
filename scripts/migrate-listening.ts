/**
 * Migration script: Listening history from Notion → Postgres
 *
 * Usage: bun scripts/migrate-listening.ts
 */
import { db } from "@/db/client";
import { listeningHistory } from "@/db/schema/listening";

import { hasProperties, notion, type PageObjectResponse } from "./lib/notion";

async function getDataSourceId(databaseId: string): Promise<string> {
  const database = await notion.databases.retrieve({ database_id: databaseId });
  const ds = (database as { data_sources: { id: string }[] }).data_sources[0];
  if (!ds) throw new Error(`No data source found for database ${databaseId}`);
  return ds.id;
}

async function main() {
  console.log("Fetching listening history from Notion (with pagination)...");
  const databaseId = process.env.NOTION_MUSIC_DATABASE_ID || "";
  const dataSourceId = await getDataSourceId(databaseId);

  const allRows: (typeof listeningHistory.$inferInsert)[] = [];
  let cursor: string | undefined;
  let page = 0;

  while (true) {
    page++;
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
      sorts: [{ property: "Played At", direction: "descending" }],
    });

    console.log(`  Page ${page}: ${response.results.length} items`);

    for (const result of response.results) {
      if (!hasProperties(result)) continue;
      const p = result as PageObjectResponse;
      const props = p.properties as Record<string, any>;

      allRows.push({
        name: props.Name?.title?.[0]?.plain_text || "Untitled",
        artist: props.Artist?.rich_text?.[0]?.plain_text || null,
        album: props.Album?.rich_text?.[0]?.plain_text || null,
        spotifyUrl: props.URL?.url || null,
        icon: props.Image?.url || null,
        playedAt: props["Played At"]?.date?.start ? new Date(props["Played At"].date.start) : null,
        notionId: p.id,
      });
    }

    if (!response.has_more || !response.next_cursor) break;
    cursor = response.next_cursor as string;
  }

  console.log(`Found ${allRows.length} total listening history items`);

  if (allRows.length === 0) {
    console.log("No items to migrate");
    process.exit(0);
  }

  // Insert in batches of 500
  console.log("Inserting into Postgres...");
  const batchSize = 500;
  let inserted = 0;

  for (let i = 0; i < allRows.length; i += batchSize) {
    const batch = allRows.slice(i, i + batchSize);
    const result = await db
      .insert(listeningHistory)
      .values(batch)
      .onConflictDoNothing({ target: listeningHistory.notionId });

    inserted += result.rowCount ?? 0;
    console.log(`  Batch ${Math.floor(i / batchSize) + 1}: inserted ${result.rowCount} rows`);
  }

  console.log(`Inserted ${inserted} rows (${allRows.length} total, skipped duplicates)`);

  // Verify
  const count = await db.$count(listeningHistory);
  console.log(`Verification: ${count} rows in listening_history table`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
