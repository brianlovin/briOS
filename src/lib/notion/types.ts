import type {
  BlockObjectResponse,
  DatabaseObjectResponse,
  DataSourceObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialDataSourceObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

// Re-export commonly used Notion SDK types
export type {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
};

export const PREVIEW_STATUSES = ["Queued", "Processing", "Done", "Error", "Pending"] as const;
export type PreviewStatus = (typeof PREVIEW_STATUSES)[number];

// Type for any page response (full or partial) - includes data source types for v5 SDK
export type PageResponse =
  | PageObjectResponse
  | PartialPageObjectResponse
  | PartialDatabaseObjectResponse
  | DatabaseObjectResponse
  | DataSourceObjectResponse
  | PartialDataSourceObjectResponse;

// Utility type to extract rich text content
export type RichTextContent = {
  type: string;
  text: {
    content: string;
    link?: string | undefined;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
};

// Processed block type for rendering
export type ProcessedBlock = {
  id: string;
  type: string;
  content: RichTextContent[];
  language?: string;
  videoUrl?: string;
  tableWidth?: number;
  hasColumnHeader?: boolean;
  hasRowHeader?: boolean;
  cells?: RichTextItemResponse[][];
  tableRows?: ProcessedBlock[];
  children?: ProcessedBlock[];
};

// Generic page metadata for getFullContent / useNotion. Collection-specific
// records (writing, stack, …) live in their own types below.
export type NotionItem = {
  id: string;
  title: string;
  category: string;
  status: string;
  createdTime: string;
  published?: string;
  source?: string;
  slug?: string;
};

export type NotionWritingItem = {
  id: string;
  title: string;
  slug: string;
  published: string;
  createdTime: string;
  shortId?: string;
  excerpt?: string;
  featureImage?: string;
  source?: string;
};

// Stack item type
export type NotionStackItem = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  url?: string;
  platforms?: string[];
  status?: string;
  createdTime: string;
  previewImage?: string;
  previewImageDark?: string;
  previewStatus?: PreviewStatus;
};

// Good Website item type
export type GoodWebsiteItem = {
  id: string;
  name: string;
  url?: string;
  x?: string;
  icon?: string;
  tags?: string[];
  previewImage?: string;
  previewImageDark?: string;
  previewStatus?: PreviewStatus;
};

// Good Website item type with date for RSS feed
export type GoodWebsiteItemWithDate = GoodWebsiteItem & {
  createdTime: string;
};

// AMA item types
export type NotionAmaItem = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  answeredAt: string;
  createdAt: string;
};

export type NotionAmaItemWithContent = NotionAmaItem & {
  blocks: ProcessedBlock[];
};

// Listening history item type
export type NotionListeningHistoryItem = {
  id: string;
  name: string;
  artist: string;
  album: string;
  url?: string;
  playedAt: string;
  image?: string;
};

// Design Details episode item type
export type NotionDesignDetailsEpisodeItem = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  episodeNumber?: number;
  publishedDate?: string;
  imageUrl?: string;
  audioUrl?: string;
};

// Speaking item type
export type NotionSpeakingItem = {
  id: string;
  title: string;
  date: string;
  href?: string;
};

// TIL item type
export type NotionTilItem = {
  id: string;
  title: string;
  published: string;
  shortId?: string;
};

export type NotionTilItemWithContent = NotionTilItem & {
  blocks: ProcessedBlock[];
};

// App Dissection types
export type NotionAppDissectionItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  published: string;
  icon: string;
  status: string;
};

export type AppDissectionVideoMetadata = {
  type: "app-dissection-video";
  urls: string[];
  orientation: "portrait" | "landscape";
};

export type AppDissectionDetail = {
  title: string;
  descriptionBlocks: ProcessedBlock[];
  video?: AppDissectionVideoMetadata;
};

export type NotionAppDissectionItemWithContent = NotionAppDissectionItem & {
  introBlocks: ProcessedBlock[];
  details: AppDissectionDetail[];
};

// Type guard to check if a page has properties
export function hasProperties(
  page: PageResponse,
): page is PageObjectResponse | PartialPageObjectResponse {
  return "properties" in page;
}

export function isFullPage(page: PageResponse): page is PageObjectResponse {
  return page.object === "page" && "properties" in page && "created_time" in page;
}

// Type guard for BlockObjectResponse
export function isBlockObjectResponse(block: unknown): block is BlockObjectResponse {
  return (
    typeof block === "object" &&
    block !== null &&
    "type" in block &&
    "id" in block &&
    typeof (block as { type: unknown }).type === "string"
  );
}

// Helper to extract plain text from rich text array
export function extractPlainText(richText: RichTextItemResponse[]): string {
  return richText.map((text) => text.plain_text).join("");
}

// Format a date string (YYYY-MM-DD) to "Month Year" format
export function formatPublishedDate(dateString: string): string {
  const [year, month] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Extract plain text from processed blocks
export function extractPreviewText(
  blocks: ProcessedBlock[],
  options: { maxBlocks?: number; separator?: string } = {},
): string {
  const { maxBlocks, separator = "\n\n" } = options;
  const paragraphs = blocks.filter((block) => block.type === "paragraph");
  const limited = maxBlocks ? paragraphs.slice(0, maxBlocks) : paragraphs;
  return limited.map((block) => block.content.map((c) => c.text.content).join("")).join(separator);
}

// Type guard for video metadata validation
export function isValidVideoMetadata(parsed: unknown): parsed is AppDissectionVideoMetadata {
  return (
    typeof parsed === "object" &&
    parsed !== null &&
    (parsed as AppDissectionVideoMetadata).type === "app-dissection-video" &&
    Array.isArray((parsed as AppDissectionVideoMetadata).urls) &&
    ["portrait", "landscape"].includes((parsed as AppDissectionVideoMetadata).orientation)
  );
}
