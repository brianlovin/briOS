// Client singleton
export { notion } from "./client";

// Types
export type {
  AMA,
  // SDK types
  BlockObjectResponse,
  // Zod schemas and types
  DatabaseObjectResponse,
  DesignDetailsEpisodes,
  Music,
  NotionAmaItem,
  NotionAmaItemWithContent,
  NotionDesignDetailsEpisodeItem,
  NotionItem,
  NotionListeningHistoryItem,
  NotionStackItem,
  PageObjectResponse,
  PageResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
  ProcessedBlock,
  // Custom types
  RichTextContent,
  RichTextItemResponse,
  Stack,
  Writing,
} from "./types";

// Zod schemas
export {
  AMASchema,
  DesignDetailsEpisodesSchema,
  MusicSchema,
  StackSchema,
  WritingSchema,
} from "./types";

// Type guards and utilities
export { extractPlainText, hasProperties, isBlockObjectResponse } from "./types";

// Block processing
export { getAllBlocks, processBlockFromResponse } from "./blocks";

// Queries
export {
  getAmaDatabaseItems,
  // AMA
  getAmaItemContent,
  // Design Details
  getDesignDetailsEpisodeDatabaseItems,
  // Generic
  getFullContent,
  // Listening History
  getListeningHistoryDatabaseItems,
  // Stack
  getStackDatabaseItems,
  // Writing
  getWritingDatabaseItems,
  getWritingPostContent,
  getWritingPostContentBySlug,
} from "./queries";

// Mutations
export { createAmaQuestion, createStackItem, updateStackItem } from "./mutations";
