import { cacheLife, cacheTag } from "next/cache";

import { markdownCacheTagsForPath, renderPageMarkdown } from "@/lib/page-markdown";
import { markdownResponse } from "@/lib/page-markdown-response";

async function getCachedMarkdown(pathname: string) {
  "use cache";
  cacheLife("days");
  for (const tag of markdownCacheTagsForPath(pathname)) {
    cacheTag(tag);
  }
  return renderPageMarkdown(pathname);
}

function pathnameFromSlug(slug?: string[]): string {
  if (!slug || slug.length === 0) return "/";
  return `/${slug.join("/")}`;
}

export async function GET(_request: Request, context: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await context.params;
  const pathname = pathnameFromSlug(slug);
  const result = await getCachedMarkdown(pathname);
  return markdownResponse(result);
}
