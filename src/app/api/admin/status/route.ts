import { db, isDatabaseConfigured } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const requiredTables = [
  "inquiries",
  "clients",
  "orders",
  "tasks",
  "users",
  "activities",
];

export async function GET() {
  if (!isDatabaseConfigured) {
    return Response.json(
      {
        ok: false,
        adminReady: false,
        databaseConfigured: false,
        error: "DATABASE_URL is not configured",
        requiredTables: requiredTables.map((name) => ({ name, exists: false })),
        missingTables: requiredTables,
      },
      { status: 500 }
    );
  }

  try {
    const tableRows = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('inquiries', 'clients', 'orders', 'tasks', 'users', 'activities')
    `);

    const existingTables = new Set(
      tableRows.rows.map((row) => String(row.table_name))
    );

    const tables = requiredTables.map((name) => ({
      name,
      exists: existingTables.has(name),
    }));

    const missingTables = tables
      .filter((table) => !table.exists)
      .map((table) => table.name);

    const counts: Record<string, number | null> = {};

    if (missingTables.length === 0) {
      const countQueries = await Promise.all([
        db.execute(sql`SELECT COUNT(*)::int AS count FROM inquiries`),
        db.execute(sql`SELECT COUNT(*)::int AS count FROM users`),
      ]);

      counts.inquiries = Number(countQueries[0].rows[0]?.count ?? 0);
      counts.users = Number(countQueries[1].rows[0]?.count ?? 0);
    }

    return Response.json({
      ok: missingTables.length === 0,
      adminReady: missingTables.length === 0,
      databaseConfigured: true,
      requiredTables: tables,
      missingTables,
      counts,
    });
  } catch {
    return Response.json(
      {
        ok: false,
        adminReady: false,
        databaseConfigured: true,
        error: "Failed to check admin database status",
      },
      { status: 500 }
    );
  }
}
