function defaultAnnotations() {
  return {
    bold: false,
    italic: false,
    strikethrough: false,
    underline: false,
    code: false,
    color: "default",
  };
}

function createRichText(text: string) {
  const segments: any[] = [];
  let remaining = text;
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^\)]+\))/;
  while (remaining.length > 0) {
    const match = remaining.match(regex);
    if (!match || match.index === undefined) {
      segments.push({
        type: "text",
        text: { content: remaining },
        annotations: defaultAnnotations(),
      });
      break;
    }
    if (match.index > 0) {
      segments.push({
        type: "text",
        text: { content: remaining.slice(0, match.index) },
        annotations: defaultAnnotations(),
      });
    }
    const token = match[0];
    if (token.startsWith("**")) {
      segments.push({
        type: "text",
        text: { content: token.slice(2, -2) },
        annotations: { ...defaultAnnotations(), bold: true },
      });
    } else if (token.startsWith("*")) {
      segments.push({
        type: "text",
        text: { content: token.slice(1, -1) },
        annotations: { ...defaultAnnotations(), italic: true },
      });
    } else if (token.startsWith("_")) {
      segments.push({
        type: "text",
        text: { content: token.slice(1, -1) },
        annotations: { ...defaultAnnotations(), italic: true },
      });
    } else if (token.startsWith("`")) {
      segments.push({
        type: "text",
        text: { content: token.slice(1, -1) },
        annotations: { ...defaultAnnotations(), code: true },
      });
    } else if (token.startsWith("[")) {
      const parts = /\[([^\]]+)\]\(([^\)]+)\)/.exec(token);
      segments.push({
        type: "text",
        text: { content: parts?.[1] || "", link: { url: parts?.[2] || "" } },
        annotations: defaultAnnotations(),
      });
    }
    remaining = remaining.slice(match.index + token.length);
  }
  return segments;
}

export async function markdownToBlocks(markdown: string) {
  const lines = markdown.split(/\n/);
  const blocks: any[] = [];
  let paragraph: string[] = [];
  let code: string[] = [];
  let inCode = false;
  let codeLang = "plain text";
  const footnotes: { [key: string]: string } = {};

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      // Join paragraphs and trim leading/trailing whitespace
      const content = paragraph.join(" ").trim();
      if (content) {
        blocks.push({
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: createRichText(content) },
        });
      }
      paragraph = [];
    }
  };

  const flushCode = () => {
    if (code.length > 0) {
      blocks.push({
        object: "block",
        type: "code",
        code: {
          rich_text: [{ type: "text", text: { content: code.join("\n") } }],
          language: codeLang,
        },
      });
      code = [];
    }
  };

  // First pass: collect footnotes
  for (const line of lines) {
    const footnoteMatch = line.match(/^\[\^(\d+)\]:\s*(.+)$/);
    if (footnoteMatch) {
      const [, number, text] = footnoteMatch;
      footnotes[number] = text.trim();
    }
  }

  // Second pass: process content and create blocks
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("```")) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushParagraph();
        inCode = true;
        codeLang = line.slice(3).trim() || "plain text";
      }
      continue;
    }
    if (inCode) {
      code.push(line);
      continue;
    }
    // Check for horizontal rule (three or more hyphens)
    if (/^[-]{3,}$/.test(line)) {
      flushParagraph();
      blocks.push({
        object: "block",
        type: "divider",
        divider: {},
      });
      continue;
    }
    // Check for footnote definition
    if (/^\[\^\d+\]:/.test(line)) {
      continue; // Skip footnote definitions as we've already collected them
    }
    if (line.startsWith("# ")) {
      flushParagraph();
      blocks.push({
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: createRichText(line.slice(2).trim()) },
      });
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: createRichText(line.slice(3).trim()) },
      });
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      blocks.push({
        object: "block",
        type: "heading_3",
        heading_3: { rich_text: createRichText(line.slice(4).trim()) },
      });
      continue;
    }
    if (line.startsWith("#### ")) {
      flushParagraph();
      blocks.push({
        object: "block",
        type: "heading_3",
        heading_3: { rich_text: createRichText(line.slice(5).trim()) },
      });
      continue;
    }
    if (line.startsWith("##### ")) {
      flushParagraph();
      blocks.push({
        object: "block",
        type: "heading_3",
        heading_3: { rich_text: createRichText(line.slice(6).trim()) },
      });
      continue;
    }
    if (line.startsWith("###### ")) {
      flushParagraph();
      blocks.push({
        object: "block",
        type: "heading_3",
        heading_3: { rich_text: createRichText(line.slice(7).trim()) },
      });
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: createRichText(line.replace(/^[-*]\s+/, "")) },
      });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      blocks.push({
        object: "block",
        type: "numbered_list_item",
        numbered_list_item: { rich_text: createRichText(line.replace(/^\d+\.\s+/, "")) },
      });
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      blocks.push({
        object: "block",
        type: "quote",
        quote: { rich_text: createRichText(line.slice(2).trim()) },
      });
      continue;
    }
    if (line === "") {
      flushParagraph();
      continue;
    }
    // Trim leading whitespace from the line before adding to paragraph
    paragraph.push(line.trimStart());
  }
  if (inCode) flushCode();
  if (paragraph.length > 0) flushParagraph();

  // Add footnotes as plain paragraphs after a divider
  if (Object.keys(footnotes).length > 0) {
    blocks.push({
      object: "block",
      type: "divider",
      divider: {},
    });
    Object.entries(footnotes).forEach(([number, text]) => {
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: `[${number}] ${text}` } }],
        },
      });
    });
  }

  return blocks;
}
