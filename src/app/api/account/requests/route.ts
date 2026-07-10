import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

function normalize(value: unknown) {
  return String(value || "").trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = normalize(body.phone);
    const email = normalize(body.email).toLowerCase();

    if (!phone || !email) {
      return NextResponse.json(
        { error: "Введите телефон и email" },
        { status: 400 }
      );
    }

    const requests = await db
      .select({
        id: inquiries.id,
        name: inquiries.name,
        company: inquiries.company,
        phone: inquiries.phone,
        email: inquiries.email,
        packageType: inquiries.packageType,
        squareMeters: inquiries.squareMeters,
        budget: inquiries.budget,
        message: inquiries.message,
        status: inquiries.status,
        managerComment: inquiries.managerComment,
        createdAt: inquiries.createdAt,
        updatedAt: inquiries.updatedAt,
      })
      .from(inquiries)
      .where(and(eq(inquiries.phone, phone), eq(inquiries.email, email)))
      .orderBy(desc(inquiries.createdAt));

    return NextResponse.json(requests);
  } catch {
    return NextResponse.json(
      { error: "Не удалось получить заявки" },
      { status: 500 }
    );
  }
}
