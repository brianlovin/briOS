import { computerSlugRedirect } from "@/lib/computer";
import {
  getComputerDatabaseItems,
  getWritingDatabaseItems,
  isPlaceholderNotionBuild,
  type NotionComputerItem,
  type NotionWritingItem,
} from "@/lib/notion";
import { isNotionPageIdParam, normalizeNotionId } from "@/lib/notion/computer";
import { buildSlug, extractShortIdFromSlug } from "@/lib/short-id";

const DETAIL_PATH = /^\/(writing|computer)\/([^/.]+)$/;

/**
 * Canonical path for a legacy writing slug, or null when the slug already
 * resolves by Short ID (including a stale title before the ID) or matches nothing.
 */
export function writingCanonicalPath(
  slug: string,
  posts: Pick<NotionWritingItem, "slug" | "title" | "shortId">[],
): string | null {
  const shortId = extractShortIdFromSlug(slug);
  if (shortId && posts.some((post) => post.shortId === shortId)) return null;

  const legacy = posts.find((post) => post.slug === slug && post.shortId);
  if (!legacy?.shortId) return null;

  const canonical = buildSlug(legacy.title, legacy.shortId);
  return canonical === slug ? null : `/writing/${canonical}`;
}

/**
 * Canonical path for a computer tip slug that uses an outdated title or a
 * Notion page ID, or null when the slug is already canonical or matches nothing.
 */
export function computerCanonicalPath(
  slug: string,
  tips: Pick<NotionComputerItem, "id" | "title" | "shortId">[],
): string | null {
  const shortId = extractShortIdFromSlug(slug);
  let tip = shortId ? tips.find((item) => item.shortId === shortId) : undefined;
  if (!tip && isNotionPageIdParam(slug)) {
    const id = normalizeNotionId(slug);
    tip = tips.find((item) => normalizeNotionId(item.id) === id);
  }
  if (!tip) return null;

  const canonical = computerSlugRedirect(slug, tip);
  return canonical ? `/computer/${canonical}` : null;
}

async function getAllWritingPosts(): Promise<NotionWritingItem[]> {
  const posts: NotionWritingItem[] = [];
  let cursor: string | undefined;
  do {
    const { items, nextCursor } = await getWritingDatabaseItems(cursor, 100);
    posts.push(...items);
    cursor = nextCursor ?? undefined;
  } while (cursor);
  return posts;
}

/**
 * Resolves a non-canonical writing or computer detail URL to its canonical
 * path. Runs in the proxy so the redirect is a real HTTP response: under
 * Partial Prerendering, `redirect()` in the page streams after the shell and
 * becomes a client-side navigation.
 */
export async function resolveCanonicalRedirect(pathname: string): Promise<string | null> {
  const match = pathname.match(DETAIL_PATH);
  if (!match || isPlaceholderNotionBuild()) return null;

  const [, section, rawSlug] = match;
  let slug: string;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    return null;
  }

  if (section === "writing") {
    return writingCanonicalPath(slug, await getAllWritingPosts());
  }
  return computerCanonicalPath(slug, await getComputerDatabaseItems());
}
