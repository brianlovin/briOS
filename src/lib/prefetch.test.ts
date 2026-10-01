import { afterEach, describe, expect, test } from "bun:test";
import { preload } from "swr";

import { prefetch } from "@/lib/prefetch";

function waitForEventLoop() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

describe("prefetch", () => {
  let onUnhandled: ((reason: unknown) => void) | undefined;

  afterEach(() => {
    if (onUnhandled) {
      process.off("unhandledRejection", onUnhandled);
      onUnhandled = undefined;
    }
  });

  test("settles a failed preload so it is not an unhandled rejection", async () => {
    const unhandled: unknown[] = [];
    onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on("unhandledRejection", onUnhandled);

    prefetch(`/api/computer/prefetch-fail-${Date.now()}`, () =>
      Promise.reject(new Error("HTTP error! status: 504")),
    );

    await waitForEventLoop();

    expect(unhandled).toEqual([]);
  });

  test("settles a network-style preload failure", async () => {
    const unhandled: unknown[] = [];
    onUnhandled = (reason: unknown) => {
      unhandled.push(reason);
    };
    process.on("unhandledRejection", onUnhandled);

    prefetch(`/api/hn/prefetch-fail-${Date.now()}`, () =>
      Promise.reject(new TypeError("Failed to fetch")),
    );

    await waitForEventLoop();

    expect(unhandled).toEqual([]);
  });

  test("does not throw when the fetcher succeeds", () => {
    expect(() =>
      prefetch(`/api/ama/prefetch-ok-${Date.now()}`, async () => ({ ok: true })),
    ).not.toThrow();
  });

  test("keeps the rejected preload so a later SWR subscriber still sees the error", async () => {
    const key = `/api/computer/prefetch-cached-${Date.now()}`;
    const error = new Error("HTTP error! status: 504");

    prefetch(key, () => Promise.reject(error));

    await expect(preload(key, async () => ({ unused: true }))).rejects.toThrow(
      "HTTP error! status: 504",
    );
  });
});
