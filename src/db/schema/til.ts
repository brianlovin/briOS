import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const tilEntries = pgTable("til_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  shortId: text("short_id").unique(),
  content: text("content"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  notionId: text("notion_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
