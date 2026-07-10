import { NextRequest, NextResponse } from "next/server";
import { CRM_SESSION_COOKIE } from "@/lib/crm-auth";

export const dynamic = "force-dynamic";

function clearSession(response: NextResponse) {
  response.cookies.set(CRM_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearSession(response);
  return response;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  url.pathname = "/admin/login";
  url.search = "";
  const response = NextResponse.redirect(url);
  clearSession(response);
  return response;
}
