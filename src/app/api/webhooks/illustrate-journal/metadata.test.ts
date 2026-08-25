import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { afterEach, describe, expect, mock, test } from "bun:test";
import sharp from "sharp";

import {
  fieldNoteLines,
  fieldNoteNumber,
  formatKeywords,
  journalFallbackFromProperties,
  locationFromJournal,
  parsePhotoExif,
  photoDate,
  pickNominatimPlace,
  resolveLocation,
  yearFromPhoto,
} from "./metadata";

function u16(value: number): Buffer {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value);
  return buffer;
}

function u32(value: number): Buffer {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value);
  return buffer;
}

function ifdEntry(tag: number, type: number, count: number, valueOrOffset: number): Buffer {
  return Buffer.concat([u16(tag), u16(type), u32(count), u32(valueOrOffset)]);
}

function rational(numerator: number, denominator: number): Buffer {
  return Buffer.concat([u32(numerator), u32(denominator)]);
}

function decimalToDmsRationals(decimal: number): Buffer {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60 * 100);
  return Buffer.concat([rational(degrees, 1), rational(minutes, 1), rational(seconds, 100)]);
}

/**
 * Tiny JPEG with GPS + DateTimeOriginal so parsePhotoExif can read real EXIF
 * bytes rather than a mocked parser.
 */
async function jpegWithExif(input: {
  latitude: number;
  longitude: number;
  dateTimeOriginal: string;
}): Promise<Buffer> {
  const jpeg = await sharp({
    create: { width: 2, height: 2, channels: 3, background: { r: 10, g: 20, b: 30 } },
  })
    .jpeg()
    .toBuffer();

  const date = `${input.dateTimeOriginal}\0`; // EXIF ASCII, 20 bytes including NUL
  const latRef = input.latitude >= 0 ? "N\0\0\0" : "S\0\0\0";
  const lonRef = input.longitude >= 0 ? "E\0\0\0" : "W\0\0\0";

  // TIFF header (8) + IFD0 (2 + 2*12 + 4) = 38
  const gpsIfdOffset = 38;
  // GPS IFD: 2 + 4*12 + 4 = 54, then 2*24 rationals = 48 → exif IFD at 140
  const exifIfdOffset = gpsIfdOffset + 54 + 48;
  // Exif IFD: 2 + 12 + 4 = 18, then datetime string
  const dateOffset = exifIfdOffset + 18;
  const latOffset = gpsIfdOffset + 54;
  const lonOffset = latOffset + 24;

  const tiff = Buffer.concat([
    Buffer.from("II*\0"),
    u32(8),
    u16(2),
    ifdEntry(0x8825, 4, 1, gpsIfdOffset),
    ifdEntry(0x8769, 4, 1, exifIfdOffset),
    u32(0),
    u16(4),
    ifdEntry(1, 2, 2, Buffer.from(latRef).readUInt32LE(0)),
    ifdEntry(2, 5, 3, latOffset),
    ifdEntry(3, 2, 2, Buffer.from(lonRef).readUInt32LE(0)),
    ifdEntry(4, 5, 3, lonOffset),
    u32(0),
    decimalToDmsRationals(input.latitude),
    decimalToDmsRationals(input.longitude),
    u16(1),
    ifdEntry(0x9003, 2, 20, dateOffset),
    u32(0),
    Buffer.from(date, "ascii"),
  ]);

  const app1Length = tiff.length + 8; // size + "Exif\0\0"
  const app1 = Buffer.concat([
    Buffer.from([0xff, 0xe1, (app1Length >> 8) & 0xff, app1Length & 0xff]),
    Buffer.from("Exif\0\0", "ascii"),
    tiff,
  ]);

  return Buffer.concat([jpeg.subarray(0, 2), app1, jpeg.subarray(2)]);
}

function properties(entries: PageObjectResponse["properties"]): PageObjectResponse["properties"] {
  return entries;
}

