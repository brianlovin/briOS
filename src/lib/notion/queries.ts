import type { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { getAllBlocks } from "./blocks";
import { CACHE_TTLS, cachedNotionQuery, notionContentCacheKey } from "./cache";
import { notion } from "./client";
import {
  createdTime,
  dateStart,
  iconUrl,
  multiSelect,
  number,
  previewStatus,
  richText,
  select,
  title,
  url,
} from "./properties";
import {
  type AppDissectionDetail,
  type GoodWebsiteItem,
  type GoodWebsiteItemWithDate,
  isFullPage,
  isValidVideoMetadata,
  type NotionAmaItem,
  type NotionAmaItemWithContent,
  type NotionAppDissectionItem,
  type NotionAppDissectionItemWithContent,
  type NotionDesignDetailsEpisodeItem,
  type NotionItem,
  type NotionListeningHistoryItem,
  type NotionSpeakingItem,
  type NotionStackItem,
  type NotionTilItem,
  type NotionTilItemWithContent,
  type NotionWritingItem,
  type PageResponse,
  type ProcessedBlock,
  richTextPlainText,
} from "./types";

export async function getDataSourceId(databaseId: string): Promise<string> {
  return cachedNotionQuery(
    `notion:datasource:${databaseId}`,
    async () => {
      const database = (await notion.databases.retrieve({
        database_id: databaseId,
      })) as DatabaseObjectResponse;

      const dataSourceId = database.data_sources[0]?.id;
      if (!dataSourceId) {
        throw new Error(`No data source found for database ${databaseId}`);
      }

      return dataSourceId;
    },
    { ttl: CACHE_TTLS.DATA_SOURCE },
  );
}

function mapGenericItem(page: PageResponse): NotionItem | null {
  if (!isFullPage(page)) return null;
  const properties = page.properties;

  return {
    id: page.id,
    title: title(properties, "Name") ?? "Untitled",
    category: select(properties, "Category") ?? "Uncategorized",
    status: select(properties, "Status") ?? "Draft",
    createdTime: page.created_time,
    published: dateStart(properties, "Published") || page.created_time,
    source: url(properties, "Source")?.replace("https://", ""),
    slug: richText(properties, "Slug") ?? "",
  };
}

function mapStackItem(page: PageResponse): NotionStackItem | null {
  if (!isFullPage(page)) return null;
  const properties = page.properties;

  return {
    id: page.id,
    name: title(properties, "Name") ?? "Untitled",
    slug: richText(properties, "Slug") ?? "",
    description: richText(properties, "Description"),
    image: url(properties, "Image"),
    icon: iconUrl(page, { includeEmoji: true }),
    url: url(properties, "URL"),
    platforms: multiSelect(properties, "Platforms"),
    status: select(properties, "Status"),
    createdTime: createdTime(properties, "Created time") || page.created_time,
    previewImage: url(properties, "Preview Image"),
    previewImageDark: url(properties, "Preview Image Dark"),
    previewStatus: previewStatus(properties),
  };
}

function mapGoodWebsiteItem(page: PageResponse): GoodWebsiteItem | null {
  if (!isFullPage(page)) return null;
  const properties = page.properties;

  return {
    id: page.id,
    name: title(properties, "Name") ?? "Untitled",
    url: url(properties, "URL"),
    x: url(properties, "X"),
    icon: iconUrl(page),
    tags: multiSelect(properties, "Tags"),
    previewImage: url(properties, "Preview Image"),
    previewImageDark: url(properties, "Preview Image Dark"),
    previewStatus: previewStatus(properties),
  };
}

function mapGoodWebsiteItemWithDate(page: PageResponse): GoodWebsiteItemWithDate | null {
  const item = mapGoodWebsiteItem(page);
  if (!item || !isFullPage(page)) return null;

  return {
    ...item,
    createdTime: createdTime(page.properties, "Created time") || page.created_time,
  };
}

function mapWritingItem(page: PageResponse): NotionWritingItem | null {
  if (!isFullPage(page)) return null;
  const properties = page.properties;

  return {
    id: page.id,
    title: title(properties, "Name") ?? "Untitled",
    slug: richText(properties, "Slug") ?? "",
    published: dateStart(properties, "Published") || page.created_time,
    createdTime: page.created_time,
    shortId: richText(properties, "Short ID"),
    excerpt: richText(properties, "Excerpt"),
    featureImage: url(properties, "FeatureImage"),
    source: url(properties, "URL")?.replace("https://", ""),
  };
}

function mapAmaItem(page: PageResponse): NotionAmaItem | null {
  if (!isFullPage(page)) return null;
  const properties = page.properties;

  return {
    id: page.id,
    title: title(properties, "Name") ?? "Untitled",
    description: richText(properties, "Description") ?? "",
    status: select(properties, "Status") ?? "Unanswered",
    answeredAt: dateStart(properties, "Answered At") || page.created_time,
    createdAt: dateStart(properties, "Created At") || page.created_time,
  };
}

function mapListeningHistoryItem(page: PageResponse): NotionListeningHistoryItem | null {
  if (!isFullPage(page)) return null;
  const properties = page.properties;

  return {
    id: page.id,
    name: title(properties, "Name") ?? "Untitled",
    artist: richText(properties, "Artist") ?? "",
    album: richText(properties, "Album") ?? "",
    url: url(properties, "Spotify URL"),
    playedAt: dateStart(properties, "Played At") || page.created_time,
    image: iconUrl(page),
  };
}

function mapDesignDetailsEpisode(page: PageResponse): NotionDesignDetailsEpisodeItem | null {
  if (!isFullPage(page)) return null;
  const properties = page.properties;

  return {
    id: page.id,
    title: title(properties, "Name") ?? "Untitled",
    slug: richText(properties, "Slug") ?? "",
    description: richText(properties, "Description"),
    episodeNumber: number(properties, "Episode Number"),
    publishedDate: dateStart(properties, "Published Date"),
    imageUrl: url(properties, "Image URL"),
    audioUrl: url(properties, "Audio URL (S3)"),
  };
}

function mapSpeakingItem(page: PageResponse): NotionSpeakingItem | null {
  if (!isFullPage(page)) return null;
  const properties = page.properties;

  return {
    id: page.id,
    title: title(properties, "Name") ?? "Untitled",
    date: dateStart(properties, "Date") || page.created_time,
    href: url(properties, "URL"),
  };
}

function mapTilItem(page: PageResponse): NotionTilItem | null {
  if (!isFullPage(page)) return null;
  const properties = page.properties;

  return {
    id: page.id,
    title: title(properties, "Title") ?? "Untitled",
    published: dateStart(properties, "Published") || page.created_time,
    shortId: richText(properties, "Short ID"),
  };
}

function mapAppDissectionItem(page: PageResponse): NotionAppDissectionItem | null {
  if (!isFullPage(page)) return null;
  const properties = page.properties;

  return {
    id: page.id,
    name: title(properties, "Name") ?? "Untitled",
    slug: richText(properties, "Slug") ?? "",
    description: "",
    published: dateStart(properties, "Published") || page.created_time,
    icon: url(properties, "Icon") || iconUrl(page) || "",
    status: select(properties, "Status") ?? "Draft",
  };
}

function parseAppDissectionDetails(blocks: ProcessedBlock[]): {
  introBlocks: ProcessedBlock[];
  details: AppDissectionDetail[];
} {
  const introBlocks: ProcessedBlock[] = [];
  const details: AppDissectionDetail[] = [];

  let currentDetail: AppDissectionDetail | null = null;
  let inIntro = true;

  for (const block of blocks) {
    if (block.type === "divider") {
      inIntro = false;
      continue;
    }

    if (inIntro) {
      introBlocks.push(block);
      continue;
    }

    if (block.type === "heading_2") {
      if (currentDetail) {
        details.push(currentDetail);
      }
      currentDetail = {
        title: richTextPlainText(block.content),
        descriptionBlocks: [],
      };
      continue;
    }

    if (block.type === "code" && block.language === "json" && currentDetail) {
      const jsonContent = richTextPlainText(block.content);
      try {
        const parsed = JSON.parse(jsonContent);
        if (isValidVideoMetadata(parsed)) {
          currentDetail.video = parsed;
        } else {
          currentDetail.descriptionBlocks.push(block);
        }
      } catch {
        currentDetail.descriptionBlocks.push(block);
      }
      continue;
    }

    if (currentDetail) {
      currentDetail.descriptionBlocks.push(block);
    }
  }

  if (currentDetail) {
    details.push(currentDetail);
  }

  return { introBlocks, details };
}

// ===== Generic Content Retrieval =====

export async function getFullContent(
  pageId: string,
): Promise<{ blocks: ProcessedBlock[]; metadata: NotionItem } | null> {
  return cachedNotionQuery(
    notionContentCacheKey(null, pageId),
    async () => {
      const page = await notion.pages.retrieve({ page_id: pageId });
      const metadata = mapGenericItem(page);
      if (!metadata) return null;

      const blocks = await getAllBlocks(pageId);

      return { blocks, metadata };
    },
    { ttl: CACHE_TTLS.CONTENT },
  );
}

// ===== Stack Database =====

export async function getStackDatabaseItems(): Promise<NotionStackItem[]> {
  return cachedNotionQuery(
    "notion:stack:list",
    async () => {
      const databaseId = process.env.NOTION_STACK_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        sorts: [
          {
            property: "Name",
            direction: "ascending",
          },
        ],
      });

      return response.results
        .map(mapStackItem)
        .filter((item): item is NotionStackItem => item !== null);
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

// ===== Good Websites Database =====

export async function getGoodWebsitesDatabaseItems(): Promise<GoodWebsiteItem[]> {
  return cachedNotionQuery(
    "notion:good-websites:list",
    async () => {
      const databaseId = process.env.NOTION_GOOD_WEBSITES_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        sorts: [
          {
            property: "Name",
            direction: "ascending",
          },
        ],
      });

      return response.results
        .map(mapGoodWebsiteItem)
        .filter((item): item is GoodWebsiteItem => item !== null);
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

export async function getGoodWebsitesDatabaseItemsForRss(): Promise<GoodWebsiteItemWithDate[]> {
  return cachedNotionQuery(
    "notion:good-websites:rss",
    async () => {
      const databaseId = process.env.NOTION_GOOD_WEBSITES_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        sorts: [
          {
            property: "Created time",
            direction: "descending",
          },
        ],
      });

      return response.results
        .map(mapGoodWebsiteItemWithDate)
        .filter((item): item is GoodWebsiteItemWithDate => item !== null);
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

// ===== Writing Database =====

export async function getWritingDatabaseItems(
  cursor?: string,
  pageSize: number = 20,
): Promise<{ items: NotionWritingItem[]; nextCursor: string | null }> {
  return cachedNotionQuery(
    `notion:writing:list:${cursor || "start"}:${pageSize}`,
    async () => {
      const databaseId = process.env.NOTION_WRITING_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        page_size: pageSize,
        ...(cursor ? { start_cursor: cursor } : {}),
        filter: {
          property: "Published",
          date: {
            is_not_empty: true,
          },
        },
        sorts: [
          {
            property: "Published",
            direction: "descending",
          },
        ],
      });

      return {
        items: response.results
          .map(mapWritingItem)
          .filter((item): item is NotionWritingItem => item !== null),
        nextCursor: response.has_more ? (response.next_cursor as string) : null,
      };
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

export async function getWritingPostContent(
  pageId: string,
): Promise<{ blocks: ProcessedBlock[]; metadata: NotionWritingItem } | null> {
  return cachedNotionQuery(
    notionContentCacheKey("writing", pageId),
    async () => {
      const page = await notion.pages.retrieve({ page_id: pageId });
      const metadata = mapWritingItem(page);
      if (!metadata) return null;

      const blocks = await getAllBlocks(pageId);

      return { blocks, metadata };
    },
    { ttl: CACHE_TTLS.CONTENT },
  );
}

export async function getWritingPostContentBySlug(
  slug: string,
): Promise<{ blocks: ProcessedBlock[]; metadata: NotionWritingItem } | null> {
  return cachedNotionQuery(
    notionContentCacheKey("writing", "slug", slug),
    async () => {
      const databaseId = process.env.NOTION_WRITING_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          property: "Slug",
          rich_text: {
            equals: slug,
          },
        },
      });

      if (response.results.length === 0) {
        return null;
      }

      const page = response.results[0];
      if (!isFullPage(page)) return null;

      return getWritingPostContent(page.id);
    },
    { ttl: CACHE_TTLS.CONTENT },
  );
}

export async function getWritingPostByShortId(
  shortId: string,
): Promise<{ blocks: ProcessedBlock[]; metadata: NotionWritingItem } | null> {
  return cachedNotionQuery(
    notionContentCacheKey("writing", "shortid", shortId),
    async () => {
      const databaseId = process.env.NOTION_WRITING_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          property: "Short ID",
          rich_text: {
            equals: shortId,
          },
        },
      });

      if (response.results.length === 0) {
        return null;
      }

      const page = response.results[0];
      if (!isFullPage(page)) return null;

      return getWritingPostContent(page.id);
    },
    { ttl: CACHE_TTLS.CONTENT },
  );
}

