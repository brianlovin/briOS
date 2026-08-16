"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

import { shouldRecordVisit } from "@/lib/activity-shared";

export function activityVisitStorageKey(pathname: string): string {
  return `activity:visit:${pathname}`;
}

type VisitStorage = Pick<Storage, "getItem" | "setItem">;
type VisitFetch = (input: string, init?: RequestInit) => Promise<unknown>;

function readVisitStorage(): VisitStorage | null {
  try {
    if (typeof sessionStorage === "undefined") return null;
    return sessionStorage;
  } catch {
    return null;
  }
}

function hasCompletedVisit(pathname: string, storage: VisitStorage | null): boolean {
  if (!storage) return false;
  try {
    return storage.getItem(activityVisitStorageKey(pathname)) != null;
  } catch {
    return false;
  }
}

function markCompletedVisit(pathname: string, storage: VisitStorage | null): void {
  if (!storage) return;
  try {
    storage.setItem(activityVisitStorageKey(pathname), "1");
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function runActivityVisitEffect(input: {
  pathname: string | null;
  title: string;
  postedPathRef: { current: string | null };
  fetchImpl?: VisitFetch;
  storage?: VisitStorage | null;
}): (() => void) | undefined {
  const { pathname, title, postedPathRef } = input;
  if (!pathname || !shouldRecordVisit(pathname)) return;
  if (postedPathRef.current === pathname) return;

  const storage = input.storage === undefined ? readVisitStorage() : input.storage;
  if (hasCompletedVisit(pathname, storage)) {
    postedPathRef.current = pathname;
    return;
  }

  postedPathRef.current = pathname;
  const controller = new AbortController();
  const fetchImpl = input.fetchImpl ?? fetch;

  void fetchImpl("/api/activity/visit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: pathname, title }),
    signal: controller.signal,
  })
    .then(() => {
      markCompletedVisit(pathname, storage);
    })
    .catch(() => {});

  return () => {
    controller.abort();
  };
}

function TrackVisit() {
  const pathname = usePathname();
  const postedPathRef = useRef<string | null>(null);

  useEffect(() => {
    return runActivityVisitEffect({
      pathname,
      title: document.title,
      postedPathRef,
    });
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
