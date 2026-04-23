import { initBotId } from "botid/client/core";

import { HN_BOTID_PROTECTED_ROUTES } from "@/lib/botid";

initBotId({
  protect: [...HN_BOTID_PROTECTED_ROUTES],
});
