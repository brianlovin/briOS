/**
 * Migration script: Writing posts from Notion → Postgres
 *
 * Usage: bun scripts/migrate-writing.ts
 */
import { db } from "@/db/client";
import { writingPosts } from "@/db/schema/writing";

import { blocksToMarkdown } from "./lib/blocks-to-markdown";
import { getAllBlocks, hasProperties, notion, type PageObjectResponse } from "./lib/notion";

async function getDataSourceId(databaseId: string): Promise<string> {
  const database = await notion.databases.retrieve({ database_id: databaseId });
  const ds = (database as { data_sources: { id: string }[] }).data_sources[0];
  if (!ds) throw new Error(`No data source found for database ${databaseId}`);
  return ds.id;
}

async function main() {
  console.log("Fetching writing posts from Notion (with pagination)...");
  const databaseId = process.env.NOTION_WRITING_DATABASE_ID || "";
  const dataSourceId = await getDataSourceId(databaseId);

  // Collect all pages first
  const allPages: PageObjectResponse[] = [];
  let cursor: string | undefined;
  let page = 0;

  while (true) {
    page++;
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
      filter: {
        property: "Published",
        date: { is_not_empty: true },
      },
      sorts: [{ property: "Published", direction: "descending" }],
    });

    console.log(`  Page ${page}: ${response.results.length} items`);

    for (const result of response.results) {
      if (!hasProperties(result)) continue;
      allPages.push(result as PageObjectResponse);
    }

    if (!response.has_more || !response.next_cursor) break;
    cursor = response.next_cursor as string;
  }

  console.log(`Found ${allPages.length} total writing posts`);

  if (allPages.length === 0) {
    console.log("No items to migrate");
    process.exit(0);
  }

  // Process each page: fetch blocks, convert to markdown, insert
  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < allPages.length; i++) {
    const p = allPages[i];
    const props = p.properties as Record<string, any>;

    const title = props.Name?.title?.[0]?.plain_text || "Untitled";
    const slug = props.Slug?.rich_text?.[0]?.plain_text || "";
    const shortId = props["Short ID"]?.rich_text?.[0]?.plain_text || null;
    const excerpt = props.Excerpt?.rich_text?.[0]?.plain_text || null;
    const featureImage = props.FeatureImage?.url || null;
    const publishedAt = props.Published?.date?.start ? new Date(props.Published.date.start) : null;

    console.log(`  [${i + 1}/${allPages.length}] "${title}" — fetching blocks...`);

    const blocks = await getAllBlocks(p.id);
    const content = blocksToMarkdown(blocks);

    try {
      const result = await db
        .insert(writingPosts)
        .values({
          title,
          slug,
          shortId,
          excerpt,
          content,
          featureImage,
          publishedAt,
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
      console.error(`    Error inserting "${title}":`, err);
      skipped++;
    }
  }

  console.log(`\nInserted ${inserted} new rows (${skipped} skipped as duplicates)`);

  const count = await db.$count(writingPosts);
  console.log(`Verification: ${count} rows in writing_posts table`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
