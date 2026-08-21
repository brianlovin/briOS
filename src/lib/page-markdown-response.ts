import type { MarkdownResult } from "@/lib/page-markdown";

export function markdownResponse(result: MarkdownResult): Response {
  return new Response(result.body, {
    status: result.status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control": "s-maxage=60, stale-while-revalidate=86400",
    },
  });
}
