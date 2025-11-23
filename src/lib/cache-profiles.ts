/**
 * Reusable cache profiles for different content types
 *
 * These profiles define how long cached content stays fresh before revalidation.
 *
 * Usage:
 * ```ts
 * 'use cache'
 * cacheLife(CACHE_PROFILES.static)
 * ```
 *
 * Or use string shortcuts provided by Next.js:
 * - 'seconds' - Good for real-time data
 * - 'minutes' - Good for frequently changing data
 * - 'hours' - Good for moderately changing data (most content)
 * - 'days' - Good for rarely changing data
 * - 'weeks' - Good for static-like data
 * - 'max' - Good for truly static data
 */

export const CACHE_PROFILES = {
  // Real-time data (external APIs like HN)
  realtime: {
    stale: 60, // 1 minute until considered stale
    revalidate: 300, // 5 minutes until revalidated
    expire: 600, // 10 minutes until expired
  },

  // Frequently changing data (user-generated content)
  frequent: {
    stale: 300, // 5 minutes
    revalidate: 600, // 10 minutes
    expire: 1800, // 30 minutes
  },

  // Standard content (most Notion content)
  standard: {
    stale: 3600, // 1 hour
    revalidate: 7200, // 2 hours
    expire: 86400, // 24 hours
  },

  // Rarely changing content (podcast episodes, archived content)
  rare: {
    stale: 86400, // 24 hours
    revalidate: 172800, // 48 hours
    expire: 604800, // 1 week
  },

  // Static-like content (published writing, permanent content)
  static: {
    stale: 604800, // 1 week
    revalidate: 1209600, // 2 weeks
    expire: 2592000, // 30 days
  },
} as const;

export type CacheProfile = (typeof CACHE_PROFILES)[keyof typeof CACHE_PROFILES];
