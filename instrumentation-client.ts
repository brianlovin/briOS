import * as Sentry from "@sentry/nextjs";
import { initBotId } from "botid/client/core";

import { HN_BOTID_PROTECTED_ROUTES } from "@/lib/botid";
import {
  SENTRY_DENY_URLS,
  SENTRY_IGNORE_ERRORS,
} from "@/lib/observability/client-filters";

initBotId({
  protect: [...HN_BOTID_PROTECTED_ROUTES],
});

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Drop browser-extension noise (e.g. BRIOS-1 Safari runtime.sendMessage).
  ignoreErrors: SENTRY_IGNORE_ERRORS,
  denyUrls: SENTRY_DENY_URLS,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
