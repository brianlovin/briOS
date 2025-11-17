"use client";

import { useAtom } from "jotai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import React, { useMemo, useRef } from "react";

import { hnSubscribedAtom } from "@/atoms/hnSubscription";
import { ListDetailLayout } from "@/components/ListDetailLayout";
import { useListNavigation } from "@/hooks/useListNavigation";
import { useHNPosts } from "@/lib/hooks/useHn";
import { cn } from "@/lib/utils";
import { HackerNewsPost } from "@/types/hackernews";

import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { HNPostsProvider, useHNPostsContext } from "./HNPostsContext";
import { SubscribeDialog } from "./SubscribeDialog";

export default function HNLayout({ children }: { children: React.ReactNode }) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Fetch posts at layout level to share with children
  const { data: posts, isLoading, isError } = useHNPosts();
  const [hnSubscribed] = useAtom(hnSubscribedAtom);

  return (
    <HNPostsProvider posts={posts} isLoading={isLoading} isError={isError}>
      <ListDetailLayout
        title="Hacker News"
        backHref="/hn"
        list={<HNStoriesList />}
        headerChildren={
          <>
            <div className="text-quaternary hidden text-sm sm:flex">{formattedDate}</div>
            {!hnSubscribed && <SubscribeDialog />}
          </>
        }
      >
        {children}
      </ListDetailLayout>
    </HNPostsProvider>
  );
}

function HNStoriesList() {
  const pathname = usePathname();
  const { posts, isLoading, isError } = useHNPostsContext();
  const listRef = useRef<HTMLUListElement>(null);

  // Filter out null posts
  const validPosts = useMemo(
    () => posts?.filter((post): post is HackerNewsPost => post !== null) ?? [],
    [posts],
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

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || (validPosts.length === 0 && !isLoading)) {
    return (
      <div className="text-quaternary flex flex-1 items-center justify-center text-sm">
        Unable to load stories
      </div>
    );
  }

  return (
    <ul ref={listRef} className="flex h-full flex-col gap-px overflow-y-auto p-1">
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
