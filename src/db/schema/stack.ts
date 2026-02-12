import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const stackItems = pgTable("stack_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  image: text("image"),
  icon: text("icon"),
  url: text("url"),
  platforms: text("platforms").array(),
  status: text("status").default("Active"),
  previewImage: text("preview_image"),
  previewImageDark: text("preview_image_dark"),
  previewStatus: text("preview_status"),
  notionId: text("notion_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
