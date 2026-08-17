import { getPostById } from "./hn";

/** Ingest-only HN title lookup. Never call this from the activity feed render path. */
export async function lookupHnStoryTitle(id: string): Promise<string | null> {
  try {
    const post = await getPostById(id, false);
    const title = post?.title?.trim();
    return title || null;
  } catch {
    return null;
  }
}
