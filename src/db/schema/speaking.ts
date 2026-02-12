import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const speakingEvents = pgTable("speaking_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  date: timestamp("date", { withTimezone: true }),
  url: text("url"),
  notionId: text("notion_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
