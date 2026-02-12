import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const writingPosts = pgTable("writing_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  shortId: text("short_id").unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  featureImage: text("feature_image"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  notionId: text("notion_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
