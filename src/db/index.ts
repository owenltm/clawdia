import path from "path";
import { migrate } from "drizzle-orm/mysql2/migrator";
export { db, pool } from "./client";
export * as schema from "./schema";
import { db } from "./client";

export async function runMigrations() {
  const migrationsFolder = path.resolve(process.cwd(), "drizzle");
  await migrate(db, { migrationsFolder });
}
