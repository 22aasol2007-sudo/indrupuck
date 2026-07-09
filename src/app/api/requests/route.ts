import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { requests } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let allRequests = await db
      .select()
      .from(requests)
      .orderBy(desc(requests.createdAt));

    if (status) {
      allRequests = allRequests.filter((r) => r.status === status);
    }

    if (search) {
      const s = search.toLowerCase();
      allRequests = allRequests.filter((r) =>
        [r.name, r.company, r.phone, r.email].some(
          (f) => f && f.toLowerCase().includes(s)
        )
      );
    }

    return NextResponse.json(allRequests);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const [created] = await db.insert(requests).values(body).returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}
