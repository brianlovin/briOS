import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { toErrorMessage } from "@/lib/axiom";
import { logger } from "@/lib/logger";

import { getNotionCacheRedis } from "./cache";
import { notion } from "./client";
import { collectMedia, getMediaUrl, type MediaBlockLike, mediaBlockUpdate } from "./media";
import {
  collectPageFileRefs,
  isNotionTemporaryUrl,
  type NotionFileRef,
  persistNotionImage,
  propertyFileSlot,
  propertyUrlSlot,
} from "./persist-images";
import { purgeAllNotionContent } from "./purge";
import { getDataSourceId } from "./queries";
import { isFullPage } from "./types";

const DATABASE_ENV_PATTERN = /^NOTION_[A-Z0-9_]+_DATABASE_ID$/;
const SWEPT_PAGES_KEY = "notion-images:swept";
/** Block types whose children are other pages, not content the site renders. */
const SKIP_CHILDREN = new Set(["child_page", "child_database"]);

export type SweepDatabase = { envKey: string; databaseId: string };

/**
 * Every database the site reads, from `NOTION_*_DATABASE_ID` env vars. Adding
 * a new database env var in Vercel is enough for the sweep to cover it.
 */
export function sweepDatabases(
  env: Record<string, string | undefined> = process.env,
): SweepDatabase[] {
  const seen = new Set<string>();
  const databases: SweepDatabase[] = [];
  for (const envKey of Object.keys(env).sort()) {
    if (!DATABASE_ENV_PATTERN.test(envKey)) continue;
    const databaseId = env[envKey]?.trim();
    if (!databaseId) continue;
    const normalized = databaseId.replace(/-/g, "").toLowerCase();
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    databases.push({ envKey, databaseId });
  }
  return databases;
}

type PageUpdate = {
  page_id: string;
  icon?: { type: "external"; external: { url: string } };
  cover?: { type: "external"; external: { url: string } };
  properties?: Record<string, unknown>;
};

/**
 * Notion update that swaps persisted files to external R2 URLs. A files
 * property is only rewritten when every temporary entry in it was persisted,
 * since unpersisted `file` entries cannot be sent back to Notion.
 */
export function pageFileUpdate(
  page: PageObjectResponse,
  resolved: Map<string, string>,
): { update: PageUpdate | null; applied: number } {
  const update: PageUpdate = { page_id: page.id };
  const properties: Record<string, unknown> = {};
  let applied = 0;

  const icon = resolved.get("icon");
  if (icon) {
    update.icon = { type: "external", external: { url: icon } };
    applied++;
  }
  const cover = resolved.get("cover");
  if (cover) {
    update.cover = { type: "external", external: { url: cover } };
    applied++;
  }

  for (const [name, property] of Object.entries(page.properties)) {
    if (property.type === "url") {
      const url = resolved.get(propertyUrlSlot(property));
      if (url) {
        properties[name] = { url };
        applied++;
      }
      continue;
    }
    if (property.type !== "files") continue;

    let changed = 0;
    let complete = true;
    const files = property.files.map((file, index) => {
      const url = resolved.get(propertyFileSlot(property, index));
      if (url) changed++;
      const next = url ?? (file.type === "external" ? file.external.url : undefined);
      if (!next) complete = false;
      return { name: file.name, type: "external" as const, external: { url: next ?? "" } };
    });
    if (changed > 0 && complete) {
      properties[name] = { files };
      applied += changed;
    }
  }

  if (Object.keys(properties).length > 0) update.properties = properties;
  const hasChanges = Boolean(update.icon || update.cover || update.properties);
  return { update: hasChanges ? update : null, applied };
}

export type SweepDeps = {
  listPages(databaseId: string): AsyncIterable<PageObjectResponse>;
  listBlocks(pageId: string): Promise<MediaBlockLike[]>;
  persist(ref: NotionFileRef): Promise<string>;
  updateBlock(params: ReturnType<typeof mediaBlockUpdate>): Promise<void>;
  updatePage(params: PageUpdate): Promise<void>;
  sweptPages(): Promise<Record<string, string>>;
  markSwept(pageId: string, lastEditedTime: string): Promise<void>;
  purge(): Promise<void>;
  now(): number;
};

export type DatabaseSweepResult = {
  envKey: string;
  pagesScanned: number;
  pagesSkipped: number;
  found: number;
  persisted: number;
  writtenBack: number;
  failed: number;
  complete: boolean;
  error?: string;
};

export type SweepSummary = {
  dryRun: boolean;
  databases: DatabaseSweepResult[];
  found: number;
  persisted: number;
  writtenBack: number;
  failed: number;
  complete: boolean;
  purged: boolean;
};

type SweepOptions = {
  databases?: SweepDatabase[];
  dryRun?: boolean;
  /** Epoch ms after which no new page is started. */
  deadline: number;
  deps?: Partial<SweepDeps>;
};

