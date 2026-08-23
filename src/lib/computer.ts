import { cache } from "react";

import { createComputerTip, getComputerDatabaseItems, type NotionComputerItem } from "@/lib/notion";

export const COMPUTER_TITLE = "How to Computer Better";

export const COMPUTER_INTRO =
  "This is a living list of tips to use computers better: shortcuts, hotkeys, utility apps, helpful workflows, and so on.";

export type ComputerTip = NotionComputerItem;

export type ComputerTipsResponse = { items: ComputerTip[] };

export function unwrapComputerTips(
  data: ComputerTipsResponse | undefined,
  fallback?: ComputerTip[],
): ComputerTip[] {
  return data?.items ?? fallback ?? [];
}

async function fetchAllComputerTips(): Promise<ComputerTip[]> {
  return getComputerDatabaseItems();
}

export const getComputerTips = cache(fetchAllComputerTips);

export function computerTipLinks(items: ComputerTip[]) {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    href: `/computer/${item.id}`,
  }));
}

export async function submitComputerTip(title: string, details?: string) {
  await createComputerTip({ title, body: details });
}
