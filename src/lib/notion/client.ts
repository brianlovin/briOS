import { APIErrorCode, APIResponseError, Client } from "@notionhq/client";

const MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY_MS = 1000;

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (
        !APIResponseError.isAPIResponseError(error) ||
        error.code !== APIErrorCode.RateLimited ||
        attempt === MAX_RETRIES
      ) {
        throw error;
      }

      const headers = error.headers as Headers;
      const retryAfter = headers?.get("retry-after");
      const delayMs = retryAfter
        ? Number(retryAfter) * 1000
        : DEFAULT_RETRY_DELAY_MS * 2 ** attempt;

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

// Initialize Notion client with auto-retry on rate limits
const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const notion = {
  databases: {
    retrieve: (...args: Parameters<typeof notionClient.databases.retrieve>) =>
      withRetry(() => notionClient.databases.retrieve(...args)),
  },
  dataSources: {
    query: (...args: Parameters<typeof notionClient.dataSources.query>) =>
      withRetry(() => notionClient.dataSources.query(...args)),
    retrieve: (...args: Parameters<typeof notionClient.dataSources.retrieve>) =>
      withRetry(() => notionClient.dataSources.retrieve(...args)),
  },
  pages: {
    retrieve: (...args: Parameters<typeof notionClient.pages.retrieve>) =>
      withRetry(() => notionClient.pages.retrieve(...args)),
    create: (...args: Parameters<typeof notionClient.pages.create>) =>
      withRetry(() => notionClient.pages.create(...args)),
    update: (...args: Parameters<typeof notionClient.pages.update>) =>
      withRetry(() => notionClient.pages.update(...args)),
  },
  blocks: {
    update: (...args: Parameters<typeof notionClient.blocks.update>) =>
      withRetry(() => notionClient.blocks.update(...args)),
    children: {
      list: (...args: Parameters<typeof notionClient.blocks.children.list>) =>
        withRetry(() => notionClient.blocks.children.list(...args)),
    },
  },
};
