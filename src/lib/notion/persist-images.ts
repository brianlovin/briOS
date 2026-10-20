import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import crypto from "crypto";

import { toErrorMessage } from "@/lib/axiom";
import { logger } from "@/lib/logger";
import { defaultPersistImageDeps } from "#notion-image-store";

import { isFullPage, type PageResponse, type ProcessedBlock } from "./types";

export type NotionMediaKind = "image" | "video";

/**
 * Where a Notion file lives. `sourceId` is the block or page id; `slot` names
 * the field on it (`block`, `icon`, `cover`, `property-<id>-<index>`).
 */
export type NotionFileRef = {
  url: string;
  sourceId: string;
  slot: string;
  kind: NotionMediaKind;
};

export type PersistedImageStore = {
  exists(key: string): Promise<boolean>;
  put(key: string, body: Buffer, contentType: string): Promise<string>;
  publicUrl(key: string): string;
};

export type DownloadedFile = { body: Buffer; contentType: string };

export type PersistImageDeps = {
  store: PersistedImageStore;
  download(url: string): Promise<DownloadedFile>;
  optimize(file: DownloadedFile): Promise<DownloadedFile>;
  isEnabled(): boolean;
};

const KEY_PREFIX = "notion-images/persisted";
const UPLOAD_CONCURRENCY = 4;

/**
 * Notion-hosted uploads come back as signed URLs that expire after about an
 * hour: `prod-files-secure.s3.*.amazonaws.com`, legacy
 * `s3.*.amazonaws.com/secure.notion-static.com/...`, and `file.notion.so`.
 * Public assets (`public.notion-static.com` custom emoji, `/images/page-cover`)
 * do not expire and are left alone.
 */
export function isNotionTemporaryUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  const host = url.hostname.toLowerCase();
  if (host === "file.notion.so") return true;
  if (host.endsWith(".notionusercontent.com")) return true;
  if (host.endsWith(".amazonaws.com")) {
    if (host.startsWith("prod-files-secure.")) return true;
    if (host.startsWith("secure.notion-static.com.")) return true;
    return url.pathname.startsWith("/secure.notion-static.com/");
  }
  return false;
}

function compactId(id: string): string {
  return id.replace(/-/g, "").toLowerCase();
}

function safeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "_");
}

function extensionFromPath(pathname: string): string {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {}
  const match = decoded.match(/\.([a-zA-Z0-9]{1,5})$/);
  return match ? `.${match[1].toLowerCase()}` : "";
}

/**
 * Deterministic R2 key for one Notion file. The signature/expiry query string
 * changes on every read, so only host + path (which embeds Notion's file id)
 * feed the hash: the same upload maps to the same key forever, and replacing
 * the image in Notion produces a new key.
 */
export function persistedImageKey(ref: Pick<NotionFileRef, "url" | "sourceId" | "slot">): string {
  const parsed = new URL(ref.url);
  const stable = `${parsed.hostname}${parsed.pathname}`;
  const hash = crypto
    .createHash("sha256")
    .update(`${compactId(ref.sourceId)}:${ref.slot}:${stable}`)
    .digest("hex")
    .slice(0, 16);
  return `${KEY_PREFIX}/${compactId(ref.sourceId)}/${safeSegment(ref.slot)}-${hash}${extensionFromPath(parsed.pathname)}`;
}

/** One upload per key per process, even when several renders race. */
const inflight = new Map<string, Promise<string>>();

async function uploadOnce(
  key: string,
  ref: NotionFileRef,
  deps: PersistImageDeps,
): Promise<string> {
  if (await deps.store.exists(key)) {
    return deps.store.publicUrl(key);
  }
  const downloaded = await deps.download(ref.url);
  const file = ref.kind === "image" ? await deps.optimize(downloaded) : downloaded;
  return deps.store.put(key, file.body, file.contentType);
}

/**
 * Return a permanent R2 URL for a Notion-hosted temporary file, uploading it
 * on first sight. Non-Notion URLs come back unchanged. Never throws: on any
 * failure it logs and returns the original URL so the page still renders.
 */
