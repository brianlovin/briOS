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
  GoodWebsiteItem,
  GoodWebsiteItemWithDate,
  Music,
  NotionAmaItem,
  NotionAmaItemWithContent,
  NotionDesignDetailsEpisodeItem,
  NotionItem,
  NotionListeningHistoryItem,
  NotionStackItem,
  NotionTilItem,
  NotionTilItemWithContent,
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
  // Good Websites
  getGoodWebsitesDatabaseItems,
  getGoodWebsitesDatabaseItemsForRss,
  // Listening History
  getListeningHistoryDatabaseItems,
  // Stack
  getStackDatabaseItems,
  // TIL
  getTilByShortId,
  getTilDatabaseItems,
  getTilItemContent,
  // Writing
  getWritingDatabaseItems,
  getWritingPostByShortId,
  getWritingPostContent,
  getWritingPostContentBySlug,
} from "./queries";

// Mutations
export {
  createAmaQuestion,
  createStackItem,
  updateStackItem,
  updateWritingShortId,
} from "./mutations";
