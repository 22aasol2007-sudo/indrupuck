import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCrmAdminEmail, getCrmSecret } from "@/lib/crm-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admins = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.role, "admin"));

    return NextResponse.json({
      hasAdmin: admins.length > 0,
      adminCount: admins.length,
      defaultEmail: getCrmAdminEmail(),
    });
  } catch {
    return NextResponse.json(
      {
        hasAdmin: false,
        adminCount: 0,
        defaultEmail: getCrmAdminEmail(),
        error: "Cannot check admins. Make sure database tables are created.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const secret = getCrmSecret();

  if (!secret) {
    return NextResponse.json(
      { error: "CRM_SECRET is not configured" },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email || getCrmAdminEmail()).trim().toLowerCase();
  const name = String(body?.name || "Главный администратор").trim();
  const password = String(body?.password || "");

  if (password !== secret) {
    return NextResponse.json(
      { error: "Пароль должен совпадать с CRM_SECRET" },
      { status: 401 }
    );
  }

  try {
    const existingAdmins = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "admin"));

    if (existingAdmins.length > 0) {
      return NextResponse.json(
        { error: "Первый администратор уже создан" },
        { status: 409 }
      );
    }

    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [admin] = await db
      .insert(users)
      .values({
        name,
        email,
        password: passwordHash,
        role: "admin",
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    return NextResponse.json({ ok: true, admin }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Не удалось создать администратора. Проверьте DATABASE_URL и таблицу users." },
      { status: 500 }
    );
  }
}
