/**
 * Self-contained Notion client, block processing, and types for migration scripts.
 * This file replaces the src/lib/notion/ directory which was deleted in Wave 3.
 */

import { APIErrorCode, APIResponseError, Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type { PageObjectResponse, RichTextItemResponse };

// ─── Types ───────────────────────────────────────────────────────────────────

export type RichTextContent = {
  type: string;
  text: {
    content: string;
    link?: string | undefined;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
};

export type ProcessedBlock = {
  id: string;
  type: string;
  content: RichTextContent[];
  language?: string;
  tableWidth?: number;
  hasColumnHeader?: boolean;
  hasRowHeader?: boolean;
  cells?: RichTextItemResponse[][];
  tableRows?: ProcessedBlock[];
  children?: ProcessedBlock[];
};

export type PageResponse = PageObjectResponse | { properties: Record<string, unknown> };

export type AppDissectionVideoMetadata = {
  type: "app-dissection-video";
  urls: string[];
  orientation: "portrait" | "landscape";
};

// ─── Type guards ─────────────────────────────────────────────────────────────

export function hasProperties(page: unknown): page is PageObjectResponse {
  return typeof page === "object" && page !== null && "properties" in page;
}

export function isValidVideoMetadata(parsed: unknown): parsed is AppDissectionVideoMetadata {
  return (
    typeof parsed === "object" &&
    parsed !== null &&
    (parsed as AppDissectionVideoMetadata).type === "app-dissection-video" &&
    Array.isArray((parsed as AppDissectionVideoMetadata).urls) &&
    ["portrait", "landscape"].includes((parsed as AppDissectionVideoMetadata).orientation)
  );
}

// ─── Client ──────────────────────────────────────────────────────────────────

const MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY_MS = 1000;

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (
        !APIResponseError.isAPIResponseError(error) ||
        error.code !== APIErrorCode.RateLimited ||
        attempt === MAX_RETRIES
      ) {
        throw error;
      }

      const headers = error.headers as Headers;
      const retryAfter = headers?.get("retry-after");
      const delayMs = retryAfter
        ? Number(retryAfter) * 1000
        : DEFAULT_RETRY_DELAY_MS * 2 ** attempt;

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const notion = {
  databases: {
    retrieve: (...args: Parameters<typeof notionClient.databases.retrieve>) =>
      withRetry(() => notionClient.databases.retrieve(...args)),
  },
  dataSources: {
    query: (...args: Parameters<typeof notionClient.dataSources.query>) =>
      withRetry(() => notionClient.dataSources.query(...args)),
  },
  pages: {
    retrieve: (...args: Parameters<typeof notionClient.pages.retrieve>) =>
      withRetry(() => notionClient.pages.retrieve(...args)),
    create: (...args: Parameters<typeof notionClient.pages.create>) =>
      withRetry(() => notionClient.pages.create(...args)),
    update: (...args: Parameters<typeof notionClient.pages.update>) =>
      withRetry(() => notionClient.pages.update(...args)),
  },
  blocks: {
    children: {
      list: (...args: Parameters<typeof notionClient.blocks.children.list>) =>
        withRetry(() => notionClient.blocks.children.list(...args)),
    },
  },
};

// ─── Block processing ────────────────────────────────────────────────────────

function processRichText(richText: RichTextItemResponse[]): RichTextContent[] {
  return richText.map((text) => ({
    type: text.type,
    text: {
      content: text.plain_text,
      link: text.href ?? undefined,
    },
    annotations: {
      bold: text.annotations.bold,
      italic: text.annotations.italic,
      strikethrough: text.annotations.strikethrough,
      underline: text.annotations.underline,
      code: text.annotations.code,
      color: text.annotations.color,
    },
  }));
}

function processBlockFromResponse(block: BlockObjectResponse): ProcessedBlock | null {
  try {
    switch (block.type) {
      case "paragraph":
        return {
          id: block.id,
          type: "paragraph",
          content: processRichText(block.paragraph.rich_text),
        };
      case "heading_1":
        return {
          id: block.id,
          type: "heading_1",
          content: processRichText(block.heading_1.rich_text),
        };
      case "heading_2":
        return {
          id: block.id,
          type: "heading_2",
          content: processRichText(block.heading_2.rich_text),
        };
      case "heading_3":
        return {
          id: block.id,
          type: "heading_3",
          content: processRichText(block.heading_3.rich_text),
        };
      case "bulleted_list_item":
        return {
          id: block.id,
          type: "bulleted_list_item",
          content: processRichText(block.bulleted_list_item.rich_text),
        };
      case "numbered_list_item":
        return {
          id: block.id,
          type: "numbered_list_item",
          content: processRichText(block.numbered_list_item.rich_text),
        };
      case "to_do":
        return { id: block.id, type: "to_do", content: processRichText(block.to_do.rich_text) };
      case "toggle":
        return { id: block.id, type: "toggle", content: processRichText(block.toggle.rich_text) };
      case "code":
        return {
          id: block.id,
          type: "code",
          language: block.code.language || "plaintext",
          content: processRichText(block.code.rich_text),
        };
      case "quote":
        return { id: block.id, type: "quote", content: processRichText(block.quote.rich_text) };
      case "callout":
        return { id: block.id, type: "callout", content: processRichText(block.callout.rich_text) };
      case "divider":
        return { id: block.id, type: "divider", content: [] };
      case "image": {
        const imageUrl =
          block.image.type === "external" ? block.image.external.url : block.image.file.url;
        return {
          id: block.id,
          type: "image",
          content: [
            {
              type: "text",
              text: { content: imageUrl, link: undefined },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
            },
          ],
        };
      }
      case "table":
        return {
          id: block.id,
          type: "table",
          content: [],
          tableWidth: block.table.table_width,
          hasColumnHeader: block.table.has_column_header,
          hasRowHeader: block.table.has_row_header,
        };
      case "table_row":
        return { id: block.id, type: "table_row", content: [], cells: block.table_row.cells };
      default:
        console.warn(`Unsupported block type: ${(block as { type: string }).type}`);
        return null;
    }
  } catch (error) {
    console.error(`Error processing block ${block.id}:`, error);
    return null;
  }
}

export async function getAllBlocks(pageId: string): Promise<ProcessedBlock[]> {
  try {
    const blocksResponse = await notion.blocks.children.list({ block_id: pageId, page_size: 100 });
    let allBlocks = [...blocksResponse.results];
    let nextCursor = blocksResponse.next_cursor;

    while (nextCursor) {
      const nextPage = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100,
        start_cursor: nextCursor,
      });
      allBlocks = [...allBlocks, ...nextPage.results];
      nextCursor = nextPage.next_cursor;
    }

    const processed = allBlocks.map((block) => {
      const blockObj = block as BlockObjectResponse;
      return { block: blockObj, processed: processBlockFromResponse(blockObj) };
    });

    for (const { block: blockObj, processed: processedBlock } of processed) {
      if (!processedBlock || !blockObj.has_children) continue;

      if (blockObj.type === "table") {
        try {
          const childrenResponse = await notion.blocks.children.list({
            block_id: blockObj.id,
            page_size: 100,
          });
          processedBlock.tableRows = childrenResponse.results
            .map((childBlock) => processBlockFromResponse(childBlock as BlockObjectResponse))
            .filter((row): row is ProcessedBlock => row !== null && row.type === "table_row");
        } catch (error) {
          console.error(`Error fetching table children for ${blockObj.id}:`, error);
        }
      }

      if (blockObj.type === "bulleted_list_item" || blockObj.type === "numbered_list_item") {
        try {
          const childrenResponse = await notion.blocks.children.list({
            block_id: blockObj.id,
            page_size: 100,
          });
          processedBlock.children = childrenResponse.results
            .map((childBlock) => processBlockFromResponse(childBlock as BlockObjectResponse))
            .filter((child): child is ProcessedBlock => child !== null);
        } catch (error) {
          console.error(`Error fetching list children for ${blockObj.id}:`, error);
        }
      }
    }

    return processed
      .map(({ processed: p }) => p)
      .filter((block): block is ProcessedBlock => block !== null);
  } catch (error) {
    console.error(`Error fetching blocks for page ${pageId}:`, error);
    return [];
  }
}
