import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";
import {
  createCrmSessionToken,
  CRM_SESSION_COOKIE,
  CRM_SESSION_MAX_AGE,
  getCrmAdminEmail,
  getCrmSecret,
  type CrmRole,
} from "@/lib/crm-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(CRM_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CRM_SESSION_MAX_AGE,
  });
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
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  const adminEmail = getCrmAdminEmail().toLowerCase();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Введите почту и пароль" },
      { status: 400 }
    );
  }

  if (isDatabaseConfigured) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (user) {
        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
          return NextResponse.json(
            { error: "Неверная почта или пароль" },
            { status: 401 }
          );
        }

        const role: CrmRole = user.role === "admin" ? "admin" : "manager";
        const token = await createCrmSessionToken(user.email, secret, role, user.name);
        const response = NextResponse.json({
          ok: true,
          email: user.email,
          name: user.name,
          role,
        });
        setSessionCookie(response, token);
        return response;
      }
    } catch {
      // If the users table is not created yet, keep the env-based fallback admin available.
    }
  }

  if (email !== adminEmail || password !== secret) {
    return NextResponse.json(
      { error: "Неверная почта или пароль" },
      { status: 401 }
    );
  }

  const token = await createCrmSessionToken(adminEmail, secret, "admin", "Главный администратор");
  const response = NextResponse.json({
    ok: true,
    email: adminEmail,
    name: "Главный администратор",
    role: "admin",
  });
  setSessionCookie(response, token);
  return response;
}
