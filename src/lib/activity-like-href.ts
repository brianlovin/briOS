import { isAbsoluteHttpUrl, isSameSitePath } from "./activity-shared";
import { getGoodWebsitesDatabaseItems, getStackDatabaseItems } from "./notion/queries";

type LinkedItem = { id: string; url?: string | null };

export type LikeHrefDeps = {
  listExternalItems: () => Promise<LinkedItem[]>;
};

const defaultDeps: LikeHrefDeps = {
  listExternalItems: async () => {
    const [stack, sites] = await Promise.all([
      getStackDatabaseItems(),
      getGoodWebsitesDatabaseItems(),
    ]);
    return [...stack, ...sites];
  },
};

function normalizeId(id: string): string {
  return id.replace(/-/g, "").toLowerCase();
}

/**
 * Decide which href an anonymous like may publish to the public activity feed.
 *
 * - Same-site paths (`/writing/foo`) pass through unchanged.
 * - Absolute URLs are never taken from the client. They are replaced with the
 *   URL of the liked Stack or Good Websites item, looked up by page id. That
 *   URL comes from owner-authored Notion content.
 * - Anything else, or an absolute URL with no matching item, returns null and
 *   the like is not recorded in the feed.
 */
export async function resolveTrustedLikeHref(
  pageId: string,
  href: string,
  deps: LikeHrefDeps = defaultDeps,
): Promise<string | null> {
  const trimmed = href.trim();
  if (isSameSitePath(trimmed)) return trimmed;
  if (!isAbsoluteHttpUrl(trimmed)) return null;

  const wanted = normalizeId(pageId);
  const items = await deps.listExternalItems();
  const item = items.find((candidate) => normalizeId(candidate.id) === wanted);
  const ownerUrl = item?.url?.trim();
  return ownerUrl && isAbsoluteHttpUrl(ownerUrl) ? ownerUrl : null;
}
