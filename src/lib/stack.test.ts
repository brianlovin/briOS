import { describe, expect, test } from "bun:test";

import { filterStacks, type StackItem, stackItemLinks } from "@/lib/stack";

function item(overrides: Partial<StackItem> & Pick<StackItem, "id" | "name">): StackItem {
  return {
    slug: overrides.slug ?? overrides.name.toLowerCase().replace(/\s+/g, "-"),
    createdTime: "2026-08-01T00:00:00.000Z",
    status: "active",
    ...overrides,
  };
}

describe("filterStacks", () => {
  const items = [
    item({
      id: "1",
      name: "Cursor",
      url: "https://cursor.com",
      status: "active",
      platforms: ["macOS", "Web"],
    }),
    item({
      id: "2",
      name: "Things",
      url: "https://culturedcode.com/things",
      status: "active",
      platforms: ["macOS", "iOS"],
    }),
    item({
      id: "3",
      name: "Old App",
      url: "https://example.com/old",
      status: "inactive",
      platforms: ["Windows"],
    }),
  ];

  test("defaults to active items and keeps titles and hrefs", () => {
    expect(stackItemLinks(filterStacks(items))).toEqual([
      { id: "1", title: "Cursor", href: "https://cursor.com" },
      { id: "2", title: "Things", href: "https://culturedcode.com/things" },
    ]);
  });

  test("can list every item including archived", () => {
    expect(stackItemLinks(filterStacks(items, { status: "all" }))).toEqual([
      { id: "1", title: "Cursor", href: "https://cursor.com" },
      { id: "2", title: "Things", href: "https://culturedcode.com/things" },
      { id: "3", title: "Old App", href: "https://example.com/old" },
    ]);
  });

  test("filters by platform without dropping the matching href", () => {
    expect(stackItemLinks(filterStacks(items, { platform: "iOS" }))).toEqual([
      { id: "2", title: "Things", href: "https://culturedcode.com/things" },
    ]);
  });
});
