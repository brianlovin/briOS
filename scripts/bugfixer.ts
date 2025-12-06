#!/usr/bin/env bun
/**
 * Bug Fixer CLI - Fetches bugs from Notion Site Ideas database
 *
 * Usage:
 *   bun run scripts/bugfixer.ts list              # List all bugs (Label=bug, Status=Todo)
 *   bun run scripts/bugfixer.ts get <id>          # Get bug details + page blocks
 *   bun run scripts/bugfixer.ts status <id> <status>  # Update bug status
 *   bun run scripts/bugfixer.ts url <id>          # Get Notion URL for a bug
 */

import type {
  DatabaseObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { getAllBlocks } from "../src/lib/notion/blocks";
import { notion } from "../src/lib/notion/client";
import type { ProcessedBlock } from "../src/lib/notion/types";

// Configuration - based on actual Site Ideas database properties
const CONFIG = {
  // Property that contains the bug/feature/idea type
  labelProperty: "Type",
  // Value that indicates a bug
  bugLabelValue: "Bug",
  // Property that contains the status
  statusProperty: "Status",
  // Value that indicates a todo/pending bug
  todoStatusValue: "Todo",
  // Value for in-progress
  doingStatusValue: "Doing",
  // Value for completed
  doneStatusValue: "Done",
};

interface SiteIdea {
  id: string;
  title: string;
  label: string | null;
  status: string | null;
  url: string;
  createdTime: string;
}

interface SiteIdeaWithContent extends SiteIdea {
  blocks: ProcessedBlock[];
  plainTextContent: string;
}

// Cache for database ID -> data source ID mapping
const dataSourceIdCache = new Map<string, string>();

async function getDataSourceId(databaseId: string): Promise<string> {
  if (dataSourceIdCache.has(databaseId)) {
    return dataSourceIdCache.get(databaseId)!;
  }

  const database = (await notion.databases.retrieve({
    database_id: databaseId,
  })) as DatabaseObjectResponse;

  const dataSourceId = database.data_sources[0]?.id;
  if (!dataSourceId) {
    throw new Error(`No data source found for database ${databaseId}`);
  }

  dataSourceIdCache.set(databaseId, dataSourceId);
  return dataSourceId;
}

function getNotionPageUrl(pageId: string): string {
  // Convert page ID to URL format (remove dashes)
  const cleanId = pageId.replace(/-/g, "");
  return `https://notion.so/${cleanId}`;
}

/**
 * Convert ProcessedBlock array to plain text for context
 */
function blocksToPlainText(blocks: ProcessedBlock[]): string {
  return blocks
    .map((block) => {
      const textContent = block.content
        .map((c) => c.text.content)
        .join("")
        .trim();

      switch (block.type) {
        case "heading_1":
          return `# ${textContent}`;
        case "heading_2":
          return `## ${textContent}`;
        case "heading_3":
          return `### ${textContent}`;
        case "bulleted_list_item":
          return `- ${textContent}`;
        case "numbered_list_item":
          return `1. ${textContent}`;
        case "code":
          return `\`\`\`${block.language || ""}\n${textContent}\n\`\`\``;
        case "quote":
          return `> ${textContent}`;
        case "divider":
          return "---";
        default:
          return textContent;
      }
    })
    .filter((text) => text.length > 0)
    .join("\n\n");
}

/**
 * List all bugs from the Site Ideas database
 */
async function listBugs(): Promise<SiteIdea[]> {
  const databaseId = process.env.NOTION_SITE_IDEAS_DATABASE_ID;
  if (!databaseId) {
    throw new Error("NOTION_SITE_IDEAS_DATABASE_ID environment variable is not set");
  }

  const dataSourceId = await getDataSourceId(databaseId);

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      and: [
        {
          property: CONFIG.labelProperty,
          select: {
            equals: CONFIG.bugLabelValue,
          },
        },
        {
          property: CONFIG.statusProperty,
          select: {
            equals: CONFIG.todoStatusValue,
          },
        },
      ],
    },
    // Note: Sorting removed until we confirm the property name
    // sorts: [
    //   {
    //     property: "Created time",
    //     direction: "descending",
    //   },
    // ],
  });

  const bugs: SiteIdea[] = response.results
    .map((page) => {
      if (!("properties" in page)) return null;

      const pageWithProps = page as PageObjectResponse;
      const properties = pageWithProps.properties as Record<string, unknown>;

      // Extract title
      const titleProp = properties.Name as { title?: { plain_text: string }[] } | undefined;
      const title = titleProp?.title?.[0]?.plain_text || "Untitled";

      // Extract label
      const labelProp = properties[CONFIG.labelProperty] as
        | { select?: { name: string } | null }
        | undefined;
      const label = labelProp?.select?.name || null;

      // Extract status
      const statusProp = properties[CONFIG.statusProperty] as
        | { status?: { name: string } | null; select?: { name: string } | null }
        | undefined;
      const status = statusProp?.status?.name || statusProp?.select?.name || null;

      return {
        id: pageWithProps.id,
        title,
        label,
        status,
        url: getNotionPageUrl(pageWithProps.id),
        createdTime: pageWithProps.created_time,
      };
    })
    .filter((bug): bug is SiteIdea => bug !== null);

  return bugs;
}

/**
 * Get full details for a specific bug including page content
 */
