import { cache } from "react";

import { createComputerTip, getComputerDatabaseItems, type NotionComputerItem } from "@/lib/notion";

export const COMPUTER_TITLE = "How to Computer Better";

export const COMPUTER_INTRO =
  "This is a living list of tips to use computers better: shortcuts, hotkeys, utility apps, helpful workflows, and so on.";

export type ComputerTip = NotionComputerItem;

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

export function computerTipsFromApi(data: unknown): ComputerTip[] {
  if (Array.isArray(data)) return data as ComputerTip[];
  if (data && typeof data === "object" && "items" in data) {
    const items = (data as { items: unknown }).items;
    if (Array.isArray(items)) return items as ComputerTip[];
  }
  return [];
}

export async function submitComputerTip(title: string, details?: string) {
  await createComputerTip({ title, body: details });
}
