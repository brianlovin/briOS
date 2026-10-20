import { SITE_CONFIG } from "@/lib/metadata";
import {
  groupListRuns,
  type ProcessedBlock,
  type RichTextContent,
  type RichTextItemResponse,
  richTextPlainText,
  type TableBlock,
} from "@/lib/notion";

const URL_REGEX = /(https?:\/\/[^\s<>"]+)/g;
const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);
const SAFE_MEDIA_PROTOCOLS = new Set(["http:", "https:"]);

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resolveUrl(href: string, protocols: Set<string>): string | null {
  try {
    const url = new URL(href.trim(), SITE_CONFIG.url);
    return protocols.has(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Resolve a link against the site origin; null for unsafe schemes (`javascript:`, `data:`). */
export function absoluteLinkUrl(href: string): string | null {
  return resolveUrl(href, SAFE_LINK_PROTOCOLS);
}

/** Resolve an image or video source against the site origin; http(s) only. */
export function absoluteMediaUrl(src: string): string | null {
  return resolveUrl(src, SAFE_MEDIA_PROTOCOLS);
}

/** Wrap already-escaped HTML in a link; unsafe hrefs leave the inner HTML unlinked. */
export function anchorHtml(href: string, innerHtml: string): string {
  const url = absoluteLinkUrl(href);
  if (!url) return innerHtml;
  return `<a href="${escapeHtml(url)}">${innerHtml}</a>`;
}

export function linkHtml(href: string, label: string): string {
  return anchorHtml(href, escapeHtml(label));
}

export function imageHtml(src: string, alt: string = ""): string {
  const url = absoluteMediaUrl(src);
  if (!url) return "";
  return `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}">`;
}

function textWithBreaks(text: string): string {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

function autolink(text: string): string {
  return text
    .split(URL_REGEX)
    .map((part, index) => (index % 2 === 1 ? linkHtml(part, part) : textWithBreaks(part)))
    .join("");
}

export function richTextToHtml(content: RichTextContent[]): string {
  return content
    .map((item) => {
      const text = item.text.content;
      if (!text) return "";

      let html = item.text.link ? anchorHtml(item.text.link, textWithBreaks(text)) : autolink(text);

      const { bold, italic, strikethrough, underline, code } = item.annotations;
      if (bold) html = `<strong>${html}</strong>`;
      if (italic) html = `<em>${html}</em>`;
      if (strikethrough) html = `<s>${html}</s>`;
      if (underline) html = `<u>${html}</u>`;
      if (code) html = `<code>${html}</code>`;
      return html;
    })
    .join("");
}

function tableCellHtml(cell: RichTextItemResponse[]): string {
  return cell
    .map((item) => (item.href ? linkHtml(item.href, item.plain_text) : escapeHtml(item.plain_text)))
    .join("");
}

function tableHtml(block: TableBlock): string {
  const rows = block.tableRows ?? [];
  if (rows.length === 0) return "";

  const headerRow = block.hasColumnHeader ? rows[0] : null;
  const bodyRows = headerRow ? rows.slice(1) : rows;

  const head = headerRow
    ? `<thead><tr>${headerRow.cells.map((cell) => `<th>${tableCellHtml(cell)}</th>`).join("")}</tr></thead>`
    : "";
  const body = bodyRows
    .map(
      (row) =>
        `<tr>${row.cells
          .map((cell, index) => {
            const tag = block.hasRowHeader && index === 0 ? "th" : "td";
            return `<${tag}>${tableCellHtml(cell)}</${tag}>`;
          })
          .join("")}</tr>`,
    )
    .join("");

  return `<table>${head}<tbody>${body}</tbody></table>`;
}

function codeLanguage(language: string): string | null {
  const normalized = language.toLowerCase().replace(/[^a-z0-9+#-]/g, "");
  return normalized && normalized !== "plaintext" && normalized !== "plain" ? normalized : null;
}

/** Video sources become links: feed readers rarely play `<video>`, and most strip it. */
export function videoLinkHtml(src: string, label: string = "Watch the video"): string {
  const url = absoluteMediaUrl(src);
  if (!url) return "";
  return `<p><a href="${escapeHtml(url)}">${escapeHtml(label)}</a></p>`;
}

function blockToHtml(block: ProcessedBlock): string {
  switch (block.type) {
    case "paragraph": {
      const html = richTextToHtml(block.content);
      return html ? `<p>${html}</p>` : "";
    }
    case "heading_1":
      return `<h1>${richTextToHtml(block.content)}</h1>`;
    case "heading_2":
      return `<h2>${richTextToHtml(block.content)}</h2>`;
    case "heading_3":
      return `<h3>${richTextToHtml(block.content)}</h3>`;
    case "quote":
      return `<blockquote><p>${richTextToHtml(block.content)}</p></blockquote>`;
    case "callout":
      return `<blockquote><p>${richTextToHtml(block.content)}</p></blockquote>`;
    case "toggle": {
      const html = richTextToHtml(block.content);
      return html ? `<p>${html}</p>` : "";
    }
    case "to_do":
      return `<p>${block.checked ? "☑" : "☐"} ${richTextToHtml(block.content)}</p>`;
    case "code": {
      const language = codeLanguage(block.language);
      const attrs = language ? ` class="language-${language}"` : "";
      return `<pre><code${attrs}>${escapeHtml(richTextPlainText(block.content))}</code></pre>`;
    }
    case "divider":
      return "<hr>";
    case "image": {
      const img = imageHtml(block.url);
      return img ? `<figure>${img}</figure>` : "";
    }
    case "video":
      return videoLinkHtml(block.videoUrl);
    case "table":
      return tableHtml(block);
    case "bulleted_list_item":
    case "numbered_list_item":
    case "table_row":
      return "";
  }
}

function listItemHtml(block: ProcessedBlock): string {
  if (block.type !== "bulleted_list_item" && block.type !== "numbered_list_item") return "";
  const children = block.children?.length ? blocksToHtml(block.children) : "";
  return `<li>${richTextToHtml(block.content)}${children}</li>`;
}

/**
 * Render processed Notion blocks to static HTML for feed readers.
 * Mirrors `renderBlocks` (what the site shows) without client components,
 * classes, or scripts. Every link and media URL is absolute; videos become links.
 */
export function blocksToHtml(blocks: ProcessedBlock[]): string {
  return groupListRuns(blocks)
    .map((run) => {
      if (run.kind === "block") return blockToHtml(run.block);
      const tag = run.type === "numbered_list_item" ? "ol" : "ul";
      return `<${tag}>${run.items.map(listItemHtml).join("")}</${tag}>`;
    })
    .filter(Boolean)
    .join("\n");
}
