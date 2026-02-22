import type {
  DatabaseObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { getAllBlocks } from "./blocks";
import { CACHE_TTLS, cachedNotionQuery } from "./cache";
import { notion } from "./client";
import {
  type AppDissectionDetail,
  type GoodWebsiteItem,
  type GoodWebsiteItemWithDate,
  hasProperties,
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
  type ProcessedBlock,
} from "./types";

async function getDataSourceId(databaseId: string): Promise<string> {
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

// ===== Generic Content Retrieval =====

export async function getFullContent(
  pageId: string,
): Promise<{ blocks: ProcessedBlock[]; metadata: NotionItem } | null> {
  return cachedNotionQuery(
    `notion:content:${pageId}`,
    async () => {
      const page = await notion.pages.retrieve({ page_id: pageId });

      if (!hasProperties(page)) return null;

      const pageWithProps = page as PageObjectResponse;
      const properties = pageWithProps.properties as {
        Name?: { title: { plain_text: string }[] };
        Category?: { select: { name: string } | null };
        Status?: { select: { name: string } | null };
        Published?: { date: { start: string } | null };
        Source?: { url: string };
        Slug?: { rich_text: { plain_text: string }[] };
      };

      const metadata: NotionItem = {
        id: pageWithProps.id,
        title: properties.Name?.title[0]?.plain_text || "Untitled",
        category: properties.Category?.select?.name || "Uncategorized",
        status: properties.Status?.select?.name || "Draft",
        createdTime: pageWithProps.created_time,
        published: properties.Published?.date?.start || pageWithProps.created_time,
        source: properties.Source?.url?.replace("https://", ""),
        slug: properties.Slug?.rich_text[0]?.plain_text || "",
      };

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

      const items = response.results
        .map((page) => {
          if (!hasProperties(page)) return null;

          const pageWithProps = page as PageObjectResponse;

          // Extract icon from page object
          const icon =
            pageWithProps.icon?.type === "file"
              ? pageWithProps.icon.file.url
              : pageWithProps.icon?.type === "external"
                ? pageWithProps.icon.external.url
                : pageWithProps.icon?.type === "emoji"
                  ? pageWithProps.icon.emoji
                  : undefined;

          const properties = pageWithProps.properties as {
            Name?: { title: { plain_text: string }[] };
            Slug?: { rich_text: { plain_text: string }[] };
            Description?: { rich_text: { plain_text: string }[] };
            Image?: { url: string };
            URL?: { url: string };
            Platforms?: { multi_select: { name: string }[] };
            Status?: { select: { name: string } | null };
            "Created time"?: { created_time: string };
            "Preview Image"?: { url: string };
            "Preview Image Dark"?: { url: string };
            "Preview Status"?: { select: { name: string } | null };
          };

          return {
            id: pageWithProps.id,
            name: properties.Name?.title[0]?.plain_text || "Untitled",
            slug: properties.Slug?.rich_text[0]?.plain_text || "",
            description: properties.Description?.rich_text[0]?.plain_text || undefined,
            image: properties.Image?.url || undefined,
            icon,
            url: properties.URL?.url || undefined,
            platforms: properties.Platforms?.multi_select.map((p) => p.name) || [],
            status: properties.Status?.select?.name || undefined,
            createdTime: properties["Created time"]?.created_time || pageWithProps.created_time,
            previewImage: properties["Preview Image"]?.url || undefined,
            previewImageDark: properties["Preview Image Dark"]?.url || undefined,
            previewStatus: properties["Preview Status"]?.select?.name as
              | "Queued"
              | "Processing"
              | "Done"
              | "Error"
              | undefined,
          } as NotionStackItem;
        })
        .filter((item): item is NotionStackItem => item !== null);

      return items;
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

      const items = response.results
        .map((page) => {
          if (!hasProperties(page)) return null;

          const pageWithProps = page as PageObjectResponse;

          // Extract icon from page object
          const icon =
            pageWithProps.icon?.type === "file"
              ? pageWithProps.icon.file.url
              : pageWithProps.icon?.type === "external"
                ? pageWithProps.icon.external.url
                : undefined;

          const properties = pageWithProps.properties as {
            Name?: { title: { plain_text: string }[] };
            URL?: { url: string };
            X?: { url: string };
            Tags?: { multi_select: { name: string }[] };
            "Preview Image"?: { url: string };
            "Preview Image Dark"?: { url: string };
            "Preview Status"?: { select: { name: string } | null };
          };

          return {
            id: pageWithProps.id,
            name: properties.Name?.title[0]?.plain_text || "Untitled",
            url: properties.URL?.url || undefined,
            x: properties.X?.url || undefined,
            icon,
            tags: properties.Tags?.multi_select.map((t) => t.name) || [],
            previewImage: properties["Preview Image"]?.url || undefined,
            previewImageDark: properties["Preview Image Dark"]?.url || undefined,
            previewStatus: properties["Preview Status"]?.select?.name as
              | "Queued"
              | "Processing"
              | "Done"
              | "Error"
              | undefined,
          } as GoodWebsiteItem;
        })
        .filter((item): item is GoodWebsiteItem => item !== null);

      return items;
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

      const items = response.results
        .map((page) => {
          if (!hasProperties(page)) return null;

          const pageWithProps = page as PageObjectResponse;

          const icon =
            pageWithProps.icon?.type === "file"
              ? pageWithProps.icon.file.url
              : pageWithProps.icon?.type === "external"
                ? pageWithProps.icon.external.url
                : undefined;

          const properties = pageWithProps.properties as {
            Name?: { title: { plain_text: string }[] };
            URL?: { url: string };
            X?: { url: string };
            Tags?: { multi_select: { name: string }[] };
            "Preview Image"?: { url: string };
            "Preview Image Dark"?: { url: string };
            "Preview Status"?: { select: { name: string } | null };
            "Created time"?: { created_time: string };
          };

          return {
            id: pageWithProps.id,
            name: properties.Name?.title[0]?.plain_text || "Untitled",
            url: properties.URL?.url || undefined,
            x: properties.X?.url || undefined,
            icon,
            tags: properties.Tags?.multi_select.map((t) => t.name) || [],
            previewImage: properties["Preview Image"]?.url || undefined,
            previewImageDark: properties["Preview Image Dark"]?.url || undefined,
            previewStatus: properties["Preview Status"]?.select?.name as
              | "Queued"
              | "Processing"
              | "Done"
              | "Error"
              | undefined,
            createdTime: properties["Created time"]?.created_time || pageWithProps.created_time,
          } as GoodWebsiteItemWithDate;
        })
        .filter((item): item is GoodWebsiteItemWithDate => item !== null);

      return items;
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

// ===== Writing Database =====

export async function getWritingDatabaseItems(
  cursor?: string,
  pageSize: number = 20,
): Promise<{ items: NotionItem[]; nextCursor: string | null }> {
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

      const items = response.results.map((page) => {
        if (!hasProperties(page)) return null;

        const pageWithProps = page as PageObjectResponse;
        const properties = pageWithProps.properties as {
          Name?: { title: { plain_text: string }[] };
          Published?: { date: { start: string } | null };
          URL?: { url: string };
          Slug?: { rich_text: { plain_text: string }[] };
          "Short ID"?: { rich_text: { plain_text: string }[] };
          Excerpt?: { rich_text: { plain_text: string }[] };
          FeatureImage?: { url: string };
        };

        return {
          id: pageWithProps.id,
          title: properties.Name?.title[0]?.plain_text || "Untitled",
          category: "Writing",
          status: "Published",
          createdTime: pageWithProps.created_time,
          published: properties.Published?.date?.start || pageWithProps.created_time,
          source: properties.URL?.url?.replace("https://", ""),
          slug: properties.Slug?.rich_text[0]?.plain_text || "",
          shortId: properties["Short ID"]?.rich_text[0]?.plain_text || undefined,
          excerpt: properties.Excerpt?.rich_text[0]?.plain_text || "",
          featureImage: properties.FeatureImage?.url || undefined,
        } as NotionItem;
      });

      return {
        items: items.filter((item): item is NotionItem => item !== null),
        nextCursor: response.has_more ? (response.next_cursor as string) : null,
      };
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

export async function getWritingPostContent(
  pageId: string,
): Promise<{ blocks: ProcessedBlock[]; metadata: NotionItem } | null> {
  return cachedNotionQuery(
    `notion:writing:content:${pageId}`,
    async () => {
      const page = await notion.pages.retrieve({ page_id: pageId });

      if (!hasProperties(page)) return null;

      const pageWithProps = page as PageObjectResponse;
      const properties = pageWithProps.properties as {
        Name?: { title: { plain_text: string }[] };
        Published?: { date: { start: string } | null };
        URL?: { url: string };
        Slug?: { rich_text: { plain_text: string }[] };
        "Short ID"?: { rich_text: { plain_text: string }[] };
        Excerpt?: { rich_text: { plain_text: string }[] };
        FeatureImage?: { url: string };
      };

      const metadata: NotionItem = {
        id: pageWithProps.id,
        title: properties.Name?.title[0]?.plain_text || "Untitled",
        category: "Writing",
        status: "Published",
        createdTime: pageWithProps.created_time,
        published: properties.Published?.date?.start || pageWithProps.created_time,
        source: properties.URL?.url?.replace("https://", ""),
        slug: properties.Slug?.rich_text[0]?.plain_text || "",
        shortId: properties["Short ID"]?.rich_text[0]?.plain_text || undefined,
        excerpt: properties.Excerpt?.rich_text[0]?.plain_text || "",
        featureImage: properties.FeatureImage?.url || undefined,
      };

      const blocks = await getAllBlocks(pageId);

      return { blocks, metadata };
    },
    { ttl: CACHE_TTLS.CONTENT },
  );
}

export async function getWritingPostContentBySlug(
  slug: string,
): Promise<{ blocks: ProcessedBlock[]; metadata: NotionItem } | null> {
  return cachedNotionQuery(
    `notion:writing:content:slug:${slug}`,
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
      if (!hasProperties(page)) return null;

      return getWritingPostContent(page.id);
    },
    { ttl: CACHE_TTLS.CONTENT },
  );
}

export async function getWritingPostByShortId(
  shortId: string,
): Promise<{ blocks: ProcessedBlock[]; metadata: NotionItem } | null> {
  return cachedNotionQuery(
    `notion:writing:content:shortid:${shortId}`,
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
      if (!hasProperties(page)) return null;

      return getWritingPostContent(page.id);
    },
    { ttl: CACHE_TTLS.CONTENT },
  );
}

// ===== AMA Database =====

export async function getAmaItemContent(pageId: string): Promise<NotionAmaItemWithContent | null> {
  return cachedNotionQuery(
    `notion:ama:content:${pageId}`,
    async () => {
      const page = await notion.pages.retrieve({ page_id: pageId });

      if (!hasProperties(page)) return null;

      const pageWithProps = page as PageObjectResponse;
      const properties = pageWithProps.properties as {
        Name?: { title: { plain_text: string }[] };
        Description?: { rich_text: { plain_text: string }[] };
        Status?: { select: { name: string } | null };
        "Answered At"?: { date: { start: string } | null };
        "Created At"?: { date: { start: string } | null };
      };

      const item: NotionAmaItem = {
        id: pageWithProps.id,
        title: properties.Name?.title[0]?.plain_text || "Untitled",
        description: properties.Description?.rich_text[0]?.plain_text || null,
        status: properties.Status?.select?.name || "Unanswered",
        answeredAt: properties["Answered At"]?.date?.start || pageWithProps.created_time,
        createdAt: properties["Created At"]?.date?.start || pageWithProps.created_time,
      };

      const blocks = await getAllBlocks(pageId);

      return {
        ...item,
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

      const items = response.results
        .map((page) => {
          if (!hasProperties(page)) return null;

          const pageWithProps = page as PageObjectResponse;
          const properties = pageWithProps.properties as {
            Name?: { title: { plain_text: string }[] };
            Description?: { rich_text: { plain_text: string }[] };
            Status?: { select: { name: string } | null };
            "Answered At"?: { date: { start: string } | null };
            "Created At"?: { date: { start: string } | null };
          };

          const basicItem: NotionAmaItem = {
            id: pageWithProps.id,
            title: properties.Name?.title[0]?.plain_text || "Untitled",
            description: properties.Description?.rich_text[0]?.plain_text || "",
            status: properties.Status?.select?.name || "Unanswered",
            answeredAt: properties["Answered At"]?.date?.start || pageWithProps.created_time,
            createdAt: properties["Created At"]?.date?.start || pageWithProps.created_time,
          };

          return basicItem;
        })
        .filter((item): item is NotionAmaItem => item !== null);

      return {
        items,
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

      const items = response.results
        .map((page) => {
          if (!hasProperties(page)) return null;

          const pageWithIcon = page as PageObjectResponse;
          const icon =
            pageWithIcon.icon?.type === "file"
              ? pageWithIcon.icon.file.url
              : pageWithIcon.icon?.type === "external"
                ? pageWithIcon.icon.external.url
                : undefined;

          const properties = pageWithIcon.properties as {
            Name?: { title: { plain_text: string }[] };
            Artist?: { rich_text: { plain_text: string }[] };
            Album?: { rich_text: { plain_text: string }[] };
            "Spotify URL"?: { url: string };
            "Played At"?: { date: { start: string } | null };
          };

          return {
            id: pageWithIcon.id,
            name: properties.Name?.title[0]?.plain_text || "Untitled",
            artist: properties.Artist?.rich_text[0]?.plain_text || "",
            album: properties.Album?.rich_text[0]?.plain_text || "",
            url: properties["Spotify URL"]?.url || undefined,
            playedAt: properties["Played At"]?.date?.start || pageWithIcon.created_time,
            image: icon,
          } as NotionListeningHistoryItem;
        })
        .filter((item): item is NotionListeningHistoryItem => item !== null);

      return {
        items,
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

      const items = response.results
        .map((page) => {
          if (!hasProperties(page)) return null;

          const pageWithProps = page as PageObjectResponse;
          const properties = pageWithProps.properties as {
            Name?: { title: { plain_text: string }[] };
            Slug?: { rich_text: { plain_text: string }[] };
            Description?: { rich_text: { plain_text: string }[] };
            "Episode Number"?: { number: number };
            "Published Date"?: { date: { start: string } | null };
            "Image URL"?: { url: string };
            "Audio URL (S3)"?: { url: string };
          };

          return {
            id: pageWithProps.id,
            title: properties.Name?.title[0]?.plain_text || "Untitled",
            slug: properties.Slug?.rich_text[0]?.plain_text || "",
            description: properties.Description?.rich_text[0]?.plain_text || undefined,
            episodeNumber: properties["Episode Number"]?.number || undefined,
            publishedDate: properties["Published Date"]?.date?.start || undefined,
            imageUrl: properties["Image URL"]?.url || undefined,
            audioUrl: properties["Audio URL (S3)"]?.url || undefined,
          } as NotionDesignDetailsEpisodeItem;
        })
        .filter((item): item is NotionDesignDetailsEpisodeItem => item !== null);

      return {
        items,
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

      const items = response.results
        .map((page) => {
          if (!hasProperties(page)) return null;

          const pageWithProps = page as PageObjectResponse;
          const properties = pageWithProps.properties as {
            Name?: { title: { plain_text: string }[] };
            Date?: { date: { start: string } | null };
            URL?: { url: string };
          };

          return {
            id: pageWithProps.id,
            title: properties.Name?.title[0]?.plain_text || "Untitled",
            date: properties.Date?.date?.start || pageWithProps.created_time,
            href: properties.URL?.url || undefined,
          } as NotionSpeakingItem;
        })
        .filter((item): item is NotionSpeakingItem => item !== null);

      return items;
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

      const items = response.results
        .map((page) => {
          if (!hasProperties(page)) return null;

          const pageWithProps = page as PageObjectResponse;
          const properties = pageWithProps.properties as {
            Title?: { title: { plain_text: string }[] };
            Published?: { date: { start: string } | null };
            "Short ID"?: { rich_text: { plain_text: string }[] };
          };

          return {
            id: pageWithProps.id,
            title: properties.Title?.title.map((t) => t.plain_text).join("") || "Untitled",
            published: properties.Published?.date?.start || pageWithProps.created_time,
            shortId: properties["Short ID"]?.rich_text[0]?.plain_text || undefined,
          } as NotionTilItem;
        })
        .filter((item): item is NotionTilItem => item !== null);

      return {
        items,
        nextCursor: response.has_more ? (response.next_cursor as string) : null,
      };
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

export async function getTilItemContent(pageId: string): Promise<NotionTilItemWithContent | null> {
  return cachedNotionQuery(
    `notion:til:content:${pageId}`,
    async () => {
      const page = await notion.pages.retrieve({ page_id: pageId });

      if (!hasProperties(page)) return null;

      const pageWithProps = page as PageObjectResponse;
      const properties = pageWithProps.properties as {
        Title?: { title: { plain_text: string }[] };
        Published?: { date: { start: string } | null };
        "Short ID"?: { rich_text: { plain_text: string }[] };
      };

      const item: NotionTilItem = {
        id: pageWithProps.id,
        title: properties.Title?.title.map((t) => t.plain_text).join("") || "Untitled",
        published: properties.Published?.date?.start || pageWithProps.created_time,
        shortId: properties["Short ID"]?.rich_text[0]?.plain_text || undefined,
      };

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
    `notion:til:content:shortid:${shortId}`,
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
      if (!hasProperties(page)) return null;

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

      const items = response.results
        .map((page) => {
          if (!hasProperties(page)) return null;

          const pageWithProps = page as PageObjectResponse;

          const icon =
            pageWithProps.icon?.type === "file"
              ? pageWithProps.icon.file.url
              : pageWithProps.icon?.type === "external"
                ? pageWithProps.icon.external.url
                : "";

          const properties = pageWithProps.properties as {
            Name?: { title: { plain_text: string }[] };
            Slug?: { rich_text: { plain_text: string }[] };
            Published?: { date: { start: string } | null };
            Icon?: { url: string };
            Status?: { select: { name: string } | null };
          };

          return {
            id: pageWithProps.id,
            name: properties.Name?.title[0]?.plain_text || "Untitled",
            slug: properties.Slug?.rich_text[0]?.plain_text || "",
            description: "",
            published: properties.Published?.date?.start || pageWithProps.created_time,
            icon: properties.Icon?.url || icon,
            status: properties.Status?.select?.name || "Draft",
          } as NotionAppDissectionItem;
        })
        .filter((item): item is NotionAppDissectionItem => item !== null);

      return items;
    },
    { ttl: CACHE_TTLS.LIST },
  );
}

export async function getAppDissectionItemBySlug(
  slug: string,
): Promise<NotionAppDissectionItemWithContent | null> {
  return cachedNotionQuery(
    `notion:app-dissection:content:${slug}`,
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
      if (!hasProperties(page)) return null;

      const pageWithProps = page as PageObjectResponse;

      const icon =
        pageWithProps.icon?.type === "file"
          ? pageWithProps.icon.file.url
          : pageWithProps.icon?.type === "external"
            ? pageWithProps.icon.external.url
            : "";

      const properties = pageWithProps.properties as {
        Name?: { title: { plain_text: string }[] };
        Slug?: { rich_text: { plain_text: string }[] };
        Published?: { date: { start: string } | null };
        Icon?: { url: string };
        Status?: { select: { name: string } | null };
      };

      // Get all blocks from the page
      const blocks = await getAllBlocks(page.id);

      // Parse blocks into intro and detail sections
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
            title: block.content.map((c) => c.text.content).join(""),
            descriptionBlocks: [],
          };
          continue;
        }

        if (block.type === "code" && block.language === "json" && currentDetail) {
          const jsonContent = block.content.map((c) => c.text.content).join("");
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

      return {
        id: pageWithProps.id,
        name: properties.Name?.title[0]?.plain_text || "Untitled",
        slug: properties.Slug?.rich_text[0]?.plain_text || "",
        description: "",
        published: properties.Published?.date?.start || pageWithProps.created_time,
        icon: properties.Icon?.url || icon,
        status: properties.Status?.select?.name || "Draft",
        introBlocks,
        details,
      };
    },
    { ttl: CACHE_TTLS.CONTENT },
  );
}
