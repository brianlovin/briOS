"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { InfiniteScrollList } from "@/components/InfiniteScrollList";
import { useListNavigation } from "@/hooks/useListNavigation";
import { NotionAmaItem } from "@/lib/notion";
import { cn } from "@/lib/utils";

interface AmaListProps {
  initialQuestions: NotionAmaItem[];
  initialCursor: string | null;
}

export function AmaList({ initialQuestions, initialCursor }: AmaListProps) {
  const pathname = usePathname();
  const [questions, setQuestions] = useState<NotionAmaItem[]>(initialQuestions);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const currentId = pathname.split("/").pop();
  const currentIndex = useMemo(
    () => questions.findIndex((q) => q.id === currentId),
    [questions, currentId],
  );

  useListNavigation(questions, currentIndex, (item) => `/ama/${item.id}`);

  const handleLoadMore = useCallback(async () => {
    if (!cursor || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/ama?cursor=${cursor}&limit=20`);
      const data = await response.json();
      setQuestions((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
    } catch (error) {
      console.error("Error loading more questions:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursor, isLoadingMore]);

  const renderQuestion = useCallback(
    (item: NotionAmaItem) => {
      const date = item.answeredAt
        ? new Date(item.answeredAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : undefined;
      const isSelected = item.id === currentId;
      return (
        <li key={item.id} data-id={item.id}>
          <Link
            className={cn(
              "hover:bg-tertiary flex flex-col gap-0.5 rounded-md px-3.5 py-3 text-sm",
              {
                "bg-tertiary": isSelected,
              },
            )}
            href={`/ama/${item.id}`}
          >
            <span className="text-primary line-clamp-3 font-medium">{item.title}</span>
            {date && <span className="text-quaternary text-sm">{date}</span>}
          </Link>
        </li>
      );
    },
    [currentId],
  );

  return (
    <InfiniteScrollList
      items={questions}
      renderItem={renderQuestion}
      onLoadMore={handleLoadMore}
      isLoading={false}
      isLoadingMore={isLoadingMore}
      isReachingEnd={!cursor}
    />
  );
}
