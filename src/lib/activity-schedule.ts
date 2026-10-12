import { after } from "next/server";

import { logger } from "@/lib/logger";

import { type ActivityStore } from "./activity";
import { getActivityStore } from "./activity-redis";

export function afterActivity(record: (store: ActivityStore) => Promise<unknown>): void {
  const store = getActivityStore();
  if (!store) return;

  after(async () => {
    try {
      await record(store);
    } catch (error) {
      logger.error("[activity] ingest failed", error);
    }
  });
}
