import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, getSession } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Публичные эндпоинты всегда доступны
  if (pathname.startsWith("/api/auth")) return NextResponse.next();
  if (pathname.startsWith("/api/client/login")) return NextResponse.next();
  if (pathname.startsWith("/api/client/register")) return NextResponse.next();
  if (pathname === "/api/health") return NextResponse.next();
  if (pathname === "/api/seed") return NextResponse.next();

  const crmToken = req.cookies.get("crm_session")?.value;
  const clientToken = req.cookies.get("client_session")?.value;

  // Страница входа клиента
  if (pathname === "/cabinet/login") {
    const client = await getSession(clientToken);
    if (client?.role === "client") {
      return NextResponse.redirect(new URL("/cabinet", req.url));
    }
    return NextResponse.next();
  }

  // Кабинет клиента (страницы и API)
  if (pathname.startsWith("/cabinet") || pathname.startsWith("/api/client")) {
    const client = await getSession(clientToken);
    if (client?.role !== "client") {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/cabinet/login", req.url));
    }
    return NextResponse.next();
  }

  // Страница входа сотрудника
  if (pathname === "/crm/login") {
    const staff = await getSession(crmToken);
    if (staff?.role === "admin" || staff?.role === "manager") {
      return NextResponse.redirect(new URL("/crm", req.url));
    }
    return NextResponse.next();
  }

  // Только админ: управление пользователями
  if (pathname.startsWith("/crm/users") || pathname.startsWith("/api/users")) {
    const staff = await getSession(crmToken);
    if (staff?.role !== "admin") {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/crm", req.url));
    }
    return NextResponse.next();
  }

  // CRM (сотрудники): всё остальное в /crm и /api
  if (pathname.startsWith("/crm") || pathname.startsWith("/api")) {
    const staff = await getSession(crmToken);
    if (staff?.role !== "admin" && staff?.role !== "manager") {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/crm/login", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/crm/:path*", "/cabinet/:path*", "/api/:path*"],
};
