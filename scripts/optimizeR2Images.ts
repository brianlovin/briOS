#!/usr/bin/env bun
import { DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Client } from "@notionhq/client";
import crypto from "crypto";
import sharp from "sharp";

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Initialize R2 S3 client
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_S3_API_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = "brios";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;
const MAX_SIZE = 80; // Maximum width or height in pixels

interface OptimizationStats {
  processed: number;
  skipped: number;
  errors: number;
  originalTotalSize: number;
  optimizedTotalSize: number;
}

const stats: OptimizationStats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  originalTotalSize: 0,
  optimizedTotalSize: 0,
};

/**
 * Download image from R2
 */
async function downloadFromR2(r2Url: string): Promise<Buffer | null> {
  try {
    // Extract the key from the R2 URL
    const key = r2Url.replace(`${R2_PUBLIC_URL}/`, "");

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    if (!response.Body) return null;

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    console.error(`  ❌ Error downloading from R2: ${error}`);
    return null;
  }
}

/**
 * Optimize image using sharp
 */
async function optimizeImage(buffer: Buffer): Promise<{ buffer: Buffer; format: string } | null> {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    console.log(
      `    📏 Original: ${metadata.width}x${metadata.height}, ${metadata.format}, ${(buffer.length / 1024).toFixed(2)}KB`,
    );

    // Resize if needed (maintain aspect ratio, max 80x80)
    let processedImage = image.resize(MAX_SIZE, MAX_SIZE, {
      fit: "inside",
      withoutEnlargement: true,
    });

    // Optimize based on format
    if (metadata.format === "png") {
      processedImage = processedImage.png({
        quality: 90,
        compressionLevel: 9,
        effort: 10,
      });
    } else if (metadata.format === "jpeg" || metadata.format === "jpg") {
      processedImage = processedImage.jpeg({
        quality: 90,
        mozjpeg: true,
      });
    } else if (metadata.format === "webp") {
      processedImage = processedImage.webp({
        quality: 90,
        effort: 6,
      });
    } else if (metadata.format === "svg") {
      // SVGs are already vector, no need to optimize
      return { buffer, format: "svg" };
    }

    const optimizedBuffer = await processedImage.toBuffer();
    const optimizedMetadata = await sharp(optimizedBuffer).metadata();

    console.log(
      `    ✨ Optimized: ${optimizedMetadata.width}x${optimizedMetadata.height}, ${(optimizedBuffer.length / 1024).toFixed(2)}KB`,
    );
    console.log(
      `    💾 Saved: ${((1 - optimizedBuffer.length / buffer.length) * 100).toFixed(1)}%`,
    );

    stats.originalTotalSize += buffer.length;
    stats.optimizedTotalSize += optimizedBuffer.length;

    return {
      buffer: optimizedBuffer,
      format: metadata.format || "png",
    };
  } catch (error) {
    console.error(`  ❌ Error optimizing image: ${error}`);
    return null;
  }
}

/**
 * Upload optimized image to R2
 */
async function uploadToR2(buffer: Buffer, format: string): Promise<string | null> {
  try {
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");
    const extension = format === "svg" ? ".svg" : `.${format}`;
    const filename = `notion-images/${hash}${extension}`;

    const contentType = `image/${format === "svg" ? "svg+xml" : format}`;

    await s3Client
      .send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: filename,
        }),
      )
      .catch(() => {
        // Ignore errors if file doesn't exist
      });

    // Use PutObjectCommand
    const { PutObjectCommand } = await import("@aws-sdk/client-s3");
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    return `${R2_PUBLIC_URL}/${filename}`;
  } catch (error) {
    console.error(`  ❌ Error uploading to R2: ${error}`);
    return null;
  }
}

/**
 * Delete old image from R2
 */
async function deleteFromR2(r2Url: string): Promise<void> {
  try {
    const key = r2Url.replace(`${R2_PUBLIC_URL}/`, "");

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }),
    );

    console.log(`    🗑️  Deleted old image from R2`);
  } catch (error) {
    console.error(`  ⚠️  Error deleting old image from R2: ${error}`);
  }
}

/**
 * Check if URL is an R2 URL that needs optimization
 */
function isR2Image(url: string | undefined): boolean {
  return !!url && url.startsWith(R2_PUBLIC_URL);
}

/**
 * Optimize a single image
 */
