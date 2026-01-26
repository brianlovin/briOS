import type { ProcessedBlock } from "./types";

/**
 * Extract plain text preview from processed blocks
 * Filters for paragraph blocks and joins their content
 */
export function extractPreviewText(blocks: ProcessedBlock[], maxBlocks: number = 2): string {
  return blocks
    .filter((b) => b.type === "paragraph")
    .slice(0, maxBlocks)
    .map((b) => b.content.map((c) => c.text.content).join(""))
    .join("\n\n");
}