export async function persistNotionImage(
  ref: NotionFileRef,
  deps: PersistImageDeps = defaultPersistImageDeps,
): Promise<string> {
  if (!isNotionTemporaryUrl(ref.url)) return ref.url;
  if (!deps.isEnabled()) return ref.url;

  let key: string;
  try {
    key = persistedImageKey(ref);
  } catch {
    return ref.url;
  }

  let pending = inflight.get(key);
  if (!pending) {
    pending = uploadOnce(key, ref, deps);
    inflight.set(key, pending);
  }

  try {
    return await pending;
  } catch (error) {
    inflight.delete(key);
    logger.warn("[Notion images] Persist failed, serving Notion URL", {
      source_id: ref.sourceId,
      slot: ref.slot,
      kind: ref.kind,
      error_message: toErrorMessage(error),
    });
    return ref.url;
  }
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

// ===== Read path =====

type PageProperty = PageObjectResponse["properties"][string];
type FileEntry = Extract<PageProperty, { type: "files" }>["files"][number];

function fileEntryUrl(file: FileEntry): string | undefined {
  if (file.type === "file") return file.file.url;
  if (file.type === "external") return file.external.url;
  return undefined;
}

function pageIconUrl(page: PageObjectResponse): string | undefined {
  if (page.icon?.type === "file") return page.icon.file.url;
  if (page.icon?.type === "external") return page.icon.external.url;
  return undefined;
}

function pageCoverUrl(page: PageObjectResponse): string | undefined {
  if (page.cover?.type === "file") return page.cover.file.url;
  if (page.cover?.type === "external") return page.cover.external.url;
  return undefined;
}

export function propertyFileSlot(property: { id: string }, index: number): string {
  return `property-${property.id}-${index}`;
}

export function propertyUrlSlot(property: { id: string }): string {
  return `property-${property.id}`;
}

/** Every Notion-hosted temporary file on a page: icon, cover, files props, URL props. */
export function collectPageFileRefs(page: PageObjectResponse): NotionFileRef[] {
  const refs: NotionFileRef[] = [];
  const add = (url: string | undefined | null, slot: string) => {
    if (url && isNotionTemporaryUrl(url)) {
      refs.push({ url, sourceId: page.id, slot, kind: "image" });
    }
  };

  add(pageIconUrl(page), "icon");
  add(pageCoverUrl(page), "cover");

  for (const property of Object.values(page.properties)) {
    if (property.type === "files") {
      property.files.forEach((file, index) =>
        add(fileEntryUrl(file), propertyFileSlot(property, index)),
      );
    } else if (property.type === "url") {
      add(property.url, propertyUrlSlot(property));
    }
  }

  return refs;
}

/**
 * Copy of `page` with icon, cover, files and URL properties pointing at R2.
 * Mappers keep reading `file.url` / `external.url`; only the value changes.
 */
export async function persistPageImages<T extends PageResponse>(
  page: T,
  deps?: PersistImageDeps,
): Promise<T> {
  if (!isFullPage(page)) return page;
  const refs = collectPageFileRefs(page);
  if (refs.length === 0) return page;

  const resolved = new Map<string, string>();
  await mapWithConcurrency(refs, UPLOAD_CONCURRENCY, async (ref) => {
    resolved.set(ref.slot, await persistNotionImage(ref, deps));
  });
  const swap = (slot: string, url: string) => resolved.get(slot) ?? url;

  const next = structuredClone(page) as PageObjectResponse;
  if (next.icon?.type === "file") next.icon.file.url = swap("icon", next.icon.file.url);
  if (next.icon?.type === "external") {
    next.icon.external.url = swap("icon", next.icon.external.url);
  }
  if (next.cover?.type === "file") next.cover.file.url = swap("cover", next.cover.file.url);
  if (next.cover?.type === "external") {
    next.cover.external.url = swap("cover", next.cover.external.url);
  }
  for (const property of Object.values(next.properties)) {
    if (property.type === "files") {
      property.files.forEach((file, index) => {
        const slot = propertyFileSlot(property, index);
        if (file.type === "file") file.file.url = swap(slot, file.file.url);
        if (file.type === "external") file.external.url = swap(slot, file.external.url);
      });
    } else if (property.type === "url" && property.url) {
      property.url = swap(propertyUrlSlot(property), property.url);
    }
  }
  return next as T;
}

function blockFileRef(block: ProcessedBlock): NotionFileRef | null {
  if (block.type === "image" && isNotionTemporaryUrl(block.url)) {
    return { url: block.url, sourceId: block.id, slot: "block", kind: "image" };
  }
  if (block.type === "video" && isNotionTemporaryUrl(block.videoUrl)) {
    return { url: block.videoUrl, sourceId: block.id, slot: "block", kind: "video" };
  }
  return null;
}

function collectBlockRefs(blocks: ProcessedBlock[], refs: NotionFileRef[]): NotionFileRef[] {
  for (const block of blocks) {
    const ref = blockFileRef(block);
    if (ref) refs.push(ref);
    if ("children" in block && block.children) collectBlockRefs(block.children, refs);
  }
  return refs;
}

function swapBlockUrls(blocks: ProcessedBlock[], resolved: Map<string, string>): ProcessedBlock[] {
  return blocks.map((block) => {
    if (block.type === "image") {
      return { ...block, url: resolved.get(block.id) ?? block.url };
    }
    if (block.type === "video") {
      return { ...block, videoUrl: resolved.get(block.id) ?? block.videoUrl };
    }
    if ("children" in block && block.children) {
      return { ...block, children: swapBlockUrls(block.children, resolved) };
    }
    return block;
  });
}

/** Image and video blocks (including list children) rewritten to R2 URLs. */
export async function persistBlockMedia(
  blocks: ProcessedBlock[],
  deps?: PersistImageDeps,
): Promise<ProcessedBlock[]> {
  const refs = collectBlockRefs(blocks, []);
  if (refs.length === 0) return blocks;

  const resolved = new Map<string, string>();
  await mapWithConcurrency(refs, UPLOAD_CONCURRENCY, async (ref) => {
    resolved.set(ref.sourceId, await persistNotionImage(ref, deps));
  });
  return swapBlockUrls(blocks, resolved);
}
