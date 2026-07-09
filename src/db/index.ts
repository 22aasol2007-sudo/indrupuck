import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

// Создаём пул соединений. Если DATABASE_URL не задан (например, на этапе
// сборки next build, когда переменные окружения ещё не подставлены),
// НЕ падаем с ошибкой — создаём пул с параметрами по умолчанию.
// Реальная ошибка подключения возникнет только при первом запросе к БД,
// когда DATABASE_URL уже будет доступен (в рантайме/Vercel).
export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool(databaseUrl ? { connectionString: databaseUrl } : {});

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
