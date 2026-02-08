import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const designDetailsEpisodes = pgTable("design_details_episodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  description: text("description"),
  episodeNumber: integer("episode_number"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  imageUrl: text("image_url"),
  audioUrl: text("audio_url"),
  content: text("content"),
  notionId: text("notion_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
