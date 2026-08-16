import { after } from "next/server";

import { type ActivityStore } from "./activity";
import { getActivityStore } from "./activity-redis";

export function afterActivity(record: (store: ActivityStore) => Promise<unknown>): void {
  const store = getActivityStore();
  if (!store) return;

  after(() => {
    void record(store).catch((error) => {
      console.error("[activity] ingest failed", error);
    });
  });
}
