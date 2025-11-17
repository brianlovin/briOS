"use client";

import { useEffect, useRef } from "react";

export function useScrollToSelected(
  currentId: string | undefined,
  currentIndex: number,
  dataAttribute: string = "data-id",
) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current && currentIndex !== -1 && currentId) {
      const el = listRef.current.querySelector(`[${dataAttribute}="${currentId}"]`);
      if (el) {
        (el as HTMLElement).scrollIntoView({ block: "nearest" });
      }
    }
  }, [currentIndex, currentId, dataAttribute]);

  return listRef;
}
