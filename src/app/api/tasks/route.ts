import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks, clients, orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const allTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        priority: tasks.priority,
        clientId: tasks.clientId,
        orderId: tasks.orderId,
        assignedTo: tasks.assignedTo,
        dueDate: tasks.dueDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        clientName: clients.name,
      })
      .from(tasks)
      .leftJoin(clients, eq(tasks.clientId, clients.id))
      .leftJoin(orders, eq(tasks.orderId, orders.id))
      .orderBy(desc(tasks.createdAt));

    let filtered = allTasks;

    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (priority) {
      filtered = filtered.filter((t) => t.priority === priority);
    }

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [task] = await db.insert(tasks).values(body).returning();
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
