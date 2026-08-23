import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

import { buildSlug } from "@/lib/short-id";

import { createdTime, iconUrl, richText, select, title } from "./properties";
import {
  isFullPage,
  isListItemBlock,
  type NotionComputerItem,
  type PageResponse,
  type ProcessedBlock,
  type RichTextContent,
} from "./types";

export type ComputerTipLinkTarget = Pick<NotionComputerItem, "id" | "title" | "shortId">;

export const COMPUTER_PUBLISHED_STATUS = "Published";

export const COMPUTER_PUBLISHED_FILTER = {
  property: "Status",
  select: {
    equals: COMPUTER_PUBLISHED_STATUS,
  },
} as const;

export const COMPUTER_LIST_SORTS = [
  {
    property: "Name",
    direction: "ascending" as const,
  },
];

const UUID_HYPHENATED = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const UUID_COMPACT = /[0-9a-f]{32}/i;

export function isPublishedComputerTip(item: Pick<NotionComputerItem, "status">): boolean {
  return item.status === COMPUTER_PUBLISHED_STATUS;
}

export function mapComputerItem(page: PageResponse): NotionComputerItem | null {
  if (!isFullPage(page)) return null;
  const properties = page.properties;

  return {
    id: page.id,
    title: title(properties, "Name") ?? "Untitled",
    status: select(properties, "Status") ?? "Pending",
    icon: iconUrl(page, { includeEmoji: true }),
    createdTime: createdTime(properties, "Created time") || page.created_time,
    shortId: richText(properties, "Short ID"),
  };
}

export function computerTipPublicPath(
  tip: Pick<NotionComputerItem, "title" | "shortId">,
): string | null {
  if (!tip.shortId) return null;
  return `/computer/${buildSlug(tip.title, tip.shortId)}`;
}

export function normalizeNotionId(id: string): string {
  return id.replace(/-/g, "").toLowerCase();
}

export function notionIdFromHref(href: string): string | null {
  const hyphenated = href.match(UUID_HYPHENATED);
  if (hyphenated) return normalizeNotionId(hyphenated[0]);
  const compact = href.match(UUID_COMPACT);
  if (compact) return compact[0].toLowerCase();
  return null;
}

function isNotionHostedHref(href: string): boolean {
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  try {
    const url = new URL(href);
    const host = url.hostname.toLowerCase();
    return host === "notion.so" || host.endsWith(".notion.so") || host.endsWith(".notion.site");
  } catch {
    return false;
  }
}

const UUID_HYPHENATED_EXACT = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UUID_COMPACT_EXACT = /^[0-9a-f]{32}$/i;

export function isNotionPageIdParam(value: string): boolean {
  return UUID_HYPHENATED_EXACT.test(value) || UUID_COMPACT_EXACT.test(value);
}

export function resolveComputerTipHref(
  href: string,
  publishedTips: Iterable<ComputerTipLinkTarget>,
): string {
  if (!isNotionHostedHref(href)) return href;
  const extracted = notionIdFromHref(href);
  if (!extracted) return href;

  for (const tip of publishedTips) {
    if (normalizeNotionId(tip.id) === extracted) {
      return computerTipPublicPath(tip) ?? href;
    }
  }
  return href;
}

function rewriteRichText(
  content: RichTextContent[],
  publishedTips: Iterable<ComputerTipLinkTarget>,
): RichTextContent[] {
  return content.map((item) => {
    const link = item.text.link;
    if (!link) return item;
    const resolved = resolveComputerTipHref(link, publishedTips);
    if (resolved === link) return item;
    return { ...item, text: { ...item.text, link: resolved } };
  });
}

function rewriteTableCell(
  cell: RichTextItemResponse[],
  publishedTips: Iterable<ComputerTipLinkTarget>,
): RichTextItemResponse[] {
  return cell.map((item) => {
    if (!item.href) return item;
    const resolved = resolveComputerTipHref(item.href, publishedTips);
    if (resolved === item.href) return item;
    return { ...item, href: resolved };
  });
}

export function rewriteComputerTipLinks(
  blocks: ProcessedBlock[],
  publishedTips: Iterable<ComputerTipLinkTarget>,
): ProcessedBlock[] {
  return blocks.map((block) => {
    if (block.type === "table") {
      return {
        ...block,
        tableRows: block.tableRows?.map((row) => ({
          ...row,
          cells: row.cells.map((cell) => rewriteTableCell(cell, publishedTips)),
        })),
      };
    }

    if (isListItemBlock(block)) {
      return {
        ...block,
        content: rewriteRichText(block.content, publishedTips),
        children: block.children
          ? rewriteComputerTipLinks(block.children, publishedTips)
          : block.children,
      };
    }

    if ("content" in block) {
      return { ...block, content: rewriteRichText(block.content, publishedTips) };
    }

    return block;
  });
}
