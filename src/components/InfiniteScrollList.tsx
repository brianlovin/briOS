"use client";

import React, { useCallback, useEffect, useRef } from "react";

import { LoadingSpinner } from "./ui";

/**
 * Find the nearest scrollable parent element
 */
function getScrollableParent(element: HTMLElement | null): HTMLElement | null {
  if (!element) return null;

  let parent = element.parentElement;
  while (parent) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (overflowY === "auto" || overflowY === "scroll") {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

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
  className = "flex w-full gap-0.5 p-3 flex-col",
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
    const listElement = listRef.current;

    if (!loadMoreElement || isReachingEnd) return;

    // Find the scrollable parent to use as the IntersectionObserver root
    // This prevents issues with fixed-positioned containers where using
    // root: null would observe viewport intersection instead of scroll container
    const scrollableParent = getScrollableParent(listElement);

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
        root: scrollableParent,
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
