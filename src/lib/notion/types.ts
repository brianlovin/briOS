import type {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

// Re-export generated Zod schemas and types
export {
  type AMA,
  AMASchema,
  type DesignDetailsEpisodes,
  DesignDetailsEpisodesSchema,
  type GoodWebsites,
  GoodWebsitesSchema,
  type Music,
  MusicSchema,
  type Speaking,
  SpeakingSchema,
  type Stack,
  StackSchema,
  type Writing,
  WritingSchema,
} from "../../../schemas/notionSchemas";

// Re-export commonly used Notion SDK types
export type {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
};

// Type for any page response (full or partial)
export type PageResponse =
  | PageObjectResponse
  | PartialPageObjectResponse
  | PartialDatabaseObjectResponse
  | DatabaseObjectResponse;

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
  tableWidth?: number;
  hasColumnHeader?: boolean;
  hasRowHeader?: boolean;
  cells?: RichTextItemResponse[][];
  tableRows?: ProcessedBlock[];
};

// Generic Notion item metadata
export type NotionItem = {
  id: string;
  title: string;
  category: string;
  status: string;
  createdTime: string;
  published?: string;
  previewBlocks?: ProcessedBlock[];
  source?: string;
  slug?: string;
  excerpt?: string;
  featureImage?: string;
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
};

// Good Website item type
export type GoodWebsiteItem = {
  id: string;
  name: string;
  url?: string;
  x?: string;
  icon?: string;
  tags?: string[];
};

// AMA item types
export type NotionAmaItem = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  answeredAt: string;
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

// Type guard to check if a page has properties
export function hasProperties(
  page: PageResponse,
): page is PageObjectResponse | PartialPageObjectResponse {
  return "properties" in page;
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
