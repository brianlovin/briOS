import type { ProcessedBlock, RichTextContent, RichTextItemResponse } from "./notion";

function richTextToMarkdown(content: RichTextContent[]): string {
  return content
    .map((text) => {
      let result = text.text.content;
      if (!result) return "";

      const link = text.text.link;
      const { bold, italic, strikethrough, underline, code } = text.annotations;

      // Apply code first (innermost)
      if (code) result = `\`${result}\``;

      // Apply other annotations
      if (bold) result = `**${result}**`;
      if (italic) result = `*${result}*`;
      if (strikethrough) result = `~~${result}~~`;
      if (underline) result = `<u>${result}</u>`;

      // Apply link
      if (link) {
        if (result === link) {
          return link;
        }
        result = `[${result}](${link})`;
      }

      return result;
    })
    .join("");
}

function cellsToMarkdown(cells: RichTextItemResponse[][]): string[] {
  return cells.map((cell) => cell.map((richText) => richText.plain_text).join(""));
}

function blocksToMarkdownLines(blocks: ProcessedBlock[], indent: string = ""): string[] {
  const lines: string[] = [];
  let numberedCounter = 0;

  for (const block of blocks) {
    // Reset numbered counter when we hit a non-numbered block
    if (block.type !== "numbered_list_item") {
      numberedCounter = 0;
    }

    switch (block.type) {
      case "paragraph": {
        const text = richTextToMarkdown(block.content);
        lines.push(`${indent}${text}`);
        lines.push("");
        break;
      }

      case "heading_1": {
        const text = richTextToMarkdown(block.content);
        lines.push(`${indent}# ${text}`);
        lines.push("");
        break;
      }

      case "heading_2": {
        const text = richTextToMarkdown(block.content);
        lines.push(`${indent}## ${text}`);
        lines.push("");
        break;
      }

      case "heading_3": {
        const text = richTextToMarkdown(block.content);
        lines.push(`${indent}### ${text}`);
        lines.push("");
        break;
      }

      case "bulleted_list_item": {
        const text = richTextToMarkdown(block.content);
        lines.push(`${indent}- ${text}`);
        if (block.children && block.children.length > 0) {
          lines.push(...blocksToMarkdownLines(block.children, indent + "  "));
        }
        break;
      }

      case "numbered_list_item": {
        numberedCounter++;
        const text = richTextToMarkdown(block.content);
        lines.push(`${indent}${numberedCounter}. ${text}`);
        if (block.children && block.children.length > 0) {
          lines.push(...blocksToMarkdownLines(block.children, indent + "   "));
        }
        break;
      }

      case "code": {
        const code = block.content.map((c) => c.text.content).join("");
        const lang = block.language || "plaintext";
        lines.push(`${indent}\`\`\`${lang}`);
        lines.push(code);
        lines.push(`${indent}\`\`\``);
        lines.push("");
        break;
      }

      case "quote":
      case "callout": {
        const text = richTextToMarkdown(block.content);
        const quotedLines = text.split("\n").map((l) => `${indent}> ${l}`);
        lines.push(...quotedLines);
        lines.push("");
        break;
      }

      case "divider": {
        lines.push(`${indent}---`);
        lines.push("");
        break;
      }

      case "image": {
        const url = block.content[0]?.text.content || "";
        lines.push(`${indent}![](${url})`);
        lines.push("");
        break;
      }

      case "to_do": {
        const text = richTextToMarkdown(block.content);
        lines.push(`${indent}- [ ] ${text}`);
        break;
      }

      case "toggle": {
        const summary = richTextToMarkdown(block.content);
        lines.push(`${indent}<details><summary>${summary}</summary>`);
        lines.push("");
        if (block.children && block.children.length > 0) {
          lines.push(...blocksToMarkdownLines(block.children, indent));
        }
        lines.push(`${indent}</details>`);
        lines.push("");
        break;
      }

      case "table": {
        if (block.tableRows && block.tableRows.length > 0) {
          for (let rowIndex = 0; rowIndex < block.tableRows.length; rowIndex++) {
            const row = block.tableRows[rowIndex];
            const cells = row.cells ? cellsToMarkdown(row.cells) : [];
            lines.push(`${indent}| ${cells.join(" | ")} |`);

            // Add separator after header row
            if (rowIndex === 0 && block.hasColumnHeader) {
              lines.push(`${indent}| ${cells.map(() => "---").join(" | ")} |`);
            }
          }
          lines.push("");
        }
        break;
      }

      default:
        // Skip unsupported block types
        break;
    }
  }

  return lines;
}

export function blocksToMarkdown(blocks: ProcessedBlock[]): string {
  const lines = blocksToMarkdownLines(blocks);

  // Trim trailing blank lines and join
  while (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }

  return lines.join("\n");
}
