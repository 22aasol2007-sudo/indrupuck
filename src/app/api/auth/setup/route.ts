import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";

async function ensureAdmin(email: string, password: string) {
  const normalized = email.toLowerCase();
  const hashed = await hash(password, 10);
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalized));

  if (existing) {
    await db
      .update(users)
      .set({ password: hashed, name: existing.name || "Администратор" })
      .where(eq(users.id, existing.id));
  } else {
    await db.insert(users).values({
      name: "Администратор",
      email: normalized,
      password: hashed,
      role: "admin",
    });
  }
  return normalized;
}

// Публичный bootstrap: создаёт/обновляет администратора.
// Берёт данные из env (CRM_ADMIN_EMAIL / CRM_ADMIN_PASSWORD)
// либо из тела запроса, либо значения по умолчанию.
export async function GET() {
  const email = process.env.CRM_ADMIN_EMAIL || "22aasol2007@gmail.com";
  const password = process.env.CRM_ADMIN_PASSWORD || "220310MartSol";
  const e = await ensureAdmin(email, password);
  return NextResponse.json({ ok: true, email: e });
}

export async function POST(req: Request) {
  let email = process.env.CRM_ADMIN_EMAIL || "22aasol2007@gmail.com";
  let password = process.env.CRM_ADMIN_PASSWORD || "220310MartSol";
  try {
    const body = await req.json();
    if (body?.email) email = body.email;
    if (body?.password) password = body.password;
  } catch {
    // тело отсутствует — используем env/умолчания
  }
  const e = await ensureAdmin(email, password);
  return NextResponse.json({ ok: true, email: e });
}