async function getBugDetails(bugId: string): Promise<SiteIdeaWithContent | null> {
  try {
    const page = (await notion.pages.retrieve({ page_id: bugId })) as PageObjectResponse;

    if (!("properties" in page)) return null;

    const properties = page.properties as Record<string, unknown>;

    // Extract title
    const titleProp = properties.Name as { title?: { plain_text: string }[] } | undefined;
    const title = titleProp?.title?.[0]?.plain_text || "Untitled";

    // Extract label
    const labelProp = properties[CONFIG.labelProperty] as
      | { select?: { name: string } | null }
      | undefined;
    const label = labelProp?.select?.name || null;

    // Extract status
    const statusProp = properties[CONFIG.statusProperty] as
      | { status?: { name: string } | null; select?: { name: string } | null }
      | undefined;
    const status = statusProp?.status?.name || statusProp?.select?.name || null;

    // Get page blocks
    const blocks = await getAllBlocks(bugId);
    const plainTextContent = blocksToPlainText(blocks);

    return {
      id: page.id,
      title,
      label,
      status,
      url: getNotionPageUrl(page.id),
      createdTime: page.created_time,
      blocks,
      plainTextContent,
    };
  } catch (error) {
    console.error(`Error fetching bug details for ${bugId}:`, error);
    return null;
  }
}

/**
 * Update the status of a bug
 */
async function updateBugStatus(bugId: string, newStatus: string): Promise<boolean> {
  try {
    await notion.pages.update({
      page_id: bugId,
      properties: {
        [CONFIG.statusProperty]: {
          select: {
            name: newStatus,
          },
        },
      },
    });
    return true;
  } catch (error) {
    console.error(`Error updating bug status for ${bugId}:`, error);
    return false;
  }
}

/**
 * Debug: Get database properties to discover the correct property names
 */
async function getDbProperties(): Promise<void> {
  const databaseId = process.env.NOTION_SITE_IDEAS_DATABASE_ID;
  if (!databaseId) {
    throw new Error("NOTION_SITE_IDEAS_DATABASE_ID environment variable is not set");
  }

  // Use the data source API to get properties
  const dataSourceId = await getDataSourceId(databaseId);
  const dataSource = await notion.dataSources.retrieve({
    data_source_id: dataSourceId,
  });

  console.log("Database: Site Ideas");
  console.log("\nProperties:");

  const props = (
    dataSource as {
      properties: Record<
        string,
        {
          type: string;
          select?: { options: { name: string }[] };
          status?: { options: { name: string }[] };
          multi_select?: { options: { name: string }[] };
        }
      >;
    }
  ).properties;

  for (const [name, prop] of Object.entries(props || {})) {
    console.log(`  - ${name} (${prop.type})`);

    // Show options for select/status types
    if (prop.type === "select" || prop.type === "status" || prop.type === "multi_select") {
      const optList =
        prop.select?.options || prop.status?.options || prop.multi_select?.options || [];
      if (optList.length > 0) {
        console.log(`      Options: ${optList.map((o) => o.name).join(", ")}`);
      }
    }
  }
}

// CLI handler
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "props": {
      await getDbProperties();
      break;
    }

    case "list": {
      const bugs = await listBugs();
      console.log(JSON.stringify(bugs, null, 2));
      break;
    }

    case "get": {
      const bugId = args[1];
      if (!bugId) {
        console.error("Usage: bun run scripts/bugfixer.ts get <bug-id>");
        process.exit(1);
      }
      const bug = await getBugDetails(bugId);
      if (bug) {
        console.log(JSON.stringify(bug, null, 2));
      } else {
        console.error(`Bug not found: ${bugId}`);
        process.exit(1);
      }
      break;
    }

    case "status": {
      const bugId = args[1];
      const newStatus = args[2];
      if (!bugId || !newStatus) {
        console.error("Usage: bun run scripts/bugfixer.ts status <bug-id> <new-status>");
        console.error(
          `Valid statuses: ${CONFIG.todoStatusValue}, ${CONFIG.doingStatusValue}, ${CONFIG.doneStatusValue}`,
        );
        process.exit(1);
      }
      const success = await updateBugStatus(bugId, newStatus);
      if (success) {
        console.log(`Updated bug ${bugId} status to: ${newStatus}`);
      } else {
        console.error(`Failed to update bug status`);
        process.exit(1);
      }
      break;
    }

    case "url": {
      const bugId = args[1];
      if (!bugId) {
        console.error("Usage: bun run scripts/bugfixer.ts url <bug-id>");
        process.exit(1);
      }
      console.log(getNotionPageUrl(bugId));
      break;
    }

    default:
      console.log(`
Bug Fixer CLI - Fetches bugs from Notion Site Ideas database

Usage:
  bun run scripts/bugfixer.ts list              # List all bugs (Label=bug, Status=Todo)
  bun run scripts/bugfixer.ts get <id>          # Get bug details + page blocks
  bun run scripts/bugfixer.ts status <id> <status>  # Update bug status
  bun run scripts/bugfixer.ts url <id>          # Get Notion URL for a bug

Configuration (edit script to change):
  Label property: ${CONFIG.labelProperty}
  Bug label value: ${CONFIG.bugLabelValue}
  Status property: ${CONFIG.statusProperty}
  Todo status: ${CONFIG.todoStatusValue}
  Doing status: ${CONFIG.doingStatusValue}
  Done status: ${CONFIG.doneStatusValue}
      `);
  }
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
