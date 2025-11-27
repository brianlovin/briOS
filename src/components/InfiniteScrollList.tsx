"use client";

import React, { useCallback, useEffect, useRef } from "react";

import { LoadingSpinner } from "./ui";

export interface InfiniteScrollListProps<T> {
  as?: "ul" | "div";
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onLoadMore: () => Promise<void>;
  isLoading: boolean;
  isLoadingMore: boolean;
  isReachingEnd: boolean;
  className?: string;
  loadingComponent?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  debounceMs?: number;
  cooldownMs?: number;
}

export function InfiniteScrollList<T>({
  as = "ul",
  items,
  renderItem,
  onLoadMore,
  isLoading,
  isLoadingMore,
  isReachingEnd,
  className = "flex w-full gap-px p-2 flex-col",
  loadingComponent,
  rootMargin = "50px",
  threshold = 0.1,
  debounceMs = 100,
  cooldownMs = 500,
}: InfiniteScrollListProps<T>) {
  const List = as;
  const LoadMoreElement = as === "ul" ? "li" : "div";
  const listRef = useRef<HTMLUListElement | HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLLIElement | HTMLDivElement>(null);
  const isRequestingMore = useRef(false);

  const loadMore = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isRequestingMore.current || isLoadingMore || isReachingEnd || isLoading) {
      return;
    }

    isRequestingMore.current = true;

    try {
      await onLoadMore();
    } catch (error) {
      console.error("Error loading more items:", error);
    } finally {
      // Add a small delay to prevent rapid-fire requests
      setTimeout(() => {
        isRequestingMore.current = false;
      }, cooldownMs);
    }
  }, [onLoadMore, isLoadingMore, isReachingEnd, isLoading, cooldownMs]);

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || isReachingEnd) return;

    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // Debounce the load more call
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            loadMore();
          }, debounceMs);
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      },
    );

    observer.observe(loadMoreElement);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [loadMore, isReachingEnd, rootMargin, threshold, debounceMs]);

  const defaultLoadingComponent = (
    <div className="flex items-center justify-center p-4">
      <LoadingSpinner />
    </div>
  );

  return (
    <List
      ref={listRef as React.Ref<HTMLUListElement> & React.Ref<HTMLDivElement>}
      data-scrollable
      className={className}
    >
      {items.map((item, index) => renderItem(item, index))}
      {!isReachingEnd && (
        <LoadMoreElement
          ref={loadMoreRef as React.Ref<HTMLLIElement> & React.Ref<HTMLDivElement>}
          className="flex h-4 items-center justify-center"
        >
          {(isLoadingMore || isRequestingMore.current) &&
            (loadingComponent || defaultLoadingComponent)}
        </LoadMoreElement>
      )}
    </List>
  );
}
