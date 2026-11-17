import type * as Sentry from "@sentry/nextjs";

// Sentry v11 collects cookies, HTTP bodies, user IPs, database query data and
// AI/MCP payloads when `dataCollection` is unset. Keep the v10 baseline
// (`sendDefaultPii` off) so upgrading the SDK doesn't widen what leaves the app.
const NETWORK_IDENTITY_KEYS = ["forwarded", "-ip", "remote-", "via", "-user"];

export const sentryOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Disable performance tracing (reserved span volume). Error monitoring stays enabled.
  tracesSampleRate: 0,

  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: {
      request: { deny: NETWORK_IDENTITY_KEYS },
      response: { deny: NETWORK_IDENTITY_KEYS },
    },
    httpBodies: [],
    urlQueryParams: { deny: NETWORK_IDENTITY_KEYS },
    genAI: { inputs: false, outputs: false },
    mcp: { inputs: false, outputs: false },
    databaseQueryData: false,
    queues: false,
    graphQL: { document: false, variables: false },
  },
} satisfies Parameters<typeof Sentry.init>[0];
