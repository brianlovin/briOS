"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

import { useListNavigation } from "@/hooks/useListNavigation";
import { cn } from "@/lib/utils";
import { HackerNewsPost } from "@/types/hackernews";

interface HNStoriesListClientProps {
  initialPosts: (HackerNewsPost | null)[];
}

export function HNStoriesListClient({ initialPosts }: HNStoriesListClientProps) {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);

  // Filter out null posts
  const validPosts = useMemo(
    () => initialPosts.filter((post): post is HackerNewsPost => post !== null),
    [initialPosts],
  );

  // Get current post ID from URL and find its index
  const currentPostId = pathname.split("/").pop();
  const currentIndex = useMemo(
    () => validPosts.findIndex((post) => post.id.toString() === currentPostId),
    [validPosts, currentPostId],
  );

  useListNavigation(validPosts, currentIndex, (item) => `/hn/${item.id}`);

  // Scroll to keep selected item visible
  useEffect(() => {
    if (listRef.current && currentIndex !== -1) {
      const selectedElement = listRef.current.querySelector(`[data-post-id="${currentPostId}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [currentIndex, currentPostId]);

  if (validPosts.length === 0) {
    return (
      <div className="text-quaternary flex flex-1 items-center justify-center text-sm">
        Unable to load stories
      </div>
    );
  }

  return (
    <ul ref={listRef} className="flex h-full flex-col gap-px overflow-y-auto p-2">
      {validPosts.map((post) => {
        const isSelected = post.id.toString() === currentPostId;
        return (
          <li key={post.id} data-post-id={post.id}>
            <Link
              className={cn(
                "hover:bg-tertiary flex flex-col gap-0.5 rounded-md px-3.5 py-3 text-sm",
                {
                  "bg-tertiary": isSelected,
                },
              )}
              href={`/hn/${post.id}`}
            >
              <span className="text-primary line-clamp-2 font-medium">{post.title}</span>
              <span className="text-quaternary">{post.domain || "No domain"}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
