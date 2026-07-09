import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, clients } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");

    const allOrders = await db
      .select({
        id: orders.id,
        clientId: orders.clientId,
        title: orders.title,
        description: orders.description,
        status: orders.status,
        squareMeters: orders.squareMeters,
        pricePerMeter: orders.pricePerMeter,
        totalAmount: orders.totalAmount,
        deadline: orders.deadline,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        clientName: clients.name,
      })
      .from(orders)
      .leftJoin(clients, eq(orders.clientId, clients.id))
      .orderBy(desc(orders.createdAt));

    let filtered = allOrders;

    if (status) {
      filtered = filtered.filter((o) => o.status === status);
    }

    if (clientId) {
      filtered = filtered.filter((o) => o.clientId === parseInt(clientId));
    }

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const totalAmount = (
      parseFloat(body.squareMeters) * parseFloat(body.pricePerMeter)
    ).toFixed(2);

    const [order] = await db
      .insert(orders)
      .values({
        ...body,
        totalAmount,
      })
      .returning();

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