// ===== AMA Database =====

export async function getAmaItemContent(pageId: string): Promise<NotionAmaItemWithContent | null> {
  return cachedNotionQuery(
    notionContentCacheKey("ama", pageId),
    async () => {
      const page = await notion.pages.retrieve({ page_id: pageId });
      const item = mapAmaItem(page);
      if (!item) return null;

      // List mapper uses "" for a missing description; content keeps null.
      const description = isFullPage(page)
        ? (richText(page.properties, "Description") ?? null)
        : null;

      const blocks = await getAllBlocks(pageId);

      return {
        ...item,
        description,
        blocks,
      };
    },
    { ttl: CACHE_TTLS.CONTENT },
  );
}

export async function getAmaDatabaseItems(
  cursor?: string,
  pageSize: number = 20,
): Promise<{ items: NotionAmaItem[]; nextCursor: string | null }> {
  return cachedNotionQuery(
    `notion:ama:list:${cursor || "start"}:${pageSize}`,
    async () => {
      const databaseId = process.env.NOTION_AMA_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        page_size: pageSize,
        ...(cursor ? { start_cursor: cursor } : {}),
        filter: {
          property: "Status",
          select: {
            equals: "Answered",
          },
        },
        sorts: [
          {
            property: "Answered At",
            direction: "descending",
          },
        ],
      });

      return {
        items: response.results
          .map(mapAmaItem)
          .filter((item): item is NotionAmaItem => item !== null),
        nextCursor: response.has_more ? (response.next_cursor as string) : null,
      };
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

// ===== Listening History Database =====

export async function getListeningHistoryDatabaseItems(
  cursor?: string,
  pageSize: number = 20,
): Promise<{ items: NotionListeningHistoryItem[]; nextCursor: string | null }> {
  return cachedNotionQuery(
    `notion:listening:list:${cursor || "start"}:${pageSize}`,
    async () => {
      const databaseId = process.env.NOTION_MUSIC_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        page_size: pageSize,
        ...(cursor ? { start_cursor: cursor } : {}),
        sorts: [
          {
            property: "Played At",
            direction: "descending",
          },
        ],
      });

      return {
        items: response.results
          .map(mapListeningHistoryItem)
          .filter((item): item is NotionListeningHistoryItem => item !== null),
        nextCursor: response.has_more ? (response.next_cursor as string) : null,
      };
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

// ===== Design Details Episodes Database =====

export async function getDesignDetailsEpisodeDatabaseItems(
  cursor?: string,
  pageSize: number = 20,
): Promise<{ items: NotionDesignDetailsEpisodeItem[]; nextCursor: string | null }> {
  return cachedNotionQuery(
    `notion:design-details:list:${cursor || "start"}:${pageSize}`,
    async () => {
      const databaseId = process.env.NOTION_DESIGN_DETAILS_EPISODES_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        page_size: pageSize,
        ...(cursor ? { start_cursor: cursor } : {}),
        sorts: [
          {
            property: "Episode Number",
            direction: "descending",
          },
        ],
      });

      return {
        items: response.results
          .map(mapDesignDetailsEpisode)
          .filter((item): item is NotionDesignDetailsEpisodeItem => item !== null),
        nextCursor: response.has_more ? (response.next_cursor as string) : null,
      };
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

// ===== Speaking Database =====

export async function getSpeakingItems(): Promise<NotionSpeakingItem[]> {
  return cachedNotionQuery(
    "notion:speaking:list",
    async () => {
      const databaseId = process.env.NOTION_SPEAKING_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        sorts: [
          {
            property: "Date",
            direction: "descending",
          },
        ],
      });

      return response.results
        .map(mapSpeakingItem)
        .filter((item): item is NotionSpeakingItem => item !== null);
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

// ===== TIL Database =====

export async function getTilDatabaseItems(
  cursor?: string,
  pageSize: number = 20,
): Promise<{ items: NotionTilItem[]; nextCursor: string | null }> {
  return cachedNotionQuery(
    `notion:til:list:${cursor || "start"}:${pageSize}`,
    async () => {
      const databaseId = process.env.NOTION_TIL_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        page_size: pageSize,
        ...(cursor ? { start_cursor: cursor } : {}),
        filter: {
          property: "Published",
          date: {
            is_not_empty: true,
          },
        },
        sorts: [
          {
            property: "Published",
            direction: "descending",
          },
        ],
      });

      return {
        items: response.results
          .map(mapTilItem)
          .filter((item): item is NotionTilItem => item !== null),
        nextCursor: response.has_more ? (response.next_cursor as string) : null,
      };
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

export async function getTilItemContent(pageId: string): Promise<NotionTilItemWithContent | null> {
  return cachedNotionQuery(
    notionContentCacheKey("til", pageId),
    async () => {
      const page = await notion.pages.retrieve({ page_id: pageId });
      const item = mapTilItem(page);
      if (!item) return null;

      const blocks = await getAllBlocks(pageId);

      return {
        ...item,
        blocks,
      };
    },
    { ttl: CACHE_TTLS.CONTENT },
  );
}

export async function getTilByShortId(shortId: string): Promise<NotionTilItemWithContent | null> {
  return cachedNotionQuery(
    notionContentCacheKey("til", "shortid", shortId),
    async () => {
      const databaseId = process.env.NOTION_TIL_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          property: "Short ID",
          rich_text: {
            equals: shortId,
          },
        },
      });

      if (response.results.length === 0) {
        return null;
      }

      const page = response.results[0];
      if (!isFullPage(page)) return null;

      return getTilItemContent(page.id);
    },
    { ttl: CACHE_TTLS.CONTENT },
  );
}

// ===== App Dissection Database =====

export async function getAppDissectionDatabaseItems(): Promise<NotionAppDissectionItem[]> {
  return cachedNotionQuery(
    "notion:app-dissection:list",
    async () => {
      const databaseId = process.env.NOTION_APP_DISSECTION_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          property: "Status",
          select: {
            equals: "Published",
          },
        },
        sorts: [
          {
            property: "Published",
            direction: "descending",
          },
        ],
      });

      return response.results
        .map(mapAppDissectionItem)
        .filter((item): item is NotionAppDissectionItem => item !== null);
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

export async function getAppDissectionItemBySlug(
  slug: string,
): Promise<NotionAppDissectionItemWithContent | null> {
  return cachedNotionQuery(
    notionContentCacheKey("app-dissection", slug),
    async () => {
      const databaseId = process.env.NOTION_APP_DISSECTION_DATABASE_ID || "";
      const dataSourceId = await getDataSourceId(databaseId);
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          and: [
            {
              property: "Slug",
              rich_text: {
                equals: slug,
              },
            },
            {
              property: "Status",
              select: {
                equals: "Published",
              },
            },
          ],
        },
      });

      if (response.results.length === 0) {
        return null;
      }

      const page = response.results[0];
      const item = mapAppDissectionItem(page);
      if (!item) return null;

      const blocks = await getAllBlocks(page.id);
      const { introBlocks, details } = parseAppDissectionDetails(blocks);

      return {
        ...item,
        introBlocks,
        details,
      };
    },
    { ttl: CACHE_TTLS.CONTENT },
  );
}
