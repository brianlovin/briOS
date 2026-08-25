import { NextResponse } from "next/server";

import { errorResponse, safeCompare } from "@/lib/api-utils";
import { isFullPage, notion } from "@/lib/notion";
import { uploadBufferToR2 } from "@/lib/r2/storage";

import { getMediaUrl } from "../optimize-writing-images/media";
import { collectJournalImages, fieldNoteBlockUpdate, type MediaBlockLike } from "./collect";
import { composeFieldNotePoster, preparePhotoBuffer } from "./compose";
import {
  fieldNoteLines,
  journalFallbackFromProperties,
  parsePhotoExif,
  photoDate,
  resolveLocation,
} from "./metadata";
import { generateStamp } from "./stamp";

export const maxDuration = 300;

interface BlockWithChildren extends MediaBlockLike {
  has_children?: boolean;
}

/**
 * Recursively fetch all blocks from a page, including nested blocks
 * (same pattern as optimize-writing-images).
 */
async function getAllBlocks(blockId: string): Promise<BlockWithChildren[]> {
  const blocks: BlockWithChildren[] = [];

  try {
    let cursor: string | undefined;
    do {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100,
      });

      for (const block of response.results) {
        const raw = block as BlockWithChildren;
        blocks.push(raw);

        if (raw.has_children && raw.id) {
          const children = await getAllBlocks(raw.id);
          blocks.push(...children);
        }
      }

      cursor = response.next_cursor || undefined;
    } while (cursor);
  } catch (error) {
    console.error(`Error fetching blocks for ${blockId}:`, error);
  }

  return blocks;
}

export type IllustrateResult =
  | { blockId: string; status: "processed"; url: string }
  | { blockId: string; status: "skipped"; reason: string }
  | { blockId: string; status: "failed"; error: string };

async function illustrateImageBlock(
  media: ReturnType<typeof collectJournalImages>["pending"][number],
  fallback: ReturnType<typeof journalFallbackFromProperties>,
): Promise<IllustrateResult> {
  const sourceUrl = getMediaUrl(media);
  if (!sourceUrl) {
    return { blockId: media.id, status: "failed", error: "No image URL found" };
  }

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    return { blockId: media.id, status: "failed", error: "Failed to download image" };
  }

  const original = Buffer.from(await response.arrayBuffer());
  const exif = await parsePhotoExif(original);
  const photo = await preparePhotoBuffer(original);
  const location = await resolveLocation(exif, fallback);
  const date = photoDate(exif, fallback.date);
  const stamp = await generateStamp(photo);
  const lines = fieldNoteLines({
    location,
    date,
    journalDate: fallback.date,
    keywords: stamp.keywords,
  });

  const poster = await composeFieldNotePoster({
    photo,
    stamp: stamp.image,
    lines,
  });

  const r2Url = await uploadBufferToR2(poster, "image/jpeg");
  await notion.blocks.update(fieldNoteBlockUpdate(media, r2Url) as never);

  return { blockId: media.id, status: "processed", url: r2Url };
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.NOTION_WEBHOOK_VERIFICATION_SECRET;
    const providedSecret = request.headers.get("x-webhook-secret");
    if (!safeCompare(providedSecret, webhookSecret)) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const pageId = body.data?.id;

    if (!pageId) {
      console.error("Missing required field: data.id (pageId)", body);
      return errorResponse("Missing required field: data.id (pageId)", 400);
    }

    console.log(`\n🖼  Illustrating journal photos for page ${pageId}\n`);

    const page = await notion.pages.retrieve({ page_id: pageId });
    const fallback = isFullPage(page) ? journalFallbackFromProperties(page.properties) : {};

    const allBlocks = await getAllBlocks(pageId);
    const { pending, skipped, remaining } = collectJournalImages(allBlocks);

    console.log(
      `Found ${pending.length} photos to illustrate, ${skipped.length} already illustrated, ${remaining} over cap\n`,
    );

    const results: IllustrateResult[] = skipped.map((item) => ({
      blockId: item.id,
      status: "skipped" as const,
      reason: "already illustrated",
    }));

    let processed = 0;
    let failed = 0;

    for (const [index, media] of pending.entries()) {
      console.log(`Illustrating ${index + 1}/${pending.length}: ${media.id}`);
      try {
        const result = await illustrateImageBlock(media, fallback);
        results.push(result);
        if (result.status === "processed") {
          processed += 1;
          console.log(`  ✅ ${result.url}\n`);
        } else if (result.status === "failed") {
          failed += 1;
          console.log(`  ❌ ${result.error}\n`);
        }
      } catch (error) {
        failed += 1;
        const message = error instanceof Error ? error.message : "Unknown error";
        results.push({ blockId: media.id, status: "failed", error: message });
        console.error(`  ❌ ${message}\n`);
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      skipped: skipped.length,
      failed,
      remaining,
      results,
    });
  } catch (error) {
    console.error("Error illustrating journal images", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(`Failed to illustrate journal images: ${errorMessage}`, 500, error);
  }
}
