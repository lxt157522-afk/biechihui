import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;
let dbClient: Database.Database;

export function getDb() {
  if (!instance) {
    dbClient = new Database("/tmp/data.db");
    dbClient.pragma("journal_mode = WAL");
    instance = drizzle(dbClient, { schema: fullSchema });

    // Auto-create tables if they don't exist
    try {
      dbClient.exec(`
        CREATE TABLE IF NOT EXISTS collections (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT NOT NULL,
          title TEXT NOT NULL,
          summary TEXT NOT NULL DEFAULT '',
          category TEXT NOT NULL DEFAULT 'article',
          tags TEXT NOT NULL DEFAULT '[]',
          source TEXT NOT NULL DEFAULT '网页',
          content_type TEXT NOT NULL DEFAULT 'article',
          created_at INTEGER DEFAULT (unixepoch()),
          is_read INTEGER NOT NULL DEFAULT 0,
          is_favorite INTEGER NOT NULL DEFAULT 0
        )
      `);
    } catch (e) {
      console.error("Failed to create tables:", e);
    }
  }
  return instance;
}