describe("parsePhotoExif", () => {
  test("reads GPS and DateTimeOriginal from a tiny JPEG fixture", async () => {
    const buffer = await jpegWithExif({
      latitude: 39.2235,
      longitude: -123.7686,
      dateTimeOriginal: "2026:08:08 12:00:00",
    });

    const exif = await parsePhotoExif(buffer);
    expect(exif.latitude).toBeCloseTo(39.2235, 3);
    expect(exif.longitude).toBeCloseTo(-123.7686, 3);
    expect(exif.dateTimeOriginal?.getUTCFullYear()).toBe(2026);
    expect(exif.dateTimeOriginal?.getUTCMonth()).toBe(7);
  });
});

describe("pickNominatimPlace", () => {
  test("prefers a village or POI over the county", () => {
    expect(
      pickNominatimPlace({
        name: "Mendocino County",
        address: {
          village: "Albion",
          county: "Mendocino County",
          state: "California",
          country: "United States",
        },
      }),
    ).toBe("Albion");

    expect(
      pickNominatimPlace({
        address: {
          tourism: "Mendocino Coast Botanical Gardens",
          county: "Mendocino County",
        },
      }),
    ).toBe("Mendocino Coast Botanical Gardens");
  });
});

describe("resolveLocation", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    mock.restore();
    globalThis.fetch = originalFetch;
  });

  test("uses Journal City only when the photo has no GPS", async () => {
    await expect(
      resolveLocation({}, { city: "Albion", state: "California", country: "United States" }),
    ).resolves.toBe("Albion");
  });

  test("does not fall back to Journal City when GPS exists", async () => {
    globalThis.fetch = mock(async () => {
      throw new Error("geocode unavailable");
    }) as unknown as typeof fetch;

    await expect(
      resolveLocation({ latitude: 39.22, longitude: -123.76 }, { city: "Tomales Bay" }),
    ).resolves.toBeUndefined();
  });

  test("reverse-geocodes GPS instead of using the Journal City", async () => {
    globalThis.fetch = mock(async () => {
      return new Response(
        JSON.stringify({
          name: "Albion",
          address: { village: "Albion", county: "Mendocino County" },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as unknown as typeof fetch;

    await expect(
      resolveLocation({ latitude: 39.22, longitude: -123.76 }, { city: "Tomales Bay" }),
    ).resolves.toBe("Albion");
  });
});

describe("journal fallback and caption lines", () => {
  test("reads City / State / Country / Date from page properties", () => {
    const fallback = journalFallbackFromProperties(
      properties({
        City: { id: "c", type: "select", select: { id: "1", name: "Albion", color: "default" } },
        State: {
          id: "s",
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: { content: "California", link: null },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: "California",
              href: null,
            },
          ],
        },
        Country: {
          id: "k",
          type: "select",
          select: { id: "2", name: "United States", color: "default" },
        },
        Date: { id: "d", type: "date", date: { start: "2026-08-08", end: null, time_zone: null } },
      }),
    );

    expect(fallback).toEqual({
      city: "Albion",
      state: "California",
      country: "United States",
      date: "2026-08-08",
    });
    expect(locationFromJournal(fallback)).toBe("Albion");
  });

  test("formats number, year, and keywords from photo metadata", () => {
    const date = new Date(2026, 7, 8);
    expect(fieldNoteNumber(date)).toBe("No. 08");
    expect(yearFromPhoto(date)).toBe("2026");
    expect(yearFromPhoto(undefined, "2025-01-02")).toBe("2025");
    expect(formatKeywords("Cliff / Bay / Wind!")).toBe("cliff / bay / wind");
    expect(fieldNoteLines({ location: "Albion", date, keywords: "cliff / bay / wind" })).toEqual([
      "Albion",
      "No. 08",
      "cliff / bay / wind",
      "2026",
    ]);
    expect(photoDate({}, "2026-08-08")?.getUTCFullYear()).toBe(2026);
  });
});
