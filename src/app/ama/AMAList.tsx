"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

import { InfiniteScrollList } from "@/components/InfiniteScrollList";
import { useListNavigation } from "@/hooks/useListNavigation";
import { cn } from "@/lib/utils";

import { useAMAQuestionsContext } from "./AMAContext";

export function AmaList() {
  const pathname = usePathname();
  const { questions, setSize, size, isReachingEnd, isLoading, isLoadingMore } =
    useAMAQuestionsContext();

  const currentId = pathname.split("/").pop();
  const currentIndex = useMemo(
    () => questions.findIndex((q) => q.id === currentId),
    [questions, currentId],
  );

  useListNavigation(questions, currentIndex, (item) => `/ama/${item.id}`);

  const handleLoadMore = useCallback(async () => {
    await setSize(size + 1);
  }, [setSize, size]);

  const renderQuestion = useCallback(
    (item: (typeof questions)[0]) => {
      const date = item.answeredAt
        ? new Date(item.answeredAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : undefined;
      const isSelected = item.id === currentId;
      return (
        <li key={item.id} data-id={item.id} className="scroll-my-2">
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
      isLoading={isLoading || false}
      isLoadingMore={isLoadingMore || false}
      isReachingEnd={isReachingEnd || false}
    />
  );
}
