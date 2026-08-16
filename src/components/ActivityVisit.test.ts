import { describe, expect, mock, test } from "bun:test";

import { activityVisitStorageKey, runActivityVisitEffect } from "@/components/ActivityVisit";

type VisitStorage = Pick<Storage, "getItem" | "setItem">;

function memoryStorage(initial: Record<string, string> = {}): VisitStorage {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

function mockFetch() {
  return mock((input: string, init?: RequestInit) => {
    if (init?.signal?.aborted) {
      return Promise.reject(new DOMException("Aborted", "AbortError"));
    }
    return Promise.resolve(new Response(JSON.stringify({ ok: true })));
  });
}

describe("ActivityVisit", () => {
  test("two effect runs for the same path post once", () => {
    const fetchImpl = mockFetch();
    const postedPathRef = { current: null as string | null };
    const storage = memoryStorage();

    const cleanup = runActivityVisitEffect({
      pathname: "/writing",
      title: "Writing | Brian Lovin",
      postedPathRef,
      fetchImpl,
      storage,
    });
    cleanup?.();

    runActivityVisitEffect({
      pathname: "/writing",
      title: "Writing | Brian Lovin",
      postedPathRef,
      fetchImpl,
      storage,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0]?.[0]).toBe("/api/activity/visit");
    expect(fetchImpl.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/writing", title: "Writing | Brian Lovin" }),
      }),
    );
  });

  test("skips /activity via shouldRecordVisit", () => {
    const fetchImpl = mockFetch();

    runActivityVisitEffect({
      pathname: "/activity",
      title: "Activity | Brian Lovin",
      postedPathRef: { current: null },
      fetchImpl,
      storage: memoryStorage(),
    });

    expect(fetchImpl).toHaveBeenCalledTimes(0);
  });

  test("a remount after the first POST completed no-ops via sessionStorage", async () => {
    const fetchImpl = mockFetch();
    const storage = memoryStorage();

    runActivityVisitEffect({
      pathname: "/til",
      title: "Today I Learned",
      postedPathRef: { current: null },
      fetchImpl,
      storage,
    });

    await Promise.resolve();

    runActivityVisitEffect({
      pathname: "/til",
      title: "Today I Learned",
      postedPathRef: { current: null },
      fetchImpl,
      storage,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(storage.getItem(activityVisitStorageKey("/til"))).toBe("1");
  });

  test("ignores a completed visit for a different pathname", () => {
    const fetchImpl = mockFetch();
    const postedPathRef = { current: null as string | null };
    const storage = memoryStorage({
      [activityVisitStorageKey("/writing")]: "1",
    });

    runActivityVisitEffect({
      pathname: "/til",
      title: "Today I Learned",
      postedPathRef,
      fetchImpl,
      storage,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({
        body: JSON.stringify({ path: "/til", title: "Today I Learned" }),
      }),
    );
  });
});
