import { groupListRuns, type ProcessedBlock, type RichTextContent } from "@/lib/notion";

function escapeMarkdown(text: string): string {
  return text.replace(/([\\`*_[\]#])/g, "\\$1");
}

export function richTextToMarkdown(content: RichTextContent[]): string {
  return content
    .map((item) => {
      let text = item.text.content;
      if (!text) return "";
      const { bold, italic, strikethrough, code } = item.annotations;
      if (code) text = `\`${text.replace(/`/g, "\\`")}\``;
      else text = escapeMarkdown(text);
      if (italic) text = `*${text}*`;
      if (bold) text = `**${text}**`;
      if (strikethrough) text = `~~${text}~~`;
      if (item.text.link) return `[${text}](${item.text.link})`;
      return text;
    })
    .join("");
}

function tableCellText(cell: { plain_text?: string }[]): string {
  return cell
    .map((item) => item.plain_text ?? "")
    .join("")
    .replace(/\|/g, "\\|");
}

function renderListItems(items: ProcessedBlock[], ordered: boolean, depth: number): string[] {
  const indent = "  ".repeat(depth);
  return items.flatMap((item, index) => {
    if (item.type !== "bulleted_list_item" && item.type !== "numbered_list_item") return [];
    const marker = ordered ? `${index + 1}.` : "-";
    const line = `${indent}${marker} ${richTextToMarkdown(item.content)}`;
    const children = item.children?.length ? blocksToMarkdown(item.children, depth + 1) : "";
    return children ? [line, children] : [line];
  });
}

/**
 * Convert processed Notion blocks to Markdown. Used for Accept negotiation
 * and sibling `.md` URLs — not for the human HTML renderer.
 */
export function blocksToMarkdown(blocks: ProcessedBlock[], depth = 0): string {
  const lines: string[] = [];

  for (const run of groupListRuns(blocks)) {
    if (run.kind === "list") {
      lines.push(renderListItems(run.items, run.type === "numbered_list_item", depth).join("\n"));
      continue;
    }

    const block = run.block;
    switch (block.type) {
      case "heading_1":
        lines.push(`# ${richTextToMarkdown(block.content)}`);
        break;
      case "heading_2":
        lines.push(`## ${richTextToMarkdown(block.content)}`);
        break;
      case "heading_3":
        lines.push(`### ${richTextToMarkdown(block.content)}`);
        break;
      case "paragraph": {
        const text = richTextToMarkdown(block.content);
        if (text) lines.push(text);
        break;
      }
      case "quote":
        lines.push(
          richTextToMarkdown(block.content)
            .split("\n")
            .map((line) => `> ${line}`)
            .join("\n"),
        );
        break;
      case "callout":
      case "toggle": {
        const text = richTextToMarkdown(block.content);
        if (text) lines.push(text);
        break;
      }
      case "to_do":
        lines.push(`- [${block.checked ? "x" : " "}] ${richTextToMarkdown(block.content)}`);
        break;
      case "code":
        lines.push(`\`\`\`${block.language || ""}\n${richTextToMarkdown(block.content)}\n\`\`\``);
        break;
      case "divider":
        lines.push("---");
        break;
      case "image":
        lines.push(`![image](${block.url})`);
        break;
      case "video":
        lines.push(`[Video](${block.videoUrl})`);
        break;
      case "table": {
        const rows = block.tableRows ?? [];
        if (rows.length === 0) break;
        const header = rows[0].cells.map(tableCellText);
        lines.push(`| ${header.join(" | ")} |`);
        lines.push(`| ${header.map(() => "---").join(" | ")} |`);
        for (const row of rows.slice(1)) {
          lines.push(`| ${row.cells.map(tableCellText).join(" | ")} |`);
        }
        break;
      }
      default:
        break;
    }
  }

  return lines.filter(Boolean).join("\n\n");
}