async function sweepPage(
  page: PageObjectResponse,
  deps: SweepDeps,
  dryRun: boolean,
  result: DatabaseSweepResult,
): Promise<boolean> {
  const blocks = await deps.listBlocks(page.id);
  const media = collectMedia(blocks).filter((item) => isNotionTemporaryUrl(getMediaUrl(item)));
  const pageRefs = collectPageFileRefs(page);
  const found = media.length + pageRefs.length;
  result.found += found;
  if (found === 0) return true;
  if (dryRun) return false;

  let clean = true;

  for (const item of media) {
    const url = getMediaUrl(item)!;
    const persisted = await deps.persist({
      url,
      sourceId: item.id,
      slot: "block",
      kind: item.kind,
    });
    if (persisted === url) {
      result.failed++;
      clean = false;
      continue;
    }
    result.persisted++;
    try {
      await deps.updateBlock(mediaBlockUpdate(item, persisted));
      result.writtenBack++;
    } catch (error) {
      clean = false;
      result.failed++;
      logger.warn("[Notion images] Block write-back failed", {
        block_id: item.id,
        error_message: toErrorMessage(error),
      });
    }
  }

  const resolved = new Map<string, string>();
  for (const ref of pageRefs) {
    const persisted = await deps.persist(ref);
    if (persisted === ref.url) {
      result.failed++;
      clean = false;
      continue;
    }
    result.persisted++;
    resolved.set(ref.slot, persisted);
  }

  const { update, applied } = pageFileUpdate(page, resolved);
  if (applied < resolved.size) clean = false;
  if (update) {
    try {
      await deps.updatePage(update);
      result.writtenBack += applied;
    } catch (error) {
      clean = false;
      result.failed += applied;
      logger.warn("[Notion images] Page write-back failed", {
        page_id: page.id,
        error_message: toErrorMessage(error),
      });
    }
  }

  return clean;
}

/**
 * Walk every page of every site database, persist remaining Notion-hosted
 * files to R2, and write the R2 URL back into Notion so later reads skip the
 * work. Pages unchanged since their last clean sweep are skipped. Each
 * database gets a fair share of the remaining time; unfinished work resumes
 * on the next run.
 */
export async function sweepNotionImages(options: SweepOptions): Promise<SweepSummary> {
  const deps: SweepDeps = { ...defaultSweepDeps, ...options.deps };
  const databases = options.databases ?? sweepDatabases();
  const dryRun = options.dryRun ?? false;
  const swept = dryRun ? {} : await deps.sweptPages();

  const summary: SweepSummary = {
    dryRun,
    databases: [],
    found: 0,
    persisted: 0,
    writtenBack: 0,
    failed: 0,
    complete: true,
    purged: false,
  };

  for (const [index, database] of databases.entries()) {
    const remaining = databases.length - index;
    const databaseDeadline = deps.now() + (options.deadline - deps.now()) / remaining;
    const result: DatabaseSweepResult = {
      envKey: database.envKey,
      pagesScanned: 0,
      pagesSkipped: 0,
      found: 0,
      persisted: 0,
      writtenBack: 0,
      failed: 0,
      complete: true,
    };

    try {
      for await (const page of deps.listPages(database.databaseId)) {
        if (deps.now() > databaseDeadline) {
          result.complete = false;
          break;
        }
        if (swept[page.id] === page.last_edited_time) {
          result.pagesSkipped++;
          continue;
        }
        result.pagesScanned++;
        try {
          const clean = await sweepPage(page, deps, dryRun, result);
          if (clean && !dryRun) await deps.markSwept(page.id, page.last_edited_time);
        } catch (error) {
          result.failed++;
          logger.warn("[Notion images] Page sweep failed", {
            page_id: page.id,
            database: database.envKey,
            error_message: toErrorMessage(error),
          });
        }
      }
    } catch (error) {
      result.complete = false;
      result.error = toErrorMessage(error);
      logger.error("[Notion images] Database sweep failed", error, { database: database.envKey });
    }

    summary.databases.push(result);
    summary.found += result.found;
    summary.persisted += result.persisted;
    summary.writtenBack += result.writtenBack;
    summary.failed += result.failed;
    if (!result.complete) summary.complete = false;
  }

  if (summary.writtenBack > 0) {
    await deps.purge();
    summary.purged = true;
  }

  return summary;
}

// ===== Notion + Redis implementations =====

async function* listDatabasePages(databaseId: string): AsyncIterable<PageObjectResponse> {
  const dataSourceId = await getDataSourceId(databaseId);
  let cursor: string | undefined;
  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 100,
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    for (const page of response.results) {
      if (isFullPage(page)) yield page;
    }
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);
}

async function listBlockTree(blockId: string): Promise<MediaBlockLike[]> {
  const blocks: MediaBlockLike[] = [];
  let cursor: string | undefined;
  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    for (const block of response.results) {
      if (!("type" in block)) continue;
      blocks.push(block as MediaBlockLike);
      if (block.has_children && !SKIP_CHILDREN.has(block.type)) {
        blocks.push(...(await listBlockTree(block.id)));
      }
    }
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return blocks;
}

const defaultSweepDeps: SweepDeps = {
  listPages: listDatabasePages,
  listBlocks: listBlockTree,
  persist: (ref) => persistNotionImage(ref),
  async updateBlock(params) {
    await notion.blocks.update(params as Parameters<typeof notion.blocks.update>[0]);
  },
  async updatePage(params) {
    await notion.pages.update(params as Parameters<typeof notion.pages.update>[0]);
  },
  async sweptPages() {
    const client = getNotionCacheRedis();
    if (!client) return {};
    try {
      return (await client.hgetall<Record<string, string>>(SWEPT_PAGES_KEY)) ?? {};
    } catch (error) {
      logger.warn("[Notion images] Swept-page map read failed", {
        error_message: toErrorMessage(error),
      });
      return {};
    }
  },
  async markSwept(pageId, lastEditedTime) {
    const client = getNotionCacheRedis();
    if (!client) return;
    try {
      await client.hset(SWEPT_PAGES_KEY, { [pageId]: lastEditedTime });
    } catch (error) {
      logger.warn("[Notion images] Swept-page map write failed", {
        page_id: pageId,
        error_message: toErrorMessage(error),
      });
    }
  },
  async purge() {
    await purgeAllNotionContent();
  },
  now: () => Date.now(),
};
