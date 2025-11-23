"use server";

import { revalidateTag } from "next/cache";

import { CACHE_TAGS, CacheTag } from "@/lib/cache-tags";

/**
 * Revalidate cached content by tag
 *
 * Uses stale-while-revalidate semantics (profile="max"):
 * - Marks cached content as stale
 * - Serves stale content immediately
 * - Fetches fresh data in the background
 * - Updates cache when new data is ready
 *
 * Usage:
 * ```ts
 * import { revalidateByTag } from '@/app/actions/revalidate'
 * import { CACHE_TAGS } from '@/lib/cache-tags'
 *
 * await revalidateByTag(CACHE_TAGS.stacks)
 * ```
 */
export async function revalidateByTag(tag: CacheTag): Promise<{ success: boolean }> {
  try {
    revalidateTag(tag, "max");
    return { success: true };
  } catch (error) {
    console.error(`Failed to revalidate tag ${tag}:`, error);
    return { success: false };
  }
}

/**
 * Revalidate multiple cache tags at once
 *
 * Uses stale-while-revalidate semantics (profile="max") for all tags.
 * Useful when updating content that affects multiple areas.
 *
 * Usage:
 * ```ts
 * await revalidateMultipleTags([
 *   CACHE_TAGS.stacks,
 *   CACHE_TAGS.websites
 * ])
 * ```
 */
export async function revalidateMultipleTags(
  tags: CacheTag[],
): Promise<{ success: boolean; failed: CacheTag[] }> {
  const failed: CacheTag[] = [];

  for (const tag of tags) {
    try {
      revalidateTag(tag, "max");
    } catch (error) {
      console.error(`Failed to revalidate tag ${tag}:`, error);
      failed.push(tag);
    }
  }

  return {
    success: failed.length === 0,
    failed,
  };
}

/**
 * Revalidate all cache tags
 *
 * Nuclear option - clears all cached content across the site.
 * Use sparingly as this can cause performance issues.
 */
export async function revalidateAll(): Promise<{ success: boolean; revalidated: number }> {
  const allTags = Object.values(CACHE_TAGS);
  const result = await revalidateMultipleTags(allTags);

  return {
    success: result.success,
    revalidated: allTags.length - result.failed.length,
  };
}

/**
 * Helper functions for common revalidation scenarios
 */

export async function revalidateStacks() {
  return revalidateByTag(CACHE_TAGS.stacks);
}

export async function revalidateWebsites() {
  return revalidateByTag(CACHE_TAGS.websites);
}

export async function revalidateListening() {
  return revalidateByTag(CACHE_TAGS.listening);
}

export async function revalidateAmaQuestions() {
  return revalidateByTag(CACHE_TAGS.amaQuestions);
}

export async function revalidateWritingPosts() {
  return revalidateByTag(CACHE_TAGS.writingPosts);
}

export async function revalidateDesignDetailsEpisodes() {
  return revalidateByTag(CACHE_TAGS.designDetailsEpisodes);
}

export async function revalidateHNPosts() {
  return revalidateByTag(CACHE_TAGS.hnPosts);
}

export async function revalidateSpeaking() {
  return revalidateByTag(CACHE_TAGS.speaking);
}
