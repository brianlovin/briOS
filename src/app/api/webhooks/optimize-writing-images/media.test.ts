import { describe, expect, test } from "bun:test";

import {
  collectMedia,
  failedMediaResult,
  getMediaUrl,
  type MediaBlockLike,
  mediaBlockUpdate,
  type MediaResult,
  type MediaView,
  summarizeMediaResults,
} from "./media";

function imageBlock(
  id: string,
  file: MediaView["file"],
): MediaBlockLike & { type: "image"; image: MediaView["file"] } {
  return { id, type: "image", image: file };
}

function videoBlock(
  id: string,
  file: MediaView["file"],
): MediaBlockLike & { type: "video"; video: MediaView["file"] } {
  return { id, type: "video", video: file };
}

describe("collectMedia", () => {
  test("walks image and video blocks into one list in document order", () => {
    const blocks: MediaBlockLike[] = [
      { id: "p1", type: "paragraph" },
      imageBlock("img-1", { type: "external", external: { url: "https://img.example/1.jpg" } }),
      { id: "h1", type: "heading_2" },
      videoBlock("vid-1", {
        type: "file",
        file: { url: "https://vid.example/1.mp4", expiry_time: "t" },
      }),
      imageBlock("img-2", {
        type: "file",
        file: { url: "https://img.example/2.png", expiry_time: "t" },
      }),
    ];

    expect(collectMedia(blocks)).toEqual([
      {
        id: "img-1",
        kind: "image",
        file: { type: "external", external: { url: "https://img.example/1.jpg" } },
      },
      {
        id: "vid-1",
        kind: "video",
        file: { type: "file", file: { url: "https://vid.example/1.mp4", expiry_time: "t" } },
      },
      {
        id: "img-2",
        kind: "image",
        file: { type: "file", file: { url: "https://img.example/2.png", expiry_time: "t" } },
      },
    ]);
  });

  test("skips media-typed blocks that are missing a file payload", () => {
    expect(
      collectMedia([
        { id: "img-empty", type: "image" },
        { id: "vid-empty", type: "video" },
      ]),
    ).toEqual([]);
  });
});

describe("getMediaUrl", () => {
  test("reads external and file URLs for both kinds", () => {
    expect(
      getMediaUrl({
        file: { type: "external", external: { url: "https://img.example/a.jpg" } },
      }),
    ).toBe("https://img.example/a.jpg");
    expect(
      getMediaUrl({
        file: { type: "file", file: { url: "https://vid.example/a.mp4", expiry_time: "t" } },
      }),
    ).toBe("https://vid.example/a.mp4");
  });

  test("returns null when the declared type has no matching URL", () => {
    expect(getMediaUrl({ file: { type: "external" } })).toBeNull();
    expect(getMediaUrl({ file: { type: "file" } })).toBeNull();
  });
});

describe("mediaBlockUpdate", () => {
  test("writes the Notion property that matches kind", () => {
    const image = collectMedia([
      imageBlock("img-1", {
        type: "file",
        file: { url: "https://notion.example/old.jpg", expiry_time: "t" },
        caption: [{ plain_text: "hero" }],
      }),
    ])[0];
    const video = collectMedia([
      videoBlock("vid-1", {
        type: "external",
        external: { url: "https://notion.example/old.mp4" },
      }),
    ])[0];

    expect(mediaBlockUpdate(image, "https://r2.example/new.jpg")).toEqual({
      block_id: "img-1",
      image: {
        external: { url: "https://r2.example/new.jpg" },
        caption: [{ plain_text: "hero" }],
      },
    });
    expect(mediaBlockUpdate(video, "https://r2.example/new.mp4")).toEqual({
      block_id: "vid-1",
      video: {
        external: { url: "https://r2.example/new.mp4" },
        caption: [],
      },
    });
  });
});

describe("summarizeMediaResults", () => {
  test("counts a mixed image/video result list in one pass", () => {
    const results: MediaResult[] = [
      {
        kind: "image",
        success: true,
        originalUrl: "https://img.example/1.jpg",
        newUrl: "https://r2.example/1.jpg",
        originalSize: 1000,
        optimizedSize: 400,
        savings: 60,
      },
      failedMediaResult("video", "Failed to download video"),
      {
        kind: "video",
        success: true,
        originalUrl: "https://vid.example/2.mp4",
        newUrl: "https://r2.example/2.mp4",
        size: 2048,
      },
      failedMediaResult("image", "No image URL found"),
    ];

    expect(summarizeMediaResults(results)).toEqual({
      images: {
        total: 2,
        successful: 1,
        failed: 1,
        originalSize: 1000,
        optimizedSize: 400,
        savings: "60.0%",
      },
      videos: {
        total: 2,
        successful: 1,
        failed: 1,
        totalSize: 2048,
      },
      total: 4,
      successful: 2,
      failed: 2,
    });
  });

  test("reports 0% image savings when no successful images ran", () => {
    expect(summarizeMediaResults([failedMediaResult("video", "boom")]).images.savings).toBe("0%");
  });
});
