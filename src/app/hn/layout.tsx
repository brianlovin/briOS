"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Suspense, useMemo } from "react";

import { ListDetailLayout } from "@/components/ListDetailLayout";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";
import { useListNavigation } from "@/hooks/useListNavigation";
import { useHNPosts } from "@/lib/hooks/useHn";
import { cn } from "@/lib/utils";
import { HackerNewsPost } from "@/types/hackernews";

import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { HNPostsProvider, useHNPostsContext } from "./HNPostsContext";

export default function HNLayout({ children }: { children: React.ReactNode }) {
  const { data: posts, isLoading, isError } = useHNPosts();

  return (
    <Suspense>
      <HNPostsProvider posts={posts} isLoading={isLoading} isError={isError}>
        <ListDetailWrapper>
          <ListDetailLayout backHref="/hn" list={<HNStoriesList />}>
            {children}
          </ListDetailLayout>
        </ListDetailWrapper>
      </HNPostsProvider>
    </Suspense>
  );
}

function HNStoriesList() {
  const pathname = usePathname();
  const { posts, isLoading, isError } = useHNPostsContext();

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

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || (validPosts.length === 0 && !isLoading)) {
    return (
      <div className="text-quaternary flex flex-1 items-center justify-center">
        Unable to load stories
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-0.5 md:p-3">
      {validPosts.map((post) => {
        const isSelected = post.id.toString() === currentPostId;
        return (
          <li key={post.id} data-id={post.id} className="scroll-my-3">
            <Link
              className={cn(
                "hover:bg-tertiary border-secondary dark:hover:bg-secondary dark:hover:shadow-contrast flex flex-col gap-0.5 border-b px-3.5 py-3 md:rounded-lg md:border-b-0",
                {
                  "bg-tertiary dark:bg-secondary dark:shadow-contrast": isSelected,
                },
              )}
              href={`/hn/${post.id}`}
            >
              <span className="text-primary line-clamp-2 font-medium">{post.title}</span>
              {post.domain && <span className="text-quaternary">{post.domain}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
