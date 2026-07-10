import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { createToken } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Введите email и пароль" },
        { status: 400 }
      );
    }

    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.email, email.toLowerCase()));

    if (!client || !client.password) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    if (!(await compare(password, client.password))) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    const token = await createToken({
      id: client.id,
      role: "client",
      email: client.email ?? email,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("client_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Ошибка входа" }, { status: 500 });
  }
}
