import { preload } from "swr";

type PrefetchFetcher<T> = (key: string) => Promise<T>;

/**
 * Fire-and-forget SWR preload. Settles rejected preload promises so a failed
 * hover prefetch cannot become an unhandledrejection. Subscribed useSWR()
 * callers still receive the same error via the cache.
 */
export function prefetch<T>(key: string, fetcher: PrefetchFetcher<T>): void {
  void Promise.resolve(preload(key, fetcher)).catch(() => {});
}
