import { describe, expect, test } from "bun:test";

import { prefetch } from "@/lib/prefetch";

describe("prefetch", () => {
  test("settles a failed preload so it is not an unhandled rejection", async () => {
    const result = await runInBrowser(`
      const unhandled = [];
      process.on("unhandledRejection", (reason) => unhandled.push(String(reason)));
      let calls = 0;
      prefetch("/api/computer/prefetch-fail", () => {
        calls += 1;
        return Promise.reject(new Error("HTTP error! status: 504"));
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
      return { unhandled, calls };
    `);

    expect(result).toEqual({ unhandled: [], calls: 1 });
  });

  test("settles a network-style preload failure", async () => {
    const result = await runInBrowser(`
      const unhandled = [];
      process.on("unhandledRejection", (reason) => unhandled.push(String(reason)));
      let calls = 0;
      prefetch("/api/hn/prefetch-fail", () => {
        calls += 1;
        return Promise.reject(new TypeError("Failed to fetch"));
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
      return { unhandled, calls };
    `);

    expect(result).toEqual({ unhandled: [], calls: 1 });
  });

  test("does not throw when the fetcher succeeds", () => {
    expect(() =>
      prefetch(`/api/ama/prefetch-ok-${Date.now()}`, async () => ({ ok: true })),
    ).not.toThrow();
  });

  test("keeps the rejected preload so a later SWR subscriber still sees the error", async () => {
    const result = await runInBrowser(`
      prefetch("/api/computer/prefetch-cached", () =>
        Promise.reject(new Error("HTTP error! status: 504")),
      );
      try {
        await preload("/api/computer/prefetch-cached", async () => ({ unused: true }));
        return { error: null };
      } catch (error) {
        return { error: error.message };
      }
    `);

    expect(result).toEqual({ error: "HTTP error! status: 504" });
  });

  test("reuses a successful prefetch without fetching again", async () => {
    const result = await runInBrowser(`
      let calls = 0;
      const fetcher = async () => {
        calls += 1;
        return { ok: true };
      };
      prefetch("/api/computer/prefetch-reuse", fetcher);
      const value = await preload("/api/computer/prefetch-reuse", fetcher);
      return { value, calls };
    `);

    expect(result).toEqual({ value: { ok: true }, calls: 1 });
  });
});

/**
 * SWR only caches preloads in the browser and decides that once, when the module
 * loads. Test files share one module registry, so run in a fresh process with
 * `window` defined before SWR is imported.
 */
async function runInBrowser(body: string): Promise<unknown> {
  const script = `
    globalThis.window = globalThis;
    const { preload } = await import("swr");
    const { prefetch } = await import(${JSON.stringify(`${import.meta.dir}/prefetch.ts`)});
    const result = await (async () => { ${body} })();
    console.log(JSON.stringify(result));
  `;
  const proc = Bun.spawn([process.execPath, "-e", script], { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  if (exitCode !== 0) throw new Error(stderr);
  return JSON.parse(stdout);
}
