import { NextResponse } from "next/server";
import { db } from "@/db";
import { clients, orders, tasks, inquiries } from "@/db/schema";
import { eq, sql, count, desc } from "drizzle-orm";

export async function GET() {
  try {
    const totalClients = await db
      .select({ count: count() })
      .from(clients);

    const totalOrders = await db
      .select({ count: count() })
      .from(orders);

    const totalTasks = await db
      .select({ count: count() })
      .from(tasks);

    const totalInquiries = await db
      .select({ count: count() })
      .from(inquiries);

    const newInquiries = await db
      .select({ count: count() })
      .from(inquiries)
      .where(eq(inquiries.status, "new"));

    const pendingTasks = await db
      .select({ count: count() })
      .from(tasks)
      .where(eq(tasks.status, "pending"));

    const inProgressTasks = await db
      .select({ count: count() })
      .from(tasks)
      .where(eq(tasks.status, "in_progress"));

    const completedTasks = await db
      .select({ count: count() })
      .from(tasks)
      .where(eq(tasks.status, "completed"));

    const newOrders = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "new"));

    const processingOrders = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "processing"));

    const productionOrders = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "production"));

    const completedOrders = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "completed"));

    const totalRevenue = await db
      .select({ total: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)` })
      .from(orders);

    const recentOrders = await db
      .select({
        id: orders.id,
        title: orders.title,
        status: orders.status,
        totalAmount: orders.totalAmount,
        clientName: clients.name,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(clients, eq(orders.clientId, clients.id))
      .orderBy(desc(orders.createdAt))
      .limit(5);

    const recentTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        status: tasks.status,
        priority: tasks.priority,
        dueDate: tasks.dueDate,
        clientName: clients.name,
      })
      .from(tasks)
      .leftJoin(clients, eq(tasks.clientId, clients.id))
      .orderBy(desc(tasks.createdAt))
      .limit(5);

    return NextResponse.json({
      stats: {
        totalClients: totalClients[0].count,
        totalOrders: totalOrders[0].count,
        totalTasks: totalTasks[0].count,
        totalInquiries: totalInquiries[0].count,
        newInquiries: newInquiries[0].count,
        pendingTasks: pendingTasks[0].count,
        inProgressTasks: inProgressTasks[0].count,
        completedTasks: completedTasks[0].count,
        newOrders: newOrders[0].count,
        processingOrders: processingOrders[0].count,
        productionOrders: productionOrders[0].count,
        completedOrders: completedOrders[0].count,
        totalRevenue: totalRevenue[0].total,
      },
      recentOrders,
      recentTasks,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
