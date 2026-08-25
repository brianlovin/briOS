import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import exifr from "exifr";

import { dateStart, richText, select, title } from "@/lib/notion/properties";

export const NOMINATIM_USER_AGENT = "brianlovin.com illustrate-journal";

export type PhotoExif = {
  latitude?: number;
  longitude?: number;
  dateTimeOriginal?: Date;
};

export type JournalFallback = {
  city?: string;
  state?: string;
  country?: string;
  date?: string;
};

export type NominatimReverse = {
  name?: string;
  address?: Record<string, string | undefined>;
};

type PageProperties = PageObjectResponse["properties"];

const LOCAL_ADDRESS_KEYS = [
  "tourism",
  "leisure",
  "amenity",
  "attraction",
  "historic",
  "natural",
  "shop",
  "hamlet",
  "village",
  "isolated_dwelling",
  "town",
  "city_district",
  "suburb",
  "neighbourhood",
  "city",
  "municipality",
] as const;

function asDate(value: unknown): Date | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return undefined;
}

function asFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function namedProperty(properties: PageProperties, name: string): string | undefined {
  return select(properties, name) || richText(properties, name) || title(properties, name);
}

export function journalFallbackFromProperties(properties: PageProperties): JournalFallback {
  return {
    city: namedProperty(properties, "City"),
    state: namedProperty(properties, "State"),
    country: namedProperty(properties, "Country"),
    date: dateStart(properties, "Date"),
  };
}

export function locationFromJournal(fallback: JournalFallback): string | undefined {
  return fallback.city || fallback.state || fallback.country;
}

export async function parsePhotoExif(buffer: Buffer): Promise<PhotoExif> {
  const parsed = (await exifr.parse(buffer, {
    gps: true,
    reviveValues: true,
    pick: ["DateTimeOriginal", "CreateDate", "latitude", "longitude"],
  })) as Record<string, unknown> | undefined;

  const gps = (await exifr.gps(buffer)) as { latitude?: number; longitude?: number } | undefined;

  return {
    latitude: asFiniteNumber(gps?.latitude) ?? asFiniteNumber(parsed?.latitude),
    longitude: asFiniteNumber(gps?.longitude) ?? asFiniteNumber(parsed?.longitude),
    dateTimeOriginal: asDate(parsed?.DateTimeOriginal) ?? asDate(parsed?.CreateDate),
  };
}

export function pickNominatimPlace(result: NominatimReverse): string | undefined {
  const address = result.address ?? {};
  const adminNames = new Set(
    [address.county, address.state, address.region, address.country, address.postcode].filter(
      (value): value is string => Boolean(value),
    ),
  );

  for (const key of LOCAL_ADDRESS_KEYS) {
    const value = address[key];
    if (value) return value;
  }

  if (result.name && !adminNames.has(result.name)) {
    return result.name;
  }

  return address.county || address.state;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string | undefined> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("zoom", "16");
  url.searchParams.set("accept-language", "en");

  const response = await fetch(url, {
    headers: {
      "User-Agent": NOMINATIM_USER_AGENT,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Nominatim reverse-geocode failed (${response.status})`);
  }

  const payload = (await response.json()) as NominatimReverse;
  return pickNominatimPlace(payload);
}

/**
 * GPS reverse-geocode wins when coordinates exist. Journal City/State/Country
 * are only used when the photo has no GPS — never as a guess alongside GPS.
 */
export async function resolveLocation(
  exif: PhotoExif,
  fallback: JournalFallback,
): Promise<string | undefined> {
  if (exif.latitude != null && exif.longitude != null) {
    try {
      return await reverseGeocode(exif.latitude, exif.longitude);
    } catch (error) {
      console.error(
        "Reverse-geocode failed; not falling back to Journal City",
        error instanceof Error ? error.message : error,
      );
      return undefined;
    }
  }

  return locationFromJournal(fallback);
}

export function fieldNoteNumber(date?: Date): string {
  if (!date || Number.isNaN(date.getTime())) return "No. 01";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `No. ${month}`;
}

export function yearFromPhoto(date?: Date, journalDate?: string): string {
  if (date && !Number.isNaN(date.getTime())) {
    return String(date.getFullYear());
  }

  const match = journalDate?.match(/^(\d{4})/);
  return match?.[1] ?? "";
}

export function photoDate(exif: PhotoExif, journalDate?: string): Date | undefined {
  if (exif.dateTimeOriginal) return exif.dateTimeOriginal;
  if (!journalDate) return undefined;
  const parsed = new Date(journalDate);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function formatKeywords(raw: string | undefined): string {
  if (!raw) return "";

  const slashLine =
    raw
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.includes("/")) ?? raw;

  return slashLine
    .split(/[/|,]+/)
    .map((part) =>
      part
        .replace(/[^a-zA-Z0-9\s-]/g, "")
        .trim()
        .toLowerCase(),
    )
    .filter((part) => part.length > 0 && part.length < 24)
    .slice(0, 3)
    .join(" / ");
}

export function fieldNoteLines(input: {
  location?: string;
  date?: Date;
  journalDate?: string;
  keywords?: string;
}): [string, string, string, string] {
  return [
    input.location ?? "",
    fieldNoteNumber(input.date),
    input.keywords ?? "",
    yearFromPhoto(input.date, input.journalDate),
  ];
}
