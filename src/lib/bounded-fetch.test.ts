import { describe, expect, test } from "bun:test";

import { readBodyWithLimit } from "@/lib/bounded-fetch";

function streamOf(chunks: number[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const size of chunks) controller.enqueue(new Uint8Array(size));
      controller.close();
    },
  });
}

describe("readBodyWithLimit", () => {
  test("returns the body when it fits", async () => {
    const body = await readBodyWithLimit(new Response(streamOf([3, 4])), 10);
    expect(body.length).toBe(7);
  });

  test("rejects a declared Content-Length over the cap without reading", async () => {
    const response = new Response("x".repeat(20), { headers: { "content-length": "20" } });
    await expect(readBodyWithLimit(response, 10)).rejects.toThrow("too large");
  });

  test("aborts a stream that crosses the cap without a Content-Length", async () => {
    await expect(readBodyWithLimit(new Response(streamOf([6, 6, 6])), 10)).rejects.toThrow(
      "exceeded",
    );
  });
});
