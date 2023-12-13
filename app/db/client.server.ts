import type { AppLoadContext } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";

let _database: ReturnType<typeof drizzle> | undefined;

export const getDb = (context: AppLoadContext) => {
  if (_database) return _database;

  _database = drizzle(context.env.DB, {
    logger: process.env.NODE_ENV === "development",
  });
  return _database;
};
