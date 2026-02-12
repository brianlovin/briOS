/**
 * Migration script: App Dissection from Notion → Postgres
 *
 * This is the most complex migration due to hierarchical block parsing:
 * - Blocks before first divider → intro content
 * - After divider: heading_2 = new detail section, code blocks with valid JSON = video metadata
 *
 * Usage: bun scripts/migrate-app-dissection.ts
 */
import { db } from "@/db/client";
import { appDissectionDetails, appDissections } from "@/db/schema/app-dissection";

import { blocksToMarkdown } from "./lib/blocks-to-markdown";
import {
  getAllBlocks,
  hasProperties,
  isValidVideoMetadata,
  notion,
  type PageObjectResponse,
  type ProcessedBlock,
} from "./lib/notion";

async function getDataSourceId(databaseId: string): Promise<string> {
  const database = await notion.databases.retrieve({ database_id: databaseId });
  const ds = (database as { data_sources: { id: string }[] }).data_sources[0];
  if (!ds) throw new Error(`No data source found for database ${databaseId}`);
  return ds.id;
}

interface ParsedDetail {
  title: string;
  descriptionBlocks: ProcessedBlock[];
  videoMetadata: unknown | null;
}

function parseBlocks(blocks: ProcessedBlock[]): {
  introContent: string;
  details: ParsedDetail[];
} {
  const introBlocks: ProcessedBlock[] = [];
  const details: ParsedDetail[] = [];
  let currentDetail: ParsedDetail | null = null;
  let inIntro = true;

  for (const block of blocks) {
    if (block.type === "divider") {
      inIntro = false;
      continue;
    }

    if (inIntro) {
      introBlocks.push(block);
      continue;
    }

    if (block.type === "heading_2") {
      if (currentDetail) {
        details.push(currentDetail);
      }
      currentDetail = {
        title: block.content.map((c) => c.text.content).join(""),
        descriptionBlocks: [],
        videoMetadata: null,
      };
      continue;
    }

    if (block.type === "code" && block.language === "json" && currentDetail) {
      const jsonContent = block.content.map((c) => c.text.content).join("");
      try {
        const parsed = JSON.parse(jsonContent);
        if (isValidVideoMetadata(parsed)) {
          currentDetail.videoMetadata = parsed;
        } else {
          currentDetail.descriptionBlocks.push(block);
        }
      } catch {
        currentDetail.descriptionBlocks.push(block);
      }
      continue;
    }

    if (currentDetail) {
      currentDetail.descriptionBlocks.push(block);
    }
  }

  if (currentDetail) {
    details.push(currentDetail);
  }

  return {
    introContent: blocksToMarkdown(introBlocks),
    details,
  };
}

async function main() {
  console.log("Fetching App Dissection items from Notion (with pagination)...");
  const databaseId = process.env.NOTION_APP_DISSECTION_DATABASE_ID || "";
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
      filter: {
        property: "Status",
        select: { equals: "Published" },
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

  console.log(`Found ${allPages.length} total app dissection items`);

  if (allPages.length === 0) {
    console.log("No items to migrate");
    process.exit(0);
  }

  let insertedApps = 0;
  let insertedDetails = 0;
  let skipped = 0;

  for (let i = 0; i < allPages.length; i++) {
    const p = allPages[i];
    const props = p.properties as Record<string, any>;

    const name = props.Name?.title?.[0]?.plain_text || "Untitled";
    const slug = props.Slug?.rich_text?.[0]?.plain_text || "";
    const publishedAt = props.Published?.date?.start ? new Date(props.Published.date.start) : null;

    const icon =
      p.icon?.type === "file"
        ? p.icon.file.url
        : p.icon?.type === "external"
          ? p.icon.external.url
          : props.Icon?.url || null;

    console.log(`  [${i + 1}/${allPages.length}] "${name}" — fetching blocks...`);

    const blocks = await getAllBlocks(p.id);
    const { introContent, details } = parseBlocks(blocks);

    try {
      // Insert parent
      const [appRow] = await db
        .insert(appDissections)
        .values({
          name,
          slug,
          icon,
          status: "Published",
          introContent,
          publishedAt,
          notionId: p.id,
          createdAt: new Date(p.created_time),
        })
        .onConflictDoNothing()
        .returning({ id: appDissections.id });

      if (!appRow) {
        console.log(`    Skipped (duplicate)`);
        skipped++;
        continue;
      }

      insertedApps++;

      // Insert details
      for (let j = 0; j < details.length; j++) {
        const detail = details[j];
        const description = blocksToMarkdown(detail.descriptionBlocks);

        await db.insert(appDissectionDetails).values({
          appDissectionId: appRow.id,
          title: detail.title,
          description,
          videoMetadata: detail.videoMetadata,
          sortOrder: j,
        });

        insertedDetails++;
      }

      console.log(`    Inserted with ${details.length} details`);
    } catch (err) {
      console.error(`    Error inserting "${name}":`, err);
      skipped++;
    }
  }

  console.log(
    `\nInserted ${insertedApps} apps with ${insertedDetails} details (${skipped} skipped)`,
  );

  const appCount = await db.$count(appDissections);
  const detailCount = await db.$count(appDissectionDetails);
  console.log(
    `Verification: ${appCount} rows in app_dissections, ${detailCount} rows in app_dissection_details`,
  );

  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
