import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const fallbackDatabaseUrl = "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

export const databaseUrl = process.env.DATABASE_URL || fallbackDatabaseUrl;
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production") {
  console.warn(
    "DATABASE_URL is not configured. Database API routes will fail until DATABASE_URL is added to environment variables."
  );
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
