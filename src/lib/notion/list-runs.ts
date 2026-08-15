import type {
  BulletedListItemBlock,
  ListItemBlock,
  NumberedListItemBlock,
  ProcessedBlock,
} from "./types";

export type ListRun =
  | { kind: "list"; type: "bulleted_list_item"; items: BulletedListItemBlock[] }
  | { kind: "list"; type: "numbered_list_item"; items: NumberedListItemBlock[] }
  | { kind: "block"; block: Exclude<ProcessedBlock, ListItemBlock> };

/**
 * Group consecutive same-type list items so mixed bullet/number runs
 * stay as separate lists at every depth.
 */
export function groupListRuns(blocks: ProcessedBlock[]): ListRun[] {
  const runs: ListRun[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      const items: BulletedListItemBlock[] = [];
      while (i < blocks.length) {
        const next = blocks[i];
        if (next.type !== "bulleted_list_item") break;
        items.push(next);
        i++;
      }
      runs.push({ kind: "list", type: "bulleted_list_item", items });
      continue;
    }

    if (block.type === "numbered_list_item") {
      const items: NumberedListItemBlock[] = [];
      while (i < blocks.length) {
        const next = blocks[i];
        if (next.type !== "numbered_list_item") break;
        items.push(next);
        i++;
      }
      runs.push({ kind: "list", type: "numbered_list_item", items });
      continue;
    }

    runs.push({ kind: "block", block });
    i++;
  }

  return runs;
}
