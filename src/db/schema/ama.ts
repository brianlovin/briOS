import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const amaQuestions = pgTable("ama_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("Pending"),
  answer: text("answer"),
  answeredAt: timestamp("answered_at", { withTimezone: true }),
  notionId: text("notion_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
