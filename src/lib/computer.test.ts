import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";

import { HOME_PROJECTS } from "@/components/home/ProjectsList";
import {
  COMPUTER_INTRO,
  COMPUTER_TITLE,
  computerSlugRedirect,
  type ComputerTip,
  computerTipLink,
  computerTipLinks,
  computerTipsFromApi,
  isSelectedComputerTip,
  publicComputerTips,
  resolveComputerTipFromSlug,
} from "@/lib/computer";
import * as notion from "@/lib/notion";
import { INDEXABLE_SECTIONS } from "@/lib/site-copy";

function tip(overrides: Partial<ComputerTip> & Pick<ComputerTip, "id" | "title">): ComputerTip {
  return {
    status: "Published",
    createdTime: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("computer copy and links", () => {
  test("keeps the catalog title and intro", () => {
    expect(COMPUTER_TITLE).toBe("How to Computer Better");
    expect(COMPUTER_INTRO).toBe("A living list of tips to use your computer better.");
  });

  test("reads tip lists from either API envelope", () => {
    const published = [tip({ id: "raycast", title: "Raycast", shortId: "hwmX1CS" })];
    expect(computerTipsFromApi({ items: published })).toEqual(published);
    expect(computerTipsFromApi(published)).toEqual(published);
    expect(computerTipsFromApi({ items: "nope" })).toEqual([]);
    expect(computerTipsFromApi(null)).toEqual([]);
  });

  test("lists published tip titles and slug hrefs", () => {
    expect(
      computerTipLinks([
        tip({ id: "raycast", title: "Raycast", shortId: "hwmX1CS" }),
        tip({ id: "screenshots", title: "Take better screenshots", shortId: "NlSKz9x" }),
        tip({ id: "missing", title: "No public URL yet" }),
      ]),
    ).toEqual([
      {
        id: "raycast",
        title: "Raycast",
        slug: "raycast-hwmX1CS",
        href: "/computer/raycast-hwmX1CS",
      },
      {
        id: "screenshots",
        title: "Take better screenshots",
        slug: "take-better-screenshots-NlSKz9x",
        href: "/computer/take-better-screenshots-NlSKz9x",
      },
    ]);
  });

  test("omits tips that have no short id", () => {
    expect(computerTipLink(tip({ id: "1", title: "Draft" }))).toBeNull();
    expect(publicComputerTips([tip({ id: "1", title: "Draft" })])).toEqual([]);
  });
});

describe("computer slug redirect and selection", () => {
  const raycast = tip({ id: "uuid-1", title: "Raycast", shortId: "hwmX1CS" });

  test("redirects when the title slug drifts", () => {
    expect(computerSlugRedirect("old-title-hwmX1CS", raycast)).toBe("raycast-hwmX1CS");
    expect(computerSlugRedirect("raycast-hwmX1CS", raycast)).toBeNull();
    expect(computerSlugRedirect("raycast-hwmX1CS", tip({ id: "1", title: "Raycast" }))).toBeNull();
  });

  test("selects a tip by canonical slug or short id, not UUID", () => {
    expect(isSelectedComputerTip(raycast, "raycast-hwmX1CS")).toBe(true);
    expect(isSelectedComputerTip(raycast, "renamed-tip-hwmX1CS")).toBe(true);
    expect(isSelectedComputerTip(raycast, "uuid-1")).toBe(false);
    expect(isSelectedComputerTip(raycast, undefined)).toBe(false);
  });
});

describe("resolveComputerTipFromSlug", () => {
  afterEach(() => {
    mock.restore();
  });

  const published = {
    id: "273c711c-0ceb-804b-b25b-000b277e6ccf",
    title: "Raycast",
    status: "Published",
    createdTime: "2026-08-01T00:00:00.000Z",
    shortId: "hwmX1CS",
    blocks: [],
  };

  test("loads a tip by the short id at the end of the slug", async () => {
    const byShortId = spyOn(notion, "getComputerTipByShortId").mockResolvedValue(published);
    const byId = spyOn(notion, "getComputerItemContent").mockResolvedValue(null);

    await expect(resolveComputerTipFromSlug("old-title-hwmX1CS")).resolves.toEqual(published);
    expect(byShortId).toHaveBeenCalledWith("hwmX1CS");
    expect(byId).not.toHaveBeenCalled();
  });

  test("falls back to a Notion UUID path", async () => {
    spyOn(notion, "getComputerTipByShortId").mockResolvedValue(null);
    const byId = spyOn(notion, "getComputerItemContent").mockResolvedValue(published);

    await expect(
      resolveComputerTipFromSlug("273c711c-0ceb-804b-b25b-000b277e6ccf"),
    ).resolves.toEqual(published);
    expect(byId).toHaveBeenCalledWith("273c711c-0ceb-804b-b25b-000b277e6ccf");
  });

  test("returns null when the slug has no short id or UUID", async () => {
    const byShortId = spyOn(notion, "getComputerTipByShortId").mockResolvedValue(null);
    const byId = spyOn(notion, "getComputerItemContent").mockResolvedValue(published);

    await expect(resolveComputerTipFromSlug("raycast")).resolves.toBeNull();
    expect(byShortId).not.toHaveBeenCalled();
    expect(byId).not.toHaveBeenCalled();
  });
});

describe("indexable section", () => {
  test("includes /computer in public section lists", () => {
    expect(INDEXABLE_SECTIONS.some((section) => section.href === "/computer")).toBe(true);
  });
});

describe("homepage project", () => {
  test("points How to Computer Better at the native /computer route", () => {
    const project = HOME_PROJECTS.find((item) => item.name === "How to Computer Better");
    expect(project).toEqual({
      name: "How to Computer Better",
      href: "/computer",
      description: "How to use a computer better",
      external: false,
    });
  });
});
