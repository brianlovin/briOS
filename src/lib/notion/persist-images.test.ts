import { installAxiomMock } from "@/lib/axiom-test-utils";

const axiom = installAxiomMock();

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

import {
  isNotionTemporaryUrl,
  persistBlockMedia,
  persistedImageKey,
  type PersistImageDeps,
  persistNotionImage,
  persistPageImages,
} from "./persist-images";
import type { ProcessedBlock } from "./types";

const SIGNED_S3 =
  "https://prod-files-secure.s3.us-west-2.amazonaws.com/ws-1/file-abc/Screenshot.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-Signature=aaa";
const SIGNED_S3_LATER =
  "https://prod-files-secure.s3.us-west-2.amazonaws.com/ws-1/file-abc/Screenshot.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-Signature=bbb";
const FILE_NOTION =
  "https://file.notion.so/f/f/ws-1/file-def/photo.jpg?table=block&id=b1&expirationTimestamp=1&signature=x";

function fakeDeps(existing: string[] = []) {
  const objects = new Set(existing);
  const deps = {
    store: {
      exists: mock(async (key: string) => objects.has(key)),
      put: mock(async (key: string) => {
        objects.add(key);
        return `https://cdn.test/${key}`;
      }),
      publicUrl: (key: string) => `https://cdn.test/${key}`,
    },
    download: mock(async () => ({ body: Buffer.from("png"), contentType: "image/png" })),
    optimize: mock(async (file: { body: Buffer; contentType: string }) => file),
    isEnabled: () => true,
  } satisfies PersistImageDeps;
  return deps;
}

let idCounter = 0;
function uniqueId(): string {
  idCounter++;
  return `00000000-0000-0000-0000-${String(idCounter).padStart(12, "0")}`;
}

describe("isNotionTemporaryUrl", () => {
  test("detects Notion-hosted signed upload URLs", () => {
    expect(isNotionTemporaryUrl(SIGNED_S3)).toBe(true);
    expect(isNotionTemporaryUrl(FILE_NOTION)).toBe(true);
    expect(
      isNotionTemporaryUrl(
        "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/abc/image.png?X-Amz-Signature=1",
      ),
    ).toBe(true);
  });

  test("leaves permanent and third-party URLs alone", () => {
    expect(isNotionTemporaryUrl("https://pub-123.r2.dev/notion-images/abc.png")).toBe(false);
    expect(
      isNotionTemporaryUrl("https://s3-us-west-2.amazonaws.com/public.notion-static.com/emoji.png"),
    ).toBe(false);
    expect(isNotionTemporaryUrl("https://www.notion.so/images/page-cover/gradients_1.png")).toBe(
      false,
    );
    expect(isNotionTemporaryUrl("https://i.scdn.co/image/ab67616d0000b273")).toBe(false);
    expect(isNotionTemporaryUrl("https://my-bucket.s3.amazonaws.com/photo.png")).toBe(false);
    expect(isNotionTemporaryUrl("not a url")).toBe(false);
    expect(isNotionTemporaryUrl(undefined)).toBe(false);
  });
});

describe("persistedImageKey", () => {
  test("is stable across re-signed URLs for the same file", () => {
    const ref = { sourceId: "block-1", slot: "block" };
    expect(persistedImageKey({ ...ref, url: SIGNED_S3 })).toBe(
      persistedImageKey({ ...ref, url: SIGNED_S3_LATER }),
    );
  });

  test("differs per block, per slot, and when the file is replaced", () => {
    const base = persistedImageKey({ sourceId: "block-1", slot: "block", url: SIGNED_S3 });
    expect(persistedImageKey({ sourceId: "block-2", slot: "block", url: SIGNED_S3 })).not.toBe(
      base,
    );
    expect(persistedImageKey({ sourceId: "block-1", slot: "icon", url: SIGNED_S3 })).not.toBe(base);
    expect(
      persistedImageKey({
        sourceId: "block-1",
        slot: "block",
        url: SIGNED_S3.replace("file-abc", "file-new"),
      }),
    ).not.toBe(base);
  });

  test("groups objects by source id and keeps the file extension", () => {
    const key = persistedImageKey({
      sourceId: "1A2B3C4D-0000-0000-0000-000000000000",
      slot: "block",
      url: SIGNED_S3,
    });
    expect(key.startsWith("notion-images/persisted/1a2b3c4d000000000000000000000000/block-")).toBe(
      true,
    );
    expect(key.endsWith(".png")).toBe(true);
  });
});

