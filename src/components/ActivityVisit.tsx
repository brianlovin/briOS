"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";

import { shouldRecordVisit } from "@/lib/activity-shared";

function TrackVisit() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !shouldRecordVisit(pathname)) return;

    void fetch("/api/activity/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}

export function ActivityVisit() {
  return (
    <Suspense fallback={null}>
      <TrackVisit />
    </Suspense>
  );
}
