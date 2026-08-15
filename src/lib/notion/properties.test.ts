import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { describe, expect, test } from "bun:test";

import {
  createdTime,
  dateStart,
  filesUrl,
  iconUrl,
  multiSelect,
  number,
  previewStatus,
  richText,
  select,
  title,
  url,
  writeMultiSelect,
  writeRichText,
  writeSelect,
  writeTitle,
  writeUrl,
} from "./properties";

function richTextItem(content: string): RichTextItemResponse {
  return {
    type: "text",
    text: { content, link: null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    },
    plain_text: content,
    href: null,
  };
}

function properties(entries: PageObjectResponse["properties"]): PageObjectResponse["properties"] {
  return entries;
}

describe("title", () => {
  test("reads Name and Title keys independently", () => {
    const props = properties({
      Name: { id: "title", type: "title", title: [richTextItem("Stack item")] },
      Title: { id: "alt", type: "title", title: [richTextItem("TIL item")] },
    });

    expect(title(props, "Name")).toBe("Stack item");
    expect(title(props, "Title")).toBe("TIL item");
  });

  test("joins every title segment", () => {
    const props = properties({
      Title: {
        id: "title",
        type: "title",
        title: [richTextItem("Hello"), richTextItem(" world")],
      },
    });

    expect(title(props, "Title")).toBe("Hello world");
  });

  test("returns undefined for a missing or empty title", () => {
    expect(title(properties({}), "Name")).toBeUndefined();
    expect(
      title(
        properties({ Name: { id: "title", type: "title", title: [richTextItem("")] } }),
        "Name",
      ),
    ).toBeUndefined();
  });
});

describe("richText / select / url / dateStart", () => {
  test("reads each wire shape once", () => {
    const props = properties({
      Slug: { id: "s", type: "rich_text", rich_text: [richTextItem("hello")] },
      Status: {
        id: "st",
        type: "select",
        select: { id: "1", name: "Active", color: "green" },
      },
      URL: { id: "u", type: "url", url: "https://example.com" },
      Published: {
        id: "d",
        type: "date",
        date: { start: "2024-01-15", end: null, time_zone: null },
      },
    });

    expect(richText(props, "Slug")).toBe("hello");
    expect(select(props, "Status")).toBe("Active");
    expect(url(props, "URL")).toBe("https://example.com");
    expect(dateStart(props, "Published")).toBe("2024-01-15");
  });

  test("returns undefined when the property type does not match", () => {
    const props = properties({
      Name: { id: "title", type: "title", title: [richTextItem("Nope")] },
    });

    expect(richText(props, "Name")).toBeUndefined();
    expect(select(props, "Name")).toBeUndefined();
    expect(url(props, "Name")).toBeUndefined();
    expect(dateStart(props, "Name")).toBeUndefined();
  });
});

describe("multiSelect / createdTime / number / filesUrl", () => {
  test("reads remaining property shapes", () => {
    const props = properties({
      Platforms: {
        id: "p",
        type: "multi_select",
        multi_select: [
          { id: "1", name: "macOS", color: "brown" },
          { id: "2", name: "iOS", color: "red" },
        ],
      },
      "Created time": { id: "c", type: "created_time", created_time: "2024-02-01T00:00:00.000Z" },
      "Episode Number": { id: "n", type: "number", number: 42 },
      Files: {
        id: "f",
        type: "files",
        files: [
          {
            type: "external",
            name: "cover",
            external: { url: "https://cdn.example.com/cover.png" },
          },
        ],
      },
    });

    expect(multiSelect(props, "Platforms")).toEqual(["macOS", "iOS"]);
    expect(createdTime(props, "Created time")).toBe("2024-02-01T00:00:00.000Z");
    expect(number(props, "Episode Number")).toBe(42);
    expect(filesUrl(props, "Files")).toBe("https://cdn.example.com/cover.png");
  });

  test("multiSelect returns an empty array when missing", () => {
    expect(multiSelect(properties({}), "Tags")).toEqual([]);
  });
});

describe("iconUrl", () => {
  test("reads file, external, and optional emoji icons", () => {
    expect(
      iconUrl({ icon: { type: "external", external: { url: "https://icon.test/a.png" } } }),
    ).toBe("https://icon.test/a.png");
    expect(
      iconUrl({
        icon: { type: "file", file: { url: "https://notion.so/file.png", expiry_time: "later" } },
      }),
    ).toBe("https://notion.so/file.png");
    expect(iconUrl({ icon: { type: "emoji", emoji: "🎧" } })).toBeUndefined();
    expect(iconUrl({ icon: { type: "emoji", emoji: "🎧" } }, { includeEmoji: true })).toBe("🎧");
    expect(iconUrl({ icon: null })).toBeUndefined();
  });
});

describe("previewStatus", () => {
  test("includes Pending and rejects unknown values", () => {
    const pending = properties({
      "Preview Status": {
        id: "ps",
        type: "select",
        select: { id: "1", name: "Pending", color: "pink" },
      },
    });
    const unknown = properties({
      "Preview Status": {
        id: "ps",
        type: "select",
        select: { id: "1", name: "Mystery", color: "gray" },
      },
    });

    expect(previewStatus(pending)).toBe("Pending");
    expect(previewStatus(unknown)).toBeUndefined();
  });
});

describe("writers", () => {
  test("emit Notion write payloads", () => {
    expect(writeTitle("Hello")).toEqual({ title: [{ text: { content: "Hello" } }] });
    expect(writeRichText("Slug")).toEqual({ rich_text: [{ text: { content: "Slug" } }] });
    expect(writeRichText("")).toEqual({ rich_text: [] });
    expect(writeUrl("https://example.com")).toEqual({ url: "https://example.com" });
    expect(writeSelect("Active")).toEqual({ select: { name: "Active" } });
    expect(writeMultiSelect(["macOS", "iOS"])).toEqual({
      multi_select: [{ name: "macOS" }, { name: "iOS" }],
    });
  });
});
