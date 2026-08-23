import {
  getComputerTipByShortId,
  getTilByShortId,
  getWritingPostByShortId,
  getWritingPostContentBySlug,
} from "./notion";
import { extractShortIdFromSlug } from "./short-id";

/**
 * Ingest-only writing/TIL/computer title lookup. Uses the same Notion helpers
 * as the post pages. Never call this from the activity feed render path.
 */
export async function lookupCmsPostTitle(
  kind: "writing" | "til" | "computer",
  slug: string,
): Promise<string | null> {
  try {
    if (kind === "writing") {
      const shortId = extractShortIdFromSlug(slug);
      let content = shortId ? await getWritingPostByShortId(shortId) : null;
      if (!content) {
        content = await getWritingPostContentBySlug(slug);
      }
      const title = content?.metadata.title?.trim();
      return title || null;
    }

    const shortId = extractShortIdFromSlug(slug);
    if (!shortId) return null;

    if (kind === "computer") {
      const content = await getComputerTipByShortId(shortId);
      const title = content?.title?.trim();
      return title || null;
    }

    const content = await getTilByShortId(shortId);
    const title = content?.title?.trim();
    return title || null;
  } catch {
    return null;
  }
}
