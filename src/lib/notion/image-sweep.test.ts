import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { describe, expect, mock, test } from "bun:test";

import { sweepDatabases, type SweepDeps, sweepNotionImages } from "./image-sweep";
import type { MediaBlockLike } from "./media";

const TEMP = (name: string) =>
  `https://prod-files-secure.s3.us-west-2.amazonaws.com/ws/${name}/${name}.png?X-Amz-Signature=sig`;

function page(id: string, overrides: Partial<PageObjectResponse> = {}): PageObjectResponse {
  return {
    object: "page",
    id,
    created_time: "2026-01-01T00:00:00.000Z",
    last_edited_time: "2026-02-01T00:00:00.000Z",
    icon: null,
    cover: null,
    properties: {},
    ...overrides,
  } as PageObjectResponse;
}

function imageBlock(id: string, url: string): MediaBlockLike {
  return {
    id,
    type: "image",
    image: { type: "file", file: { url, expiry_time: "" }, caption: [] },
  };
}

function fakeDeps({
  pages,
  blocks = {},
  swept = {},
  failUrls = [],
}: {
  pages: Record<string, PageObjectResponse[]>;
  blocks?: Record<string, MediaBlockLike[]>;
  swept?: Record<string, string>;
  failUrls?: string[];
}) {
  return {
    listPages: mock(async function* (databaseId: string) {
      yield* pages[databaseId] ?? [];
    }),
    listBlocks: mock(async (pageId: string) => blocks[pageId] ?? []),
    persist: mock(async (ref: { url: string; sourceId: string }) =>
      failUrls.includes(ref.url) ? ref.url : `https://cdn.test/${ref.sourceId}`,
    ),
    updateBlock: mock(async () => {}),
    updatePage: mock(async () => {}),
    sweptPages: mock(async () => swept),
    markSwept: mock(async () => {}),
    purge: mock(async () => {}),
    now: () => 0,
  } satisfies SweepDeps;
}

describe("sweepDatabases", () => {
  test("covers every NOTION_*_DATABASE_ID env var, including new ones", () => {
    const databases = sweepDatabases({
      NOTION_TIL_DATABASE_ID: "til-db",
      NOTION_WRITING_DATABASE_ID: "writing-db",
      NOTION_RECIPES_DATABASE_ID: "recipes-db",
      NOTION_TIPS_DATABASE_ID: "tips-db",
      NOTION_TOKEN: "secret",
      NOTION_WEBHOOK_VERIFICATION_SECRET: "secret",
      R2_BUCKET_NAME: "bucket",
    });

    expect(databases.map((db) => db.envKey)).toEqual([
      "NOTION_RECIPES_DATABASE_ID",
      "NOTION_TIL_DATABASE_ID",
      "NOTION_TIPS_DATABASE_ID",
      "NOTION_WRITING_DATABASE_ID",
    ]);
  });

  test("skips empty values and the same database listed twice", () => {
    const databases = sweepDatabases({
      NOTION_AMA_DATABASE_ID: "",
      NOTION_A_DATABASE_ID: "273c711c-0ceb-80c2-af23-ddac8ea9779e",
      NOTION_B_DATABASE_ID: "273c711c0ceb80c2af23ddac8ea9779e",
    });
    expect(databases).toEqual([
      { envKey: "NOTION_A_DATABASE_ID", databaseId: "273c711c-0ceb-80c2-af23-ddac8ea9779e" },
    ]);
  });
});

