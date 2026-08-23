import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

import { createdTime, iconUrl, select, title, writeSelect, writeTitle } from "./properties";
import {
  isFullPage,
  isListItemBlock,
  type NotionComputerItem,
  type PageResponse,
  type ProcessedBlock,
  type RichTextContent,
} from "./types";

export const COMPUTER_PUBLISHED_STATUS = "Published";
export const COMPUTER_PENDING_STATUS = "Pending";

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
const NOTION_TEXT_LIMIT = 2000;

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
  };
}

export function computerTipCreateProperties(titleText: string) {
  return {
    Name: writeTitle(titleText),
    Status: writeSelect(COMPUTER_PENDING_STATUS),
  };
}

export function paragraphBlocksFromPlainText(body: string): Array<{
  object: "block";
  type: "paragraph";
  paragraph: { rich_text: Array<{ type: "text"; text: { content: string } }> };
}> {
  const chunks: string[] = [];
  let remaining = body;
  while (remaining.length > 0) {
    chunks.push(remaining.slice(0, NOTION_TEXT_LIMIT));
    remaining = remaining.slice(NOTION_TEXT_LIMIT);
  }

  return chunks.map((content) => ({
    object: "block" as const,
    type: "paragraph" as const,
    paragraph: {
      rich_text: [{ type: "text" as const, text: { content } }],
    },
  }));
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

export function resolveComputerTipHref(href: string, publishedIds: Iterable<string>): string {
  if (!isNotionHostedHref(href)) return href;
  const extracted = notionIdFromHref(href);
  if (!extracted) return href;

  for (const id of publishedIds) {
    if (normalizeNotionId(id) === extracted) {
      return `/computer/${id}`;
    }
  }
  return href;
}

function rewriteRichText(
  content: RichTextContent[],
  publishedIds: Iterable<string>,
): RichTextContent[] {
  return content.map((item) => {
    const link = item.text.link;
    if (!link) return item;
    const resolved = resolveComputerTipHref(link, publishedIds);
    if (resolved === link) return item;
    return { ...item, text: { ...item.text, link: resolved } };
  });
}

function rewriteTableCell(
  cell: RichTextItemResponse[],
  publishedIds: Iterable<string>,
): RichTextItemResponse[] {
  return cell.map((item) => {
    if (!item.href) return item;
    const resolved = resolveComputerTipHref(item.href, publishedIds);
    if (resolved === item.href) return item;
    return { ...item, href: resolved };
  });
}

export function rewriteComputerTipLinks(
  blocks: ProcessedBlock[],
  publishedIds: Iterable<string>,
): ProcessedBlock[] {
  return blocks.map((block) => {
    if (block.type === "table") {
      return {
        ...block,
        tableRows: block.tableRows?.map((row) => ({
          ...row,
          cells: row.cells.map((cell) => rewriteTableCell(cell, publishedIds)),
        })),
      };
    }

    if (isListItemBlock(block)) {
      return {
        ...block,
        content: rewriteRichText(block.content, publishedIds),
        children: block.children
          ? rewriteComputerTipLinks(block.children, publishedIds)
          : block.children,
      };
    }

    if ("content" in block) {
      return { ...block, content: rewriteRichText(block.content, publishedIds) };
    }

    return block;
  });
}
