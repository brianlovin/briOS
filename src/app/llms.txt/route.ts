import { llmsTxtBody } from "@/lib/site-copy";

export function GET() {
  return new Response(llmsTxtBody(), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
