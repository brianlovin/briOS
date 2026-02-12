import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const goodWebsites = pgTable("good_websites", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  xUrl: text("x_url"),
  icon: text("icon"),
  tags: text("tags").array(),
  previewImage: text("preview_image"),
  previewImageDark: text("preview_image_dark"),
  previewStatus: text("preview_status"),
  notionId: text("notion_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
