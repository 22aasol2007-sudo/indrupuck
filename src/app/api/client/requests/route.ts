import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clients, requests } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("client_session")?.value;
  const session = await getSession(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(requests)
    .where(eq(requests.clientId, session.id))
    .orderBy(desc(requests.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("client_session")?.value;
  const session = await getSession(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, session.id));

  const [reqRow] = await db
    .insert(requests)
    .values({
      clientId: session.id,
      name: client?.name || "",
      phone: client?.phone ?? "",
      email: client?.email || null,
      packagingType: body.packagingType || null,
      volume: body.volume || null,
      message: body.message || null,
      status: "new",
    })
    .returning();

  return NextResponse.json(reqRow, { status: 201 });
}
