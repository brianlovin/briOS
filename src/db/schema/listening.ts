import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const listeningHistory = pgTable("listening_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  artist: text("artist"),
  album: text("album"),
  spotifyUrl: text("spotify_url"),
  icon: text("icon"),
  playedAt: timestamp("played_at", { withTimezone: true }),
  notionId: text("notion_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
