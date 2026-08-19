import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "bun:test";

import {
  filterGoodWebsites,
  getGoodWebsitesSeed,
  GOOD_WEBSITES_SHUFFLE_INTERVAL_MS,
  GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS,
  type GoodWebsiteItem,
  goodWebsiteLinks,
  goodWebsitesClientKey,
  resolveGoodWebsitesOrder,
  shuffleGoodWebsites,
} from "@/lib/goodWebsites";

function site(
  overrides: Partial<GoodWebsiteItem> & Pick<GoodWebsiteItem, "id" | "name">,
): GoodWebsiteItem {
  return {
    ...overrides,
  };
}

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
  site({
    id: "4",
    name: "Rauno Freiberg",
    url: "https://rauno.me",
    tags: ["Personal site"],
  }),
];

describe("filterGoodWebsites", () => {
  test("lists every titled site href when no tag is set", () => {
    expect(goodWebsiteLinks(filterGoodWebsites(items))).toEqual([
      { id: "1", title: "Paco Coursey", href: "https://paco.me" },
      { id: "2", title: "Linear", href: "https://linear.app" },
      { id: "4", title: "Rauno Freiberg", href: "https://rauno.me" },
    ]);
  });

  test("filters by tag and keeps the matching href", () => {
    expect(goodWebsiteLinks(filterGoodWebsites(items, { tag: "Company" }))).toEqual([
      { id: "2", title: "Linear", href: "https://linear.app" },
    ]);
  });
});

describe("sites shuffle cadence", () => {
  test("uses a 5-minute window", () => {
    expect(GOOD_WEBSITES_SHUFFLE_INTERVAL_MS).toBe(5 * 60 * 1000);
    expect(GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS).toBe(300);
  });

  test("keeps the same seed until the window rolls over", () => {
    const windowStart = 12 * GOOD_WEBSITES_SHUFFLE_INTERVAL_MS;
    expect(getGoodWebsitesSeed(windowStart)).toBe(12);
    expect(getGoodWebsitesSeed(windowStart + GOOD_WEBSITES_SHUFFLE_INTERVAL_MS - 1)).toBe(12);
    expect(getGoodWebsitesSeed(windowStart + GOOD_WEBSITES_SHUFFLE_INTERVAL_MS)).toBe(13);
  });

  test("same seed produces the same order and does not mutate the source", () => {
    const original = items.map((item) => item.id);
    const first = shuffleGoodWebsites(items, 12).map((item) => item.id);
    const second = shuffleGoodWebsites(items, 12).map((item) => item.id);

    expect(first).toEqual(second);
    expect(items.map((item) => item.id)).toEqual(original);
    expect(new Set(first)).toEqual(new Set(original));
  });

  test("later windows can produce a different permutation", () => {
    const permutations = new Set(
      [12, 13, 14, 15, 16].map((seed) =>
        shuffleGoodWebsites(items, seed)
          .map((item) => item.id)
          .join(","),
      ),
    );

    expect(permutations.size).toBeGreaterThan(1);
  });
});

describe("first HTML order vs hydrate", () => {
  const serverOrder = shuffleGoodWebsites(items, 12);
  const fetchedOrder = shuffleGoodWebsites(items, 13);

  test("keeps the server permutation when a client fetch returns another", () => {
    expect(goodWebsiteLinks(resolveGoodWebsitesOrder(serverOrder, fetchedOrder))).toEqual(
      goodWebsiteLinks(serverOrder),
    );
    expect(goodWebsiteLinks(resolveGoodWebsitesOrder(serverOrder, fetchedOrder))).not.toEqual(
      goodWebsiteLinks(fetchedOrder),
    );
  });

  test("filters the server order without reshuffling", () => {
    expect(
      goodWebsiteLinks(resolveGoodWebsitesOrder(serverOrder, fetchedOrder, "Personal site")),
    ).toEqual(goodWebsiteLinks(filterGoodWebsites(serverOrder, { tag: "Personal site" })));
  });

  test("uses a fetched list only when the server did not provide one", () => {
    expect(goodWebsiteLinks(resolveGoodWebsitesOrder(undefined, fetchedOrder))).toEqual(
      goodWebsiteLinks(fetchedOrder),
    );
  });

  test("does not subscribe SWR when the server already provided the list", () => {
    expect(goodWebsitesClientKey(true)).toBeNull();
    expect(goodWebsitesClientKey(true, "Company")).toBeNull();
    expect(goodWebsitesClientKey(false)).toBe("/api/sites");
    expect(goodWebsitesClientKey(false, "Company")).toBe("/api/sites?tag=Company");
  });
});

describe("sites cache split", () => {
  const pagesDir = join(import.meta.dir, "../app");
  const pageSource = readFileSync(join(pagesDir, "sites/page.tsx"), "utf8");
  const apiSource = readFileSync(join(pagesDir, "api/sites/route.ts"), "utf8");
  const cachedSource = readFileSync(join(import.meta.dir, "goodWebsites-cached.ts"), "utf8");
  const hookSource = readFileSync(join(import.meta.dir, "hooks/useGoodWebsites.ts"), "utf8");

  test("days-cached Notion island does not bake in a shuffle", () => {
    const daysIsland = pageSource
      .split("async function")
      .find((block) => block.includes('cacheLife("days")'));

    expect(daysIsland).toBeDefined();
    expect(daysIsland?.includes("getGoodWebsitesSeed")).toBe(false);
    expect(daysIsland?.includes("shuffle")).toBe(false);
    expect(daysIsland?.includes("getGoodWebsitesSource")).toBe(true);
    expect(pageSource.includes('cacheTag("notion:good-websites")')).toBe(true);
    expect(pageSource.includes("getCachedShuffledGoodWebsites")).toBe(true);
    expect(pageSource.includes("getServerLikes")).toBe(true);
  });

  test("shuffle cache matches the 5-minute cadence and the sites purge tag", () => {
    expect(cachedSource.includes('"use cache"')).toBe(true);
    expect(cachedSource.includes("GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS")).toBe(true);
    expect(cachedSource.includes('cacheTag("notion:good-websites")')).toBe(true);
    expect(cachedSource.includes("getGoodWebsitesSeed")).toBe(true);
    expect(cachedSource.includes('cacheLife("days")')).toBe(false);
  });

  test("API serves the same shuffle cache and 5-minute HTTP lifetime", () => {
    expect(apiSource.includes("getCachedShuffledGoodWebsites")).toBe(true);
    expect(apiSource.includes("GOOD_WEBSITES_SHUFFLE_INTERVAL_SECONDS")).toBe(true);
  });

  test("client hook prefers the server list and skips a remount fetch", () => {
    expect(hookSource.includes("resolveGoodWebsitesOrder")).toBe(true);
    expect(hookSource.includes("goodWebsitesClientKey")).toBe(true);
    expect(hookSource.includes("revalidateOnMount: false")).toBe(true);
  });
});