async function optimizeR2Image(
  imageUrl: string,
  pageId: string,
  updateType: "icon" | "image",
): Promise<boolean> {
  try {
    // Download from R2
    console.log(`  📥 Downloading from R2...`);
    const originalBuffer = await downloadFromR2(imageUrl);
    if (!originalBuffer) {
      console.log(`  ⏭️  Failed to download, skipping`);
      stats.skipped++;
      return false;
    }

    // Optimize image
    console.log(`  🔧 Optimizing...`);
    const optimized = await optimizeImage(originalBuffer);
    if (!optimized) {
      console.log(`  ⏭️  Failed to optimize, skipping`);
      stats.skipped++;
      return false;
    }

    // Upload optimized version
    console.log(`  📤 Uploading optimized image...`);
    const newUrl = await uploadToR2(optimized.buffer, optimized.format);
    if (!newUrl) {
      console.log(`  ⏭️  Failed to upload, skipping`);
      stats.skipped++;
      return false;
    }

    // Check if URL changed (same hash means no optimization needed)
    if (newUrl === imageUrl) {
      console.log(`  ⏭️  No optimization needed (same hash)`);
      stats.skipped++;
      return false;
    }

    console.log(`  ✅ New URL: ${newUrl}`);

    // Update Notion page
    console.log(`  💾 Updating Notion...`);
    if (updateType === "icon") {
      await notion.pages.update({
        page_id: pageId,
        icon: {
          type: "external",
          external: { url: newUrl },
        },
      });
    } else {
      // Update Image property
      await notion.pages.update({
        page_id: pageId,
        properties: {
          Image: {
            url: newUrl,
          },
        },
      });
    }

    // Delete old image
    console.log(`  🗑️  Deleting old image...`);
    await deleteFromR2(imageUrl);

    stats.processed++;
    return true;
  } catch (error) {
    console.error(`  ❌ Error optimizing image: ${error}`);
    stats.errors++;
    return false;
  }
}

/**
 * Optimize Good Websites icons
 */
async function optimizeGoodWebsites() {
  console.log("\n🌐 Processing Good Websites...\n");

  const databaseId = process.env.NOTION_GOOD_WEBSITES_DATABASE_ID!;
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  console.log(`Found ${response.results.length} website items\n`);

  for (const page of response.results) {
    if (!("properties" in page)) continue;

    const pageWithProps = page as any;
    const name = pageWithProps.properties.Name?.title[0]?.plain_text || "Untitled";
    const icon =
      pageWithProps.icon?.type === "external"
        ? pageWithProps.icon.external.url
        : pageWithProps.icon?.type === "file"
          ? pageWithProps.icon.file.url
          : undefined;

    console.log(`Processing: ${name}`);

    if (!isR2Image(icon)) {
      console.log(`  ⏭️  No R2 icon found, skipping\n`);
      stats.skipped++;
      continue;
    }

    await optimizeR2Image(icon!, page.id, "icon");
    console.log();
  }
}

/**
 * Optimize Stack items (both icons and images)
 */
async function optimizeStack() {
  console.log("\n📚 Processing Stack items...\n");

  const databaseId = process.env.NOTION_STACK_DATABASE_ID!;
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  console.log(`Found ${response.results.length} stack items\n`);

  for (const page of response.results) {
    if (!("properties" in page)) continue;

    const pageWithProps = page as any;
    const name = pageWithProps.properties.Name?.title[0]?.plain_text || "Untitled";
    const icon =
      pageWithProps.icon?.type === "external"
        ? pageWithProps.icon.external.url
        : pageWithProps.icon?.type === "file"
          ? pageWithProps.icon.file.url
          : undefined;
    const image = pageWithProps.properties.Image?.url;

    console.log(`Processing: ${name}`);

    // Optimize icon
    if (isR2Image(icon)) {
      console.log(`  🎨 Optimizing icon...`);
      await optimizeR2Image(icon!, page.id, "icon");
    } else {
      console.log(`  ⏭️  No R2 icon found`);
      stats.skipped++;
    }

    // Optimize image
    if (isR2Image(image)) {
      console.log(`  📸 Optimizing image...`);
      await optimizeR2Image(image!, page.id, "image");
    } else {
      console.log(`  ⏭️  No R2 image found`);
      stats.skipped++;
    }

    console.log();
  }
}

/**
 * Main function
 */
async function main() {
  console.log("🚀 Starting R2 image optimization...\n");

  await optimizeGoodWebsites();
  await optimizeStack();

  console.log("\n" + "=".repeat(50));
  console.log("✅ Optimization complete!\n");
  console.log(`📊 Statistics:`);
  console.log(`   - Processed: ${stats.processed} images`);
  console.log(`   - Skipped: ${stats.skipped} images`);
  console.log(`   - Errors: ${stats.errors} images`);
  console.log(`   - Original total size: ${(stats.originalTotalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(
    `   - Optimized total size: ${(stats.optimizedTotalSize / 1024 / 1024).toFixed(2)}MB`,
  );
  if (stats.originalTotalSize > 0) {
    console.log(
      `   - Total savings: ${((1 - stats.optimizedTotalSize / stats.originalTotalSize) * 100).toFixed(1)}%`,
    );
  }
  console.log("=".repeat(50) + "\n");
}

main().catch(console.error);
