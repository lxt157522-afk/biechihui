import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const collections = sqliteTable("collections", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  category: text("category").notNull().default("article"),
  tags: text("tags").notNull().default("[]"),
  source: text("source").notNull().default("网页"),
  contentType: text("content_type").notNull().default("article"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  isFavorite: integer("is_favorite", { mode: "boolean" }).notNull().default(false),
});
