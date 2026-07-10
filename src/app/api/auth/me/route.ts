import { NextRequest, NextResponse } from "next/server";
import {
  CRM_SESSION_COOKIE,
  getCrmSecret,
  getCrmSession,
} from "@/lib/crm-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = getCrmSecret();
  const token = request.cookies.get(CRM_SESSION_COOKIE)?.value;
  const session = await getCrmSession(token, secret);

  return NextResponse.json({
    authenticated: Boolean(session),
    email: session?.email || null,
    name: session?.name || null,
    role: session?.role || null,
  });
}
