import * as Sentry from "@sentry/nextjs";
import { initBotId } from "botid/client/core";

import { HN_BOTID_PROTECTED_ROUTES } from "@/lib/botid";
import { sentryOptions } from "@/lib/observability/sentry-options";

initBotId({
  protect: [...HN_BOTID_PROTECTED_ROUTES],
});

Sentry.init(sentryOptions);

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
