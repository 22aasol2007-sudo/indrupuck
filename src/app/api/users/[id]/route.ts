import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { getSession } from "@/lib/session";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const update: Record<string, unknown> = {};
    if (body.name) update.name = body.name;
    if (body.email) update.email = body.email.toLowerCase();
    if (body.role) update.role = body.role === "admin" ? "admin" : "manager";
    if (body.password) update.password = await hash(body.password, 10);

    const [user] = await db
      .update(users)
      .set(update)
      .where(eq(users.id, parseInt(id)))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Не удалось обновить пользователя" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("crm_session")?.value;
    const session = await getSession(token);

    // Нельзя удалить самого себя
    if (session && session.id === parseInt(id)) {
      return NextResponse.json(
        { error: "Нельзя удалить свою учётную запись" },
        { status: 400 }
      );
    }

    // Нельзя удалить последнего администратора
    const target = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(id)));
    if (target.length && target[0].role === "admin") {
      const admins = await db
        .select()
        .from(users)
        .where(eq(users.role, "admin"));
      if (admins.length <= 1) {
        return NextResponse.json(
          { error: "Нельзя удалить последнего администратора" },
          { status: 400 }
        );
      }
    }

    const [deleted] = await db
      .delete(users)
      .where(eq(users.id, parseInt(id)))
      .returning();
    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Не удалось удалить пользователя" },
      { status: 500 }
    );
  }
}
