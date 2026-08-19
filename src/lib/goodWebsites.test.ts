import { describe, expect, test } from "bun:test";

import { filterGoodWebsites, type GoodWebsiteItem, goodWebsiteLinks } from "@/lib/goodWebsites";

function site(
  overrides: Partial<GoodWebsiteItem> & Pick<GoodWebsiteItem, "id" | "name">,
): GoodWebsiteItem {
  return {
    ...overrides,
  };
}

describe("filterGoodWebsites", () => {
  const items = [
    site({
      id: "1",
      name: "Paco Coursey",
      url: "https://paco.me",
      tags: ["Personal site"],
    }),
    site({
      id: "2",
      name: "Linear",
      url: "https://linear.app",
      tags: ["Company"],
    }),
    site({
      id: "3",
      name: "Untitled",
    }),
  ];

  test("lists every titled site href when no tag is set", () => {
    expect(goodWebsiteLinks(filterGoodWebsites(items))).toEqual([
      { id: "1", title: "Paco Coursey", href: "https://paco.me" },
      { id: "2", title: "Linear", href: "https://linear.app" },
    ]);
  });

  test("filters by tag and keeps the matching href", () => {
    expect(goodWebsiteLinks(filterGoodWebsites(items, { tag: "Company" }))).toEqual([
      { id: "2", title: "Linear", href: "https://linear.app" },
    ]);
  });
});
