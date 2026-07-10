import { NextRequest, NextResponse } from "next/server";
import { CRM_SESSION_COOKIE, getCrmSession } from "@/lib/crm-auth";

const protectedApiPrefixes = [
  "/api/admin",
  "/api/admins",
  "/api/clients",
  "/api/orders",
  "/api/tasks",
  "/api/dashboard",
  "/api/seed",
  "/api/requests",
];

function isProtectedApi(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/inquiries")) {
    return request.method !== "POST";
  }

  return protectedApiPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function isAdminLoginPath(pathname: string) {
  return pathname === "/admin/login";
}

function isAdminPanelPath(pathname: string) {
  return pathname.startsWith("/admin");
}

function isAdminOnlyPath(pathname: string) {
  return pathname.startsWith("/admin/users") || pathname.startsWith("/api/admins");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.CRM_SECRET || "";
  const token = request.cookies.get(CRM_SESSION_COOKIE)?.value;
  const session = await getCrmSession(token, secret);
  const authenticated = Boolean(session);

  if (isAdminPanelPath(pathname) && !isAdminLoginPath(pathname)) {
    if (!authenticated) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminOnlyPath(pathname) && session?.role !== "admin") {
      const adminUrl = request.nextUrl.clone();
      adminUrl.pathname = "/admin/requests";
      adminUrl.search = "";
      return NextResponse.redirect(adminUrl);
    }
  }

  if (isProtectedApi(request)) {
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isAdminOnlyPath(pathname) && session?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
