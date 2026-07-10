import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { desc } from "drizzle-orm";

function cleanString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase();

    const allInquiries = await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt));

    let filtered = allInquiries;

    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.phone.includes(search) ||
          item.email?.toLowerCase().includes(search) ||
          item.company?.toLowerCase().includes(search) ||
          item.message?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = cleanString(body.name);
    const phone = cleanString(body.phone);

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const squareMetersValue = cleanString(body.squareMeters);
    const budgetValue = cleanString(body.budget);

    const [createdInquiry] = await db
      .insert(inquiries)
      .values({
        name,
        company: cleanString(body.company),
        phone,
        email: cleanString(body.email),
        packageType: cleanString(body.packageType),
        squareMeters: squareMetersValue,
        budget: budgetValue,
        message: cleanString(body.message),
        source: body.source === "crm" ? "crm" : "website",
        status: "new",
      })
      .returning();

    return NextResponse.json(createdInquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create inquiry" },
      { status: 500 }
    );
  }
}
