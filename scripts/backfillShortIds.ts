/**
 * Backfill script to generate Short IDs for all existing writing posts
 *
 * Usage: bun run backfill-short-ids
 *
 * This script:
 * 1. Fetches all writing posts from Notion
 * 2. Filters posts that don't have a Short ID
 * 3. Generates and saves a unique Short ID for each
 */

import { updateWritingShortId } from "../src/lib/notion/mutations";
import { getWritingDatabaseItems, getWritingPostByShortId } from "../src/lib/notion/queries";
import { generateShortId, isValidShortId } from "../src/lib/short-id";

const MAX_RETRIES = 5;

async function generateUniqueShortId(): Promise<string | null> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const candidate = generateShortId();

    // Check for collision
    const existing = await getWritingPostByShortId(candidate);
    if (!existing) {
      return candidate;
    }

    console.log(`  ⚠️ Collision detected for ${candidate}, retrying...`);
  }

  return null;
}

async function getAllWritingPosts() {
  const allItems = [];
  let cursor: string | undefined;

  do {
    const { items, nextCursor } = await getWritingDatabaseItems(cursor, 100);
    allItems.push(...items);
    cursor = nextCursor ?? undefined;
  } while (cursor);

  return allItems;
}

async function backfillShortIds() {
  console.log("\n🔑 Starting Short ID backfill...\n");

  // Fetch all writing posts
  console.log("📚 Fetching all writing posts...");
  const allPosts = await getAllWritingPosts();
  console.log(`Found ${allPosts.length} total posts\n`);

  // Filter posts without valid Short IDs
  const postsNeedingIds = allPosts.filter((post) => !post.shortId || !isValidShortId(post.shortId));

  if (postsNeedingIds.length === 0) {
    console.log("✅ All posts already have valid Short IDs!\n");
    return;
  }

  console.log(`📝 ${postsNeedingIds.length} posts need Short IDs\n`);

  // Generate Short IDs for each post
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < postsNeedingIds.length; i++) {
    const post = postsNeedingIds[i];
    console.log(`[${i + 1}/${postsNeedingIds.length}] "${post.title}"`);

    try {
      const shortId = await generateUniqueShortId();

      if (!shortId) {
        console.log(`  ❌ Failed to generate unique Short ID\n`);
        errorCount++;
        continue;
      }

      await updateWritingShortId(post.id, shortId);
      console.log(`  ✅ Generated: ${shortId}\n`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Error:`, error instanceof Error ? error.message : error);
      errorCount++;
    }
  }

  console.log("=".repeat(50));
  console.log(`✅ Backfill complete!`);
  console.log(`   - Successful: ${successCount}`);
  console.log(`   - Failed: ${errorCount}`);
  console.log("=".repeat(50) + "\n");
}

if (require.main === module) {
  backfillShortIds().catch((err) => {
    console.error("Failed to backfill Short IDs:", err);
    process.exit(1);
  });
}
