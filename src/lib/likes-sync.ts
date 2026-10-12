import { APIErrorCode, APIResponseError, isFullPage } from "@notionhq/client";

import { notion } from "@/lib/notion/client";

export const LIKES_PROPERTY = "Likes";

export type LikesSyncOutcome =
  | { status: "synced" }
  | { status: "unchanged" }
  | { status: "skipped"; reason: "no_likes_property" | "page_not_found" | "archived" }
  | { status: "failed"; error: unknown };

type PageProperties = Record<string, { type: string; number?: number | null }>;

/**
 * Mirror one Redis like count onto its Notion page.
 *
 * Likes are keyed by page ID across every likeable content type, and a content
 * database can be likeable before it has a numeric `Likes` column. The page is
 * read first and skipped when the property is missing instead of throwing a
 * validation error.
 */
export async function syncPageLikes(pageId: string, count: number): Promise<LikesSyncOutcome> {
  let properties: PageProperties;
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    if (!isFullPage(page)) return { status: "skipped", reason: "page_not_found" };
    if (page.in_trash) return { status: "skipped", reason: "archived" };
    properties = page.properties as PageProperties;
  } catch (error) {
    if (APIResponseError.isAPIResponseError(error) && error.code === APIErrorCode.ObjectNotFound) {
      return { status: "skipped", reason: "page_not_found" };
    }
    return { status: "failed", error };
  }

  const likes = properties[LIKES_PROPERTY];
  if (likes?.type !== "number") return { status: "skipped", reason: "no_likes_property" };
  if (likes.number === count) return { status: "unchanged" };

  try {
    await notion.pages.update({
      page_id: pageId,
      properties: { [LIKES_PROPERTY]: { number: count } },
    });
    return { status: "synced" };
  } catch (error) {
    return { status: "failed", error };
  }
}
