import type { SWRConfiguration } from "swr";

import { fetcher } from "./fetcher";

/**
 * Global SWR configuration for optimal performance and caching
 *
 * Key optimizations:
 * - keepPreviousData: Shows stale data while revalidating (eliminates loading spinners)
 * - revalidateOnFocus: false - Prevents unnecessary refetches on tab focus
 * - dedupingInterval: 10s - Prevents duplicate requests within 10 seconds
 * - Stale-while-revalidate pattern - Always show data instantly, update in background
 */
export const swrConfig: SWRConfiguration = {
  fetcher,
  // Critical: keep previous data while revalidating to prevent loading states
  keepPreviousData: true,
  // Disable automatic revalidation on focus/reconnect for better UX
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  // Prevent duplicate requests for the same key within 10 seconds
  dedupingInterval: 10000,
  // Throttle focus-triggered revalidation to once per minute
  focusThrottleInterval: 60000,
  // Error retry configuration
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  // Don't use suspense mode (we want to handle loading states manually)
  suspense: false,
};
