import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Публичные эндпоинты всегда доступны
  if (pathname.startsWith("/api/auth")) return NextResponse.next();
  if (pathname === "/api/health") return NextResponse.next();
  if (pathname === "/api/seed") return NextResponse.next();

  const token = req.cookies.get("crm_session")?.value;
  const valid = await verifyToken(token);

  // Страница входа: если уже авторизованы — сразу в CRM
  if (pathname === "/crm/login") {
    if (valid) return NextResponse.redirect(new URL("/crm", req.url));
    return NextResponse.next();
  }

  // Всё остальное в /crm и /api — только для авторизованных
  if (!valid) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/crm/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/crm/:path*", "/api/:path*"],
};
