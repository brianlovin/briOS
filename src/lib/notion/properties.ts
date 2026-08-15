import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { extractPlainText, PREVIEW_STATUSES, type PreviewStatus } from "./types";

type PageProperties = PageObjectResponse["properties"];
type PageProperty = PageProperties[string];

function property(properties: PageProperties, name: string): PageProperty | undefined {
  return properties[name];
}

function textFromRichText(items: RichTextItemResponse[]): string | undefined {
  const value = extractPlainText(items);
  return value || undefined;
}

/** Title property. Callers pass the real key (`Name` or TIL's `Title`). */
export function title(properties: PageProperties, name: string): string | undefined {
  const value = property(properties, name);
  if (value?.type !== "title") return undefined;
  return textFromRichText(value.title);
}

export function richText(properties: PageProperties, name: string): string | undefined {
  const value = property(properties, name);
  if (value?.type !== "rich_text") return undefined;
  return textFromRichText(value.rich_text);
}

export function select(properties: PageProperties, name: string): string | undefined {
  const value = property(properties, name);
  if (value?.type !== "select") return undefined;
  return value.select?.name || undefined;
}

export function url(properties: PageProperties, name: string): string | undefined {
  const value = property(properties, name);
  if (value?.type !== "url") return undefined;
  return value.url || undefined;
}

export function dateStart(properties: PageProperties, name: string): string | undefined {
  const value = property(properties, name);
  if (value?.type !== "date") return undefined;
  return value.date?.start || undefined;
}

export function multiSelect(properties: PageProperties, name: string): string[] {
  const value = property(properties, name);
  if (value?.type !== "multi_select") return [];
  return value.multi_select.map((option) => option.name);
}

export function createdTime(properties: PageProperties, name: string): string | undefined {
  const value = property(properties, name);
  if (value?.type !== "created_time") return undefined;
  return value.created_time || undefined;
}

export function number(properties: PageProperties, name: string): number | undefined {
  const value = property(properties, name);
  if (value?.type !== "number") return undefined;
  return value.number ?? undefined;
}

export function filesUrl(properties: PageProperties, name: string): string | undefined {
  const value = property(properties, name);
  if (value?.type !== "files") return undefined;

  const file = value.files[0];
  if (!file) return undefined;
  if (file.type === "file") return file.file.url;
  if (file.type === "external") return file.external.url;
  return undefined;
}

export function iconUrl(
  page: Pick<PageObjectResponse, "icon">,
  options: { includeEmoji?: boolean } = {},
): string | undefined {
  const icon = page.icon;
  if (!icon) return undefined;
  if (icon.type === "file") return icon.file.url;
  if (icon.type === "external") return icon.external.url;
  if (icon.type === "custom_emoji") return icon.custom_emoji.url;
  if (options.includeEmoji && icon.type === "emoji") return icon.emoji;
  return undefined;
}

function isPreviewStatus(value: string): value is PreviewStatus {
  return (PREVIEW_STATUSES as readonly string[]).includes(value);
}

export function previewStatus(
  properties: PageProperties,
  name: string = "Preview Status",
): PreviewStatus | undefined {
  const value = select(properties, name);
  if (!value || !isPreviewStatus(value)) return undefined;
  return value;
}

export function writeTitle(content: string) {
  return { title: [{ text: { content } }] };
}

export function writeRichText(content: string) {
  return { rich_text: content ? [{ text: { content } }] : [] };
}

export function writeUrl(value: string | null) {
  return { url: value };
}

export function writeSelect(name: string) {
  return { select: { name } };
}

export function writeMultiSelect(names: string[]) {
  return { multi_select: names.map((optionName) => ({ name: optionName })) };
}
