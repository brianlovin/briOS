/**
 * Migration script: Speaking events from Notion → Postgres
 *
 * Usage: bun scripts/migrate-speaking.ts
 */
import { db } from "@/db/client";
import { speakingEvents } from "@/db/schema/speaking";

import { hasProperties, notion, type PageObjectResponse } from "./lib/notion";

async function getDataSourceId(databaseId: string): Promise<string> {
  const database = await notion.databases.retrieve({ database_id: databaseId });
  const ds = (database as { data_sources: { id: string }[] }).data_sources[0];
  if (!ds) throw new Error(`No data source found for database ${databaseId}`);
  return ds.id;
}

async function main() {
  console.log("Fetching speaking items from Notion (with pagination)...");
  const databaseId = process.env.NOTION_SPEAKING_DATABASE_ID || "";
  const dataSourceId = await getDataSourceId(databaseId);

  const allRows: (typeof speakingEvents.$inferInsert)[] = [];
  let cursor: string | undefined;
  let page = 0;

  while (true) {
    page++;
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
      sorts: [{ property: "Date", direction: "descending" }],
    });

    console.log(`  Page ${page}: ${response.results.length} items`);

    for (const result of response.results) {
      if (!hasProperties(result)) continue;
      const p = result as PageObjectResponse;
      const props = p.properties as Record<string, any>;

      allRows.push({
        name: props.Name?.title?.[0]?.plain_text || "Untitled",
        date: props.Date?.date?.start ? new Date(props.Date.date.start) : null,
        url: props.URL?.url || null,
        notionId: p.id,
      });
    }

    if (!response.has_more || !response.next_cursor) break;
    cursor = response.next_cursor as string;
  }

  console.log(`Found ${allRows.length} total speaking items`);

  if (allRows.length === 0) {
    console.log("No items to migrate");
    process.exit(0);
  }

  console.log("Inserting into Postgres...");
  const result = await db
    .insert(speakingEvents)
    .values(allRows)
    .onConflictDoNothing({ target: speakingEvents.notionId });

  console.log(`Inserted ${result.rowCount} new rows (${allRows.length} total, skipped duplicates)`);

  const count = await db.$count(speakingEvents);
  console.log(`Verification: ${count} rows in speaking_events table`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
