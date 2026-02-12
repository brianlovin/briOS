/**
 * Migration script: Design Details episodes from Notion → Postgres
 *
 * Usage: bun scripts/migrate-design-details.ts
 */
import { db } from "@/db/client";
import { designDetailsEpisodes } from "@/db/schema/design-details";

import { blocksToMarkdown } from "./lib/blocks-to-markdown";
import { getAllBlocks, hasProperties, notion, type PageObjectResponse } from "./lib/notion";

async function getDataSourceId(databaseId: string): Promise<string> {
  const database = await notion.databases.retrieve({ database_id: databaseId });
  const ds = (database as { data_sources: { id: string }[] }).data_sources[0];
  if (!ds) throw new Error(`No data source found for database ${databaseId}`);
  return ds.id;
}

async function main() {
  console.log("Fetching Design Details episodes from Notion (with pagination)...");
  const databaseId = process.env.NOTION_DESIGN_DETAILS_EPISODES_DATABASE_ID || "";
  const dataSourceId = await getDataSourceId(databaseId);

  const allPages: PageObjectResponse[] = [];
  let cursor: string | undefined;
  let page = 0;

  while (true) {
    page++;
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
      sorts: [{ property: "Episode Number", direction: "descending" }],
    });

    console.log(`  Page ${page}: ${response.results.length} items`);

    for (const result of response.results) {
      if (!hasProperties(result)) continue;
      allPages.push(result as PageObjectResponse);
    }

    if (!response.has_more || !response.next_cursor) break;
    cursor = response.next_cursor as string;
  }

  console.log(`Found ${allPages.length} total episodes`);

  if (allPages.length === 0) {
    console.log("No items to migrate");
    process.exit(0);
  }

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < allPages.length; i++) {
    const p = allPages[i];
    const props = p.properties as Record<string, any>;

    const name = props.Name?.title?.[0]?.plain_text || "Untitled";
    const slug = props.Slug?.rich_text?.[0]?.plain_text || "";
    const description = props.Description?.rich_text?.[0]?.plain_text || null;
    const episodeNumber = props["Episode Number"]?.number ?? null;
    const publishedAt = props["Published Date"]?.date?.start
      ? new Date(props["Published Date"].date.start)
      : null;
    const imageUrl = props["Image URL"]?.url || null;
    const audioUrl = props["Audio URL (S3)"]?.url || null;

    console.log(`  [${i + 1}/${allPages.length}] "${name}" — fetching blocks...`);

    const blocks = await getAllBlocks(p.id);
    const content = blocks.length > 0 ? blocksToMarkdown(blocks) : null;

    try {
      const result = await db
        .insert(designDetailsEpisodes)
        .values({
          name,
          slug,
          description,
          episodeNumber,
          publishedAt,
          imageUrl,
          audioUrl,
          content,
          notionId: p.id,
          createdAt: new Date(p.created_time),
        })
        .onConflictDoNothing();

      if (result.rowCount && result.rowCount > 0) {
        inserted++;
      } else {
        skipped++;
      }
    } catch (err) {
      console.error(`    Error inserting "${name}":`, err);
      skipped++;
    }
  }

  console.log(`\nInserted ${inserted} new rows (${skipped} skipped as duplicates)`);

  const count = await db.$count(designDetailsEpisodes);
  console.log(`Verification: ${count} rows in design_details_episodes table`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
