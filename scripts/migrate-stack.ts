/**
 * Migration script: Stack items from Notion → Postgres
 *
 * Usage: bun scripts/migrate-stack.ts
 */
import { db } from "@/db/client";
import { stackItems } from "@/db/schema/stack";

import { hasProperties, notion, type PageObjectResponse } from "./lib/notion";

async function getDataSourceId(databaseId: string): Promise<string> {
  const database = await notion.databases.retrieve({ database_id: databaseId });
  const ds = (database as { data_sources: { id: string }[] }).data_sources[0];
  if (!ds) throw new Error(`No data source found for database ${databaseId}`);
  return ds.id;
}

async function main() {
  console.log("Fetching stack items from Notion (with pagination)...");
  const databaseId = process.env.NOTION_STACK_DATABASE_ID || "";
  const dataSourceId = await getDataSourceId(databaseId);

  const allRows: (typeof stackItems.$inferInsert)[] = [];
  let cursor: string | undefined;
  let page = 0;

  while (true) {
    page++;
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
      sorts: [{ property: "Name", direction: "ascending" }],
    });

    console.log(`  Page ${page}: ${response.results.length} items`);

    for (const result of response.results) {
      if (!hasProperties(result)) continue;
      const p = result as PageObjectResponse;

      const icon =
        p.icon?.type === "file"
          ? p.icon.file.url
          : p.icon?.type === "external"
            ? p.icon.external.url
            : p.icon?.type === "emoji"
              ? p.icon.emoji
              : undefined;

      const props = p.properties as Record<string, any>;

      allRows.push({
        name: props.Name?.title?.[0]?.plain_text || "Untitled",
        slug: props.Slug?.rich_text?.[0]?.plain_text || "",
        description: props.Description?.rich_text?.[0]?.plain_text || null,
        image: props.Image?.url || null,
        icon: icon || null,
        url: props.URL?.url || null,
        platforms: props.Platforms?.multi_select?.map((s: { name: string }) => s.name) || [],
        status: props.Status?.select?.name || "Active",
        previewImage: props["Preview Image"]?.url || null,
        previewImageDark: props["Preview Image Dark"]?.url || null,
        previewStatus: props["Preview Status"]?.select?.name || null,
        notionId: p.id,
        createdAt: new Date(props["Created time"]?.created_time || p.created_time),
      });
    }

    if (!response.has_more || !response.next_cursor) break;
    cursor = response.next_cursor as string;
  }

  console.log(`Found ${allRows.length} total stack items`);

  if (allRows.length === 0) {
    console.log("No items to migrate");
    process.exit(0);
  }

  console.log("Inserting into Postgres...");
  const batchSize = 500;
  let inserted = 0;

  for (let i = 0; i < allRows.length; i += batchSize) {
    const batch = allRows.slice(i, i + batchSize);
    const result = await db.insert(stackItems).values(batch).onConflictDoNothing();

    inserted += result.rowCount ?? 0;
  }

  console.log(`Inserted ${inserted} new rows (${allRows.length} total, skipped duplicates)`);

  const count = await db.$count(stackItems);
  console.log(`Verification: ${count} rows in stack_items table`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