describe("persistNotionImage", () => {
  beforeEach(() => axiom.enable());
  afterEach(() => axiom.disable());

  test("returns non-Notion URLs untouched without touching storage", async () => {
    const deps = fakeDeps();
    const url = "https://example.com/a.png";
    expect(
      await persistNotionImage({ url, sourceId: uniqueId(), slot: "block", kind: "image" }, deps),
    ).toBe(url);
    expect(deps.store.exists).not.toHaveBeenCalled();
    expect(deps.download).not.toHaveBeenCalled();
  });

  test("reuses an existing R2 object instead of uploading again", async () => {
    const ref = { url: SIGNED_S3, sourceId: uniqueId(), slot: "block", kind: "image" as const };
    const key = persistedImageKey(ref);
    const deps = fakeDeps([key]);

    expect(await persistNotionImage(ref, deps)).toBe(`https://cdn.test/${key}`);
    expect(deps.download).not.toHaveBeenCalled();
    expect(deps.store.put).not.toHaveBeenCalled();
  });

  test("uploads a missing image once under its deterministic key", async () => {
    const sourceId = uniqueId();
    const ref = { url: SIGNED_S3, sourceId, slot: "block", kind: "image" as const };
    const key = persistedImageKey(ref);
    const deps = fakeDeps();

    const [first, second] = await Promise.all([
      persistNotionImage(ref, deps),
      persistNotionImage({ ...ref, url: SIGNED_S3_LATER }, deps),
    ]);

    expect(first).toBe(`https://cdn.test/${key}`);
    expect(second).toBe(first);
    expect(deps.download).toHaveBeenCalledTimes(1);
    expect(deps.store.put).toHaveBeenCalledTimes(1);
    expect(deps.store.put.mock.calls[0][0]).toBe(key);
  });

  test("uploads videos without running the image optimizer", async () => {
    const deps = fakeDeps();
    await persistNotionImage(
      { url: FILE_NOTION, sourceId: uniqueId(), slot: "block", kind: "video" },
      deps,
    );
    expect(deps.optimize).not.toHaveBeenCalled();
    expect(deps.store.put).toHaveBeenCalledTimes(1);
  });

  test("falls back to the Notion URL and logs when the upload fails", async () => {
    const deps = fakeDeps();
    deps.download.mockImplementationOnce(async () => {
      throw new Error("HTTP 403");
    });
    const sourceId = uniqueId();

    const result = await persistNotionImage(
      { url: SIGNED_S3, sourceId, slot: "block", kind: "image" },
      deps,
    );

    expect(result).toBe(SIGNED_S3);
    const logs = axiom.events("log");
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      level: "warn",
      source_id: sourceId,
      error_message: "HTTP 403",
    });
  });

  test("retries after a failure instead of caching it", async () => {
    const deps = fakeDeps();
    deps.store.exists.mockImplementationOnce(async () => {
      throw new Error("R2 down");
    });
    const ref = { url: SIGNED_S3, sourceId: uniqueId(), slot: "block", kind: "image" as const };

    expect(await persistNotionImage(ref, deps)).toBe(SIGNED_S3);
    expect(await persistNotionImage(ref, deps)).toBe(`https://cdn.test/${persistedImageKey(ref)}`);
  });

  test("serves the Notion URL when persistence is disabled", async () => {
    const deps = { ...fakeDeps(), isEnabled: () => false };
    const ref = { url: SIGNED_S3, sourceId: uniqueId(), slot: "block", kind: "image" as const };
    expect(await persistNotionImage(ref, deps)).toBe(SIGNED_S3);
    expect(deps.store.exists).not.toHaveBeenCalled();
  });
});

describe("persistBlockMedia", () => {
  test("rewrites image and video blocks, including list children", async () => {
    const deps = fakeDeps();
    const imageId = uniqueId();
    const childId = uniqueId();
    const blocks: ProcessedBlock[] = [
      { id: imageId, type: "image", url: SIGNED_S3 },
      { id: uniqueId(), type: "image", url: "https://example.com/kept.png" },
      {
        id: uniqueId(),
        type: "bulleted_list_item",
        content: [],
        children: [{ id: childId, type: "video", videoUrl: FILE_NOTION }],
      },
    ];

    const result = await persistBlockMedia(blocks, deps);

    expect(result[0]).toMatchObject({
      url: `https://cdn.test/${persistedImageKey({ sourceId: imageId, slot: "block", url: SIGNED_S3 })}`,
    });
    expect(result[1]).toMatchObject({ url: "https://example.com/kept.png" });
    const list = result[2] as Extract<ProcessedBlock, { type: "bulleted_list_item" }>;
    expect(list.children?.[0]).toMatchObject({
      videoUrl: `https://cdn.test/${persistedImageKey({ sourceId: childId, slot: "block", url: FILE_NOTION })}`,
    });
  });
});

describe("persistPageImages", () => {
  test("rewrites icon, cover, files and URL properties that point at Notion", async () => {
    const deps = fakeDeps();
    const pageId = uniqueId();
    const page = {
      object: "page",
      id: pageId,
      created_time: "2026-01-01T00:00:00.000Z",
      icon: { type: "file", file: { url: SIGNED_S3, expiry_time: "" } },
      cover: { type: "external", external: { url: "https://example.com/cover.png" } },
      properties: {
        "Preview Image": {
          id: "abc",
          type: "files",
          files: [{ name: "shot.png", type: "file", file: { url: FILE_NOTION, expiry_time: "" } }],
        },
        FeatureImage: { id: "xyz", type: "url", url: SIGNED_S3 },
        Source: { id: "src", type: "url", url: "https://example.com" },
      },
    } as unknown as PageObjectResponse;

    const result = await persistPageImages(page, deps);

    expect(result.icon).toMatchObject({
      file: { url: expect.stringContaining("https://cdn.test/") },
    });
    expect(result.cover).toEqual(page.cover);
    expect(result.properties["Preview Image"]).toMatchObject({
      files: [{ file: { url: expect.stringContaining("https://cdn.test/") } }],
    });
    expect(result.properties.FeatureImage).toMatchObject({
      url: expect.stringContaining("https://cdn.test/"),
    });
    expect(result.properties.Source).toMatchObject({ url: "https://example.com" });
    expect(page.icon).toMatchObject({ file: { url: SIGNED_S3 } });
  });
});
