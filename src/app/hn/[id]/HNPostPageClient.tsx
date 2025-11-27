"use client";

import DOMPurify from "dompurify";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useParams } from "next/navigation";
import { memo, useEffect, useMemo, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { hnSubscribedAtom } from "@/atoms/hnSubscription";
import { ArrowDown } from "@/components/icons/ArrowDown";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import { PageTitle } from "@/components/Typography";
import { FancySeparator } from "@/components/ui/FancySeparator";
import { IconButton } from "@/components/ui/IconButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useHNPost } from "@/lib/hooks/useHn";
import { stripHtmlTags } from "@/lib/utils";
import { HackerNewsComment } from "@/types/hackernews";

import { HNDigestCard } from "../HNDigestCard";
import { useHNPostsContext } from "../HNPostsContext";

// Sanitize HTML content from external sources (Hacker News)
function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "a", "code", "pre", "em", "strong", "i", "b", "br"],
    ALLOWED_ATTR: ["href", "rel", "target"],
  });
}

export default function HNPostPageClient() {
  const { id } = useParams();
  const { posts } = useHNPostsContext();
  const isSubscribed = useAtomValue(hnSubscribedAtom);

  // Find current post from the list to use as fallback
  const fallbackPost = useMemo(
    () => posts?.find((p) => p?.id.toString() === id) ?? null,
    [posts, id],
  );

  const { post, isLoading, isError } = useHNPost(id as string, fallbackPost);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef(null);

  // Update document title when post is available
  useEffect(() => {
    if (post?.title) {
      const cleanTitle = stripHtmlTags(post.title);
      document.title = `${cleanTitle} | Brian Lovin`;
    }
  }, [post?.title]);

  // Extract level 0 comments for navigation
  const levelZeroComments =
    post?.comments?.filter((comment: HackerNewsComment) => comment.level === 0) || [];

  // Comment navigation logic
  const getCommentElement = (commentId: string) => {
    return document.getElementById(commentId);
  };

  const findNextComment = () => {
    const container = scrollContainerRef.current?.closest("[data-scrollable]");
    const containerTop = container ? container.getBoundingClientRect().top : 0;
    // Threshold needs to account for scroll-mt-4 (16px) plus a small buffer
    const threshold = containerTop + 20;

    for (const comment of levelZeroComments) {
      if (!comment?.id) continue;
      const element = getCommentElement(String(comment.id));
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      if (rect.top > threshold) {
        return element;
      }
    }
    return null;
  };

  const findPreviousComment = () => {
    const container = scrollContainerRef.current?.closest("[data-scrollable]");
    const containerTop = container ? container.getBoundingClientRect().top : 0;
    // Threshold needs to account for scroll-mt-4 (16px) plus a small buffer
    const threshold = containerTop - 20;

    let bestCandidate = null;
    for (const comment of levelZeroComments) {
      if (!comment?.id) continue;
      const element = getCommentElement(String(comment.id));
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      if (rect.top < threshold) {
        bestCandidate = element;
      } else {
        break;
      }
    }
    return bestCandidate;
  };

  const scrollToNextComment = () => {
    const nextElement = findNextComment();
    if (nextElement) {
      nextElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToPreviousComment = () => {
    const previousElement = findPreviousComment();
    if (previousElement) {
      previousElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useHotkeys("alt+j", scrollToNextComment, {
    enabled: levelZeroComments.length > 0,
    preventDefault: true,
    description: "Scroll to next root comment",
  });

  useHotkeys("alt+k", scrollToPreviousComment, {
    enabled: levelZeroComments.length > 0,
    preventDefault: true,
    description: "Scroll to previous root comment",
  });

  if (isLoading)
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  if (!post || isError) return <p>not found</p>;

  return (
    <>
      <div ref={scrollContainerRef} className="relative flex flex-col px-4 md:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col">
          <div className="flex flex-col gap-4 py-8 md:py-12">
            <Link
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-3xl font-semibold xl:text-4xl"
            >
              <PageTitle ref={titleRef}>{post.title}</PageTitle>
            </Link>
            {post.url && (
              <Link
                href={post.url}
                target="_blank"
                className="text-tertiary hover:text-primary flex items-center gap-1 self-start"
              >
                <span>{post.domain}</span>
                <ArrowUpRight size={16} />
              </Link>
            )}

            <HNDigestCard className="mt-8" />

            {post.content && (
              <div
                className="comment prose-lg max-w-full"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
              />
            )}
          </div>

          <FancySeparator />

          {post?.comments && !!post.comments.length && (
            <div className="relative flex flex-1 flex-col pt-8 md:pt-12">
              <PostComments comments={post.comments} />
            </div>
          )}

          {!isSubscribed && post?.comments && !!post.comments.length && (
            <div className="pt-8 md:pt-12">
              <FancySeparator />
              <HNDigestCard className="mt-8" />
            </div>
          )}
        </div>

        {/* Floating navigation button */}
        {levelZeroComments.length > 1 && (
          <div className="pointer-events-none sticky bottom-0 -mx-4 flex justify-end p-4">
            <IconButton
              size="lg"
              variant="default"
              onClick={scrollToNextComment}
              className="pointer-events-auto size-12 rounded-full"
              aria-label="Next comment"
            >
              <ArrowDown strokeWidth={2} size={24} />
            </IconButton>
          </div>
        )}
      </div>
    </>
  );
}

export function PostComments({ comments }: { comments: HackerNewsComment[] }) {
  return (
    <div className="relative flex flex-1 flex-col gap-10">
      <div className="flex w-full flex-1 flex-col gap-10">
        {comments &&
          comments.length > 0 &&
          comments.map((comment) => <PostComment key={comment.id} comment={comment} />)}
        {comments && comments.length === 0 && (
          <p className="text-quaternary italic">No comments yet...</p>
        )}
      </div>
    </div>
  );
}

function LevelZeroComment({ comment }: { comment: HackerNewsComment }) {
  return (
    <div>
      <a
        className="inline-block scroll-mt-4 font-normal"
        id={comment.id ? String(comment.id) : ""}
        href={comment.id ? `#${comment.id}` : "#"}
      >
        <p className="text-quaternary font-mono text-[15px]">{`${comment.user}`}</p>
      </a>
      <div
        className={"comment prose-lg max-w-full pt-1"}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.content ?? "") }}
      />
      {comment.comments &&
        comment.comments.length > 0 &&
        comment.comments.map((comment) => <PostComment comment={comment} key={comment.id} />)}
    </div>
  );
}

function ChildComment({ comment }: { comment: HackerNewsComment }) {
  let color;
  switch (comment.level) {
    case 2: {
      color = "border-neutral-200 dark:border-neutral-700";
      break;
    }
    case 3: {
      color = "border-neutral-100 dark:border-neutral-800";
      break;
    }
    default: {
      color = "border-neutral-300 dark:border-neutral-600";
    }
  }

  return (
    <div className={`border-l-2 ${color} mt-4 flex shrink flex-col pl-4`}>
      <a
        className="inline-block scroll-mt-4 font-normal"
        id={comment.id ? String(comment.id) : ""}
        href={comment.id ? `#${comment.id}` : "#"}
      >
        <p className="text-quaternary font-mono">{`${comment.user}`}</p>
      </a>
      <div
        className={"prose-lg max-w-full pt-1"}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.content ?? "") }}
      />
      {comment.comments &&
        comment.comments.length > 0 &&
        comment.comments.map((comment) => <PostComment comment={comment} key={comment.id} />)}
    </div>
  );
}
export const PostComment = memo((props: { comment: HackerNewsComment }) => {
  const { comment } = props;

  if (!comment) return null;

  const { level } = comment;

  if (level === 0) {
    return <LevelZeroComment comment={comment} />;
  } else {
    return <ChildComment comment={comment} />;
  }
});

PostComment.displayName = "PostComment";

export function timestampToCleanTime({
  timestamp = 0,
  locale = "en-us",
  year = "numeric",
  month = "long",
  day = "numeric",
}: {
  timestamp?: number | string;
  locale?: string;
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
}) {
  const date = timestamp ? new Date(timestamp) : new Date();

  const formatted = date.toLocaleDateString(locale, {
    year,
    month,
    day,
  });

  const raw = date.toISOString();

  return {
    formatted,
    raw,
  };
}
