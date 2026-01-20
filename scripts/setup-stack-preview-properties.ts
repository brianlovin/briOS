/**
 * Add site preview properties to the Stack Notion database
 */

const DATABASE_ID = "1fdc711c0ceb804c8cb5e8b0c0f36b6e";

async function main() {
  console.log("Adding preview properties to Stack database...\n");

  const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      properties: {
        "Preview Status": {
          select: {
            options: [
              { name: "Queued", color: "yellow" },
              { name: "Processing", color: "blue" },
              { name: "Done", color: "green" },
              { name: "Error", color: "red" },
            ],
          },
        },
        "Preview Image": {
          url: {},
        },
        "Preview Updated": {
          date: {},
        },
        "Preview Error": {
          rich_text: {},
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("API Error:", JSON.stringify(error, null, 2));
    throw new Error(`Failed to update database: ${response.status}`);
  }

  const result = await response.json();

  console.log("✓ Successfully added preview properties!\n");
  console.log("Properties added:");
  console.log("  - Preview Status (select)");
  console.log("  - Preview Image (url)");
  console.log("  - Preview Updated (date)");
  console.log("  - Preview Error (rich_text)");
  console.log("\nDatabase URL:", result.url);
}

main().catch(console.error);
