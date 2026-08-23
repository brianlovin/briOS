import { describe, expect, test } from "bun:test";

import {
  COMPUTER_LIST_SORTS,
  COMPUTER_PENDING_STATUS,
  COMPUTER_PUBLISHED_FILTER,
  COMPUTER_PUBLISHED_STATUS,
  computerTipCreateProperties,
  isNotionPageIdParam,
  isPublishedComputerTip,
  paragraphBlocksFromPlainText,
  resolveComputerTipHref,
  rewriteComputerTipLinks,
} from "./computer";
import type { ProcessedBlock, RichTextContent } from "./types";

function text(content: string, link?: string): RichTextContent {
  return {
    type: "text",
    text: { content, link },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    },
  };
}

describe("isNotionPageIdParam", () => {
  test("accepts hyphenated and compact Notion UUIDs only", () => {
    expect(isNotionPageIdParam("273c711c-0ceb-804b-b25b-000b277e6ccf")).toBe(true);
    expect(isNotionPageIdParam("273c711c0ceb804bb25b000b277e6ccf")).toBe(true);
    expect(isNotionPageIdParam("raycast-hwmX1CS")).toBe(false);
    expect(isNotionPageIdParam("hwmX1CS")).toBe(false);
  });
});

describe("computer published filter", () => {
  test("lists only Published tips, sorted by Name", () => {
    expect(COMPUTER_PUBLISHED_FILTER).toEqual({
      property: "Status",
      select: { equals: "Published" },
    });
    expect(COMPUTER_LIST_SORTS).toEqual([{ property: "Name", direction: "ascending" }]);
    expect(isPublishedComputerTip({ status: "Published" })).toBe(true);
    expect(isPublishedComputerTip({ status: "Pending" })).toBe(false);
    expect(isPublishedComputerTip({ status: "Rejected" })).toBe(false);
  });
});

describe("createComputerTip payload", () => {
  test("creates a Pending tip with optional body paragraphs", () => {
    expect(computerTipCreateProperties("Clipboard history", "1m5Cc9N")).toEqual({
      Name: { title: [{ text: { content: "Clipboard history" } }] },
      Status: { select: { name: COMPUTER_PENDING_STATUS } },
      "Short ID": { rich_text: [{ text: { content: "1m5Cc9N" } }] },
    });
    expect(COMPUTER_PENDING_STATUS).toBe("Pending");
    expect(COMPUTER_PUBLISHED_STATUS).toBe("Published");

    const children = paragraphBlocksFromPlainText("Keep a clipboard history.");
    expect(children).toEqual([
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: "Keep a clipboard history." } }],
        },
      },
    ]);
  });
});

describe("rewriteComputerTipLinks", () => {
  const published = [
    {
      id: "273c711c-0ceb-804b-b25b-000b277e6ccf",
      title: "Raycast",
      shortId: "hwmX1CS",
    },
  ];

  test("rewrites Notion tip links to /computer/{slug}", () => {
    const blocks: ProcessedBlock[] = [
      {
        id: "p1",
        type: "paragraph",
        content: [
          text(
            "See also ",
            "https://brianlovin.notion.site/Raycast-273c711c0ceb804bb25b000b277e6ccf",
          ),
          text("Raycast", "https://www.notion.so/273c711c0ceb804bb25b000b277e6ccf"),
          text(" and Raycast itself", "https://www.raycast.com"),
        ],
      },
    ];

    const rewritten = rewriteComputerTipLinks(blocks, published);
    expect(rewritten[0]).toMatchObject({
      type: "paragraph",
      content: [
        { text: { link: "/computer/raycast-hwmX1CS" } },
        { text: { link: "/computer/raycast-hwmX1CS" } },
        { text: { link: "https://www.raycast.com" } },
      ],
    });
  });

  test("leaves unknown Notion pages, missing short ids, and non-Notion links alone", () => {
    expect(
      resolveComputerTipHref("https://www.notion.so/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", published),
    ).toBe("https://www.notion.so/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    expect(
      resolveComputerTipHref("https://www.notion.so/273c711c0ceb804bb25b000b277e6ccf", [
        { id: "273c711c-0ceb-804b-b25b-000b277e6ccf", title: "Raycast" },
      ]),
    ).toBe("https://www.notion.so/273c711c0ceb804bb25b000b277e6ccf");
    expect(resolveComputerTipHref("https://example.com/docs", published)).toBe(
      "https://example.com/docs",
    );
  });
});
