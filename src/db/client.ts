import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

// Create a MySQL connection pool from a standard MySQL connection URI
export const pool = mysql.createPool(databaseUrl);

// Create the Drizzle ORM instance
export const db = drizzle(pool, {
  // Enable basic query logging outside production if desired
  logger: process.env.NODE_ENV !== "production",
});

export type Db = typeof db;

