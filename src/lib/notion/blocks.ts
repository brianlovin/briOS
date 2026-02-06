import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { notion } from "./client";
import type { ProcessedBlock, RichTextContent } from "./types";

// Helper to convert Notion rich text to our processed format
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

// Process block data directly from API response without additional API calls
export function processBlockFromResponse(block: BlockObjectResponse): ProcessedBlock | null {
  try {
    // Handle different block types using type narrowing
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
        return {
          id: block.id,
          type: "to_do",
          content: processRichText(block.to_do.rich_text),
        };

      case "toggle":
        return {
          id: block.id,
          type: "toggle",
          content: processRichText(block.toggle.rich_text),
        };

      case "code":
        return {
          id: block.id,
          type: "code",
          language: block.code.language || "plaintext",
          content: processRichText(block.code.rich_text),
        };

      case "quote":
        return {
          id: block.id,
          type: "quote",
          content: processRichText(block.quote.rich_text),
        };

      case "callout":
        return {
          id: block.id,
          type: "callout",
          content: processRichText(block.callout.rich_text),
        };

      case "divider":
        return {
          id: block.id,
          type: "divider",
          content: [],
        };

      case "image": {
        const imageUrl =
          block.image.type === "external" ? block.image.external.url : block.image.file.url;
        return {
          id: block.id,
          type: "image",
          content: [
            {
              type: "text",
              text: {
                content: imageUrl,
                link: undefined,
              },
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
          content: [], // Table blocks don't have direct content, children are table_row blocks
          tableWidth: block.table.table_width,
          hasColumnHeader: block.table.has_column_header,
          hasRowHeader: block.table.has_row_header,
        };

      case "table_row":
        return {
          id: block.id,
          type: "table_row",
          content: [],
          cells: block.table_row.cells,
        };

      default: {
        // For unsupported block types, log and return null
        const unsupportedBlock = block as { type: string };
        console.warn(`Unsupported block type: ${unsupportedBlock.type}`);
        console.log("Full block data:", JSON.stringify(block, null, 2));
        return null;
      }
    }
  } catch (error) {
    console.error(`Error processing block ${block.id}:`, error);
    return null;
  }
}

// Fetch all blocks from a page with pagination support
export async function getAllBlocks(pageId: string): Promise<ProcessedBlock[]> {
  try {
    const blocksResponse = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    // Handle pagination if there are more than 100 blocks
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

    // Process all blocks synchronously first (no API calls)
    const processed: { block: BlockObjectResponse; processed: ProcessedBlock | null }[] =
      allBlocks.map((block) => {
        const blockObj = block as BlockObjectResponse;
        return { block: blockObj, processed: processBlockFromResponse(blockObj) };
      });

    // Fetch children sequentially to avoid rate limiting
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
