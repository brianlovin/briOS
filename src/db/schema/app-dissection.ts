import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const appDissections = pgTable("app_dissections", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  icon: text("icon"),
  status: text("status").default("Published"),
  introContent: text("intro_content"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  notionId: text("notion_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const appDissectionDetails = pgTable("app_dissection_details", {
  id: uuid("id").primaryKey().defaultRandom(),
  appDissectionId: uuid("app_dissection_id")
    .notNull()
    .references(() => appDissections.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  videoMetadata: jsonb("video_metadata"),
  sortOrder: integer("sort_order"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
