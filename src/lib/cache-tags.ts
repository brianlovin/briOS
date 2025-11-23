/**
 * Centralized cache tags for content revalidation
 *
 * Usage:
 * - Use `cacheTag(CACHE_TAGS.stacks)` in cached functions
 * - Use `revalidateTag(CACHE_TAGS.stacks)` or `updateTag(CACHE_TAGS.stacks)` for invalidation
 */

export const CACHE_TAGS = {
  // Stack items (tools, apps, services)
  stacks: "stacks",

  // Good websites collection
  websites: "websites",

  // Listening history (Spotify)
  listening: "listening",

  // AMA questions and answers
  amaQuestions: "ama-questions",

  // Writing posts (blog content)
  writingPosts: "writing-posts",

  // Design Details podcast episodes
  designDetailsEpisodes: "design-details-episodes",

  // Hacker News posts
  hnPosts: "hn-posts",

  // Speaking engagements
  speaking: "speaking",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
