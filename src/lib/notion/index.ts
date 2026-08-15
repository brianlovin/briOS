// Client singleton
export { notion } from "./client";

// Types
export type {
  // SDK types
  BlockObjectResponse,
  DatabaseObjectResponse,
  GoodWebsiteItem,
  GoodWebsiteItemWithDate,
  NotionAmaItem,
  NotionAmaItemWithContent,
  NotionAppDissectionItem,
  NotionAppDissectionItemWithContent,
  NotionDesignDetailsEpisodeItem,
  NotionItem,
  NotionListeningHistoryItem,
  NotionSpeakingItem,
  NotionStackItem,
  NotionTilItem,
  NotionTilItemWithContent,
  NotionWritingItem,
  PageObjectResponse,
  PageResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
  PreviewStatus,
  ProcessedBlock,
  RichTextContent,
  RichTextItemResponse,
} from "./types";
export { PREVIEW_STATUSES } from "./types";

// Type guards and utilities
export { extractPlainText, hasProperties, isBlockObjectResponse, isFullPage } from "./types";

// Block processing
export { getAllBlocks, processBlockFromResponse } from "./blocks";

// Queries
export {
  getAmaDatabaseItems,
  // AMA
  getAmaItemContent,
  // App Dissection
  getAppDissectionDatabaseItems,
  getAppDissectionItemBySlug,
  // Design Details
  getDesignDetailsEpisodeDatabaseItems,
  // Generic
  getFullContent,
  // Good Websites
  getGoodWebsitesDatabaseItems,
  getGoodWebsitesDatabaseItemsForRss,
  // Listening History
  getListeningHistoryDatabaseItems,
  // Speaking
  getSpeakingItems,
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

// Cache
export { invalidateNotionCache } from "./cache";

// Mutations
export {
  createAmaQuestion,
  createStackItem,
  updateStackItem,
  updateWritingShortId,
} from "./mutations";
