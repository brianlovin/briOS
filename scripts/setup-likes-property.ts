/**
 * Add the Likes number property to all relevant Notion databases
 * Run with: bun scripts/setup-likes-property.ts
 */

const DATABASES = [
  { name: "Stack", envKey: "NOTION_STACK_DATABASE_ID" },
  { name: "Good Websites", envKey: "NOTION_GOOD_WEBSITES_DATABASE_ID" },
  { name: "Writing", envKey: "NOTION_WRITING_DATABASE_ID" },
  { name: "AMA", envKey: "NOTION_AMA_DATABASE_ID" },
  { name: "TIL", envKey: "NOTION_TIL_DATABASE_ID" },
];

async function addLikesProperty(name: string, databaseId: string) {
  console.log(`Adding Likes property to ${name} database...`);

  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      properties: {
        Likes: {
          number: {},
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(`  ✗ Failed: ${JSON.stringify(error)}`);
    return false;
  }

  console.log(`  ✓ Success`);
  return true;
}

async function main() {
  console.log("Setting up Likes property on Notion databases\n");

  if (!process.env.NOTION_TOKEN) {
    console.error("Error: NOTION_TOKEN environment variable is not set");
    process.exit(1);
  }

  let successCount = 0;
  let skipCount = 0;

  for (const db of DATABASES) {
    const databaseId = process.env[db.envKey];

    if (!databaseId) {
      console.log(`Skipping ${db.name}: ${db.envKey} not set`);
      skipCount++;
      continue;
    }

    const success = await addLikesProperty(db.name, databaseId);
    if (success) successCount++;

    // Rate limit: Notion allows ~3 requests/second
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  console.log(`\nDone! ${successCount} databases updated, ${skipCount} skipped`);
}

main().catch(console.error);
