/**
 * Read a fetch response body with a hard byte cap. Rejects early from
 * Content-Length when the server declares an oversized body, and otherwise
 * aborts mid-stream as soon as the cap is crossed, so a large or endless
 * response cannot exhaust function memory.
 */
export async function readBodyWithLimit(response: Response, maxBytes: number): Promise<Buffer> {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) {
    await response.body?.cancel().catch(() => {});
    throw new Error(`Response too large: ${declared} bytes (limit ${maxBytes})`);
  }

  if (!response.body) return Buffer.alloc(0);

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => {});
      throw new Error(`Response exceeded ${maxBytes} bytes`);
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks, total);
}

/** `fetch` with a wall-clock timeout. */
export function fetchWithTimeout(
  url: string,
  timeoutMs: number,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
}