describe("sweepNotionImages", () => {
  const databases = [
    { envKey: "NOTION_TIL_DATABASE_ID", databaseId: "til" },
    { envKey: "NOTION_TIPS_DATABASE_ID", databaseId: "tips" },
  ];

  test("walks every database and writes R2 URLs back into Notion", async () => {
    const deps = fakeDeps({
      pages: {
        til: [page("til-1")],
        tips: [
          page("tip-1", { icon: { type: "file", file: { url: TEMP("icon"), expiry_time: "" } } }),
        ],
      },
      blocks: { "til-1": [imageBlock("img-1", TEMP("img"))] },
    });

    const summary = await sweepNotionImages({ databases, deadline: 1, deps });

    expect(deps.listPages.mock.calls.map(([id]) => id)).toEqual(["til", "tips"]);
    expect(deps.updateBlock).toHaveBeenCalledWith({
      block_id: "img-1",
      image: { external: { url: "https://cdn.test/img-1" }, caption: [] },
    });
    expect(deps.updatePage).toHaveBeenCalledWith({
      page_id: "tip-1",
      icon: { type: "external", external: { url: "https://cdn.test/tip-1" } },
    });
    expect(summary).toMatchObject({
      found: 2,
      persisted: 2,
      writtenBack: 2,
      failed: 0,
      purged: true,
    });
    expect(deps.markSwept).toHaveBeenCalledTimes(2);
    expect(deps.purge).toHaveBeenCalledTimes(1);
  });

  test("rewrites a files property to external URLs", async () => {
    const deps = fakeDeps({
      pages: {
        til: [
          page("til-1", {
            properties: {
              "Preview Image": {
                id: "p%3A",
                type: "files",
                files: [{ name: "a.png", type: "file", file: { url: TEMP("a"), expiry_time: "" } }],
              },
            } as unknown as PageObjectResponse["properties"],
          }),
        ],
      },
    });

    await sweepNotionImages({ databases: [databases[0]], deadline: 1, deps });

    expect(deps.updatePage).toHaveBeenCalledWith({
      page_id: "til-1",
      properties: {
        "Preview Image": {
          files: [{ name: "a.png", type: "external", external: { url: "https://cdn.test/til-1" } }],
        },
      },
    });
  });

  test("skips pages unchanged since their last clean sweep", async () => {
    const unchanged = page("til-1");
    const deps = fakeDeps({
      pages: { til: [unchanged] },
      swept: { "til-1": unchanged.last_edited_time },
    });

    const summary = await sweepNotionImages({ databases: [databases[0]], deadline: 1, deps });

    expect(deps.listBlocks).not.toHaveBeenCalled();
    expect(summary.databases[0]).toMatchObject({ pagesSkipped: 1, pagesScanned: 0 });
    expect(deps.purge).not.toHaveBeenCalled();
  });

  test("does not mark a page swept or write back when persisting fails", async () => {
    const deps = fakeDeps({
      pages: { til: [page("til-1")] },
      blocks: { "til-1": [imageBlock("img-1", TEMP("img"))] },
      failUrls: [TEMP("img")],
    });

    const summary = await sweepNotionImages({ databases: [databases[0]], deadline: 1, deps });

    expect(deps.updateBlock).not.toHaveBeenCalled();
    expect(deps.markSwept).not.toHaveBeenCalled();
    expect(summary).toMatchObject({ found: 1, failed: 1, writtenBack: 0, purged: false });
  });

  test("dry run reports temporary files without uploading or writing", async () => {
    const deps = fakeDeps({
      pages: { til: [page("til-1")] },
      blocks: { "til-1": [imageBlock("img-1", TEMP("img"))] },
    });

    const summary = await sweepNotionImages({
      databases: [databases[0]],
      deadline: 1,
      dryRun: true,
      deps,
    });

    expect(summary.found).toBe(1);
    expect(deps.persist).not.toHaveBeenCalled();
    expect(deps.updateBlock).not.toHaveBeenCalled();
    expect(deps.markSwept).not.toHaveBeenCalled();
  });

  test("keeps going to later databases when one fails", async () => {
    const deps = fakeDeps({ pages: { tips: [page("tip-1")] } });
    deps.listPages.mockImplementationOnce(async function* () {
      yield* [];
      throw new Error("Notion 404");
    });

    const summary = await sweepNotionImages({ databases, deadline: 1, deps });

    expect(summary.databases.map((db) => [db.envKey, db.complete])).toEqual([
      ["NOTION_TIL_DATABASE_ID", false],
      ["NOTION_TIPS_DATABASE_ID", true],
    ]);
    expect(summary.databases[1].pagesScanned).toBe(1);
  });
});
