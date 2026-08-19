// Client singleton
export { notion } from "./client";

// Types
export type {
  BlockObjectResponse,
  BulletedListItemBlock,
  CalloutBlock,
  DatabaseObjectResponse,
  DividerBlock,
  GoodWebsiteItem,
  GoodWebsiteItemWithDate,
  Heading1Block,
  Heading2Block,
  Heading3Block,
  ImageBlock,
  ListItemBlock,
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
  NumberedListItemBlock,
  PageObjectResponse,
  PageResponse,
  ParagraphBlock,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
  PreviewStatus,
  ProcessedBlock,
  ProcessedCodeBlock,
  QuoteBlock,
  RichTextContent,
  RichTextItemResponse,
  TableBlock,
  TableRowBlock,
  TodoBlock,
  ToggleBlock,
  VideoBlock,
} from "./types";
export { PREVIEW_STATUSES } from "./types";

// Type guards and utilities
export type { ListRun } from "./list-runs";
export { groupListRuns } from "./list-runs";
export {
  extractPlainText,
  hasProperties,
  isBlockObjectResponse,
  isFullPage,
  isListItemBlock,
  isTableRowBlock,
  richTextPlainText,
} from "./types";

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
export {
  CONTENT_CACHE_VERSION,
  invalidateNotionCache,
  isPlaceholderNotionBuild,
  notionContentCacheKey,
} from "./cache";

// Mutations
export {
  createAmaQuestion,
  createStackItem,
  updateStackItem,
  updateWritingShortId,
} from "./mutations";
