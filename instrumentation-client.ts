import * as Sentry from "@sentry/nextjs";
import { initBotId } from "botid/client/core";

import { HN_BOTID_PROTECTED_ROUTES } from "@/lib/botid";

initBotId({
  protect: [...HN_BOTID_PROTECTED_ROUTES],
});

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Disable performance tracing (reserved span volume). Error monitoring stays enabled.
  tracesSampleRate: 0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
