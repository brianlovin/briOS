import { cache } from "react";

import {
  getComputerDatabaseItems,
  getComputerItemContent,
  getComputerTipByShortId,
  type NotionComputerItem,
  type NotionComputerItemWithContent,
} from "@/lib/notion";
import { isNotionPageIdParam } from "@/lib/notion/computer";
import { buildSlug, extractShortIdFromSlug } from "@/lib/short-id";

export const COMPUTER_TITLE = "How to Computer Better";

export const COMPUTER_INTRO =
  "This is a living list of tips to use computers better: shortcuts, hotkeys, utility apps, helpful workflows, and so on.";

export type ComputerTip = NotionComputerItem;

async function fetchAllComputerTips(): Promise<ComputerTip[]> {
  return getComputerDatabaseItems();
}

export const getComputerTips = cache(fetchAllComputerTips);

export function publicComputerTips(items: ComputerTip[]): Array<ComputerTip & { shortId: string }> {
  return items.filter((item): item is ComputerTip & { shortId: string } => Boolean(item.shortId));
}

export function computerTipLink(item: Pick<ComputerTip, "id" | "title" | "shortId">) {
  if (!item.shortId) return null;
  const slug = buildSlug(item.title, item.shortId);
  return {
    id: item.id,
    title: item.title,
    slug,
    href: `/computer/${slug}`,
  };
}

export function computerTipLinks(items: ComputerTip[]) {
  return publicComputerTips(items)
    .map((item) => computerTipLink(item))
    .filter((link): link is NonNullable<typeof link> => link !== null);
}

export function computerSlugRedirect(
  requestedSlug: string,
  tip: Pick<ComputerTip, "title" | "shortId">,
): string | null {
  if (!tip.shortId) return null;
  const canonical = buildSlug(tip.title, tip.shortId);
  return canonical === requestedSlug ? null : canonical;
}

export function isSelectedComputerTip(
  tip: Pick<ComputerTip, "title" | "shortId">,
  pathSlug: string | undefined,
): boolean {
  if (!pathSlug || !tip.shortId) return false;
  if (buildSlug(tip.title, tip.shortId) === pathSlug) return true;
  return extractShortIdFromSlug(pathSlug) === tip.shortId;
}

export async function resolveComputerTipFromSlug(
  slug: string,
): Promise<NotionComputerItemWithContent | null> {
  const shortId = extractShortIdFromSlug(slug);
  if (shortId) {
    const byShortId = await getComputerTipByShortId(shortId);
    if (byShortId) return byShortId;
  }

  if (isNotionPageIdParam(slug)) {
    return getComputerItemContent(slug);
  }

  return null;
}

export function computerTipsFromApi(data: unknown): ComputerTip[] {
  if (Array.isArray(data)) return data as ComputerTip[];
  if (data && typeof data === "object" && "items" in data) {
    const items = (data as { items: unknown }).items;
    if (Array.isArray(items)) return items as ComputerTip[];
  }
  return [];
}
