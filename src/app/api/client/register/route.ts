import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { createToken } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Укажите имя, email и пароль" },
        { status: 400 }
      );
    }

    const email = body.email.toLowerCase();
    const [existing] = await db
      .select()
      .from(clients)
      .where(eq(clients.email, email));

    if (existing) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже зарегистрирован" },
        { status: 400 }
      );
    }

    const hashed = await hash(body.password, 10);
    const [client] = await db
      .insert(clients)
      .values({
        name: body.name,
        email,
        phone: body.phone || null,
        type: "company",
        password: hashed,
      })
      .returning({ id: clients.id, email: clients.email });

    const token = await createToken({
      id: client.id,
      role: "client",
      email,
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
    return NextResponse.json(
      { error: "Не удалось зарегистрироваться" },
      { status: 500 }
    );
  }
}
