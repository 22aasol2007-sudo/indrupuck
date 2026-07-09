"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShoppingCart,
  ClipboardList,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Package,
  Inbox,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardData {
  stats: {
    totalClients: number;
    totalOrders: number;
    totalTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    newOrders: number;
    processingOrders: number;
    productionOrders: number;
    completedOrders: number;
    totalRevenue: number;
    totalRequests: number;
    newRequests: number;
    inProgressRequests: number;
  };
  recentOrders: Array<{
    id: number;
    title: string;
    status: string;
    totalAmount: string;
    clientName: string | null;
    createdAt: Date | null;
  }>;
  recentTasks: Array<{
    id: number;
    title: string;
    status: string;
    priority: string;
    dueDate: string | null;
    clientName: string | null;
  }>;
}

const statusColors: Record<string, string> = {
  new: "bg-info/10 text-info",
  processing: "bg-warning/10 text-warning",
  production: "bg-accent/10 text-accent",
  ready: "bg-success/10 text-success",
  shipped: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
  pending: "bg-warning/10 text-warning",
  in_progress: "bg-accent/10 text-accent",
  high: "bg-danger/10 text-danger",
  medium: "bg-warning/10 text-warning",
  low: "bg-info/10 text-info",
  urgent: "bg-danger/10 text-danger",
};

const statusLabels: Record<string, string> = {
  new: "Новый",
  processing: "В обработке",
  production: "В производстве",
  ready: "Готов",
  shipped: "Отгружен",
  completed: "Выполнен",
  cancelled: "Отменен",
  pending: "Ожидает",
  in_progress: "В работе",
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
  urgent: "Срочный",
};

export default function CrmDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96 text-text-muted">
        Не удалось загрузить данные
      </div>
    );
  }

  const orderStatusData = [
    { name: "Новые", value: data.stats.newOrders, color: "#ff6b00" },
    { name: "В обработке", value: data.stats.processingOrders, color: "#f59e0b" },
    { name: "В производстве", value: data.stats.productionOrders, color: "#2a2a2a" },
    { name: "Выполнены", value: data.stats.completedOrders, color: "#16a34a" },
  ];

  const taskStatusData = [
    { name: "Ожидают", value: data.stats.pendingTasks, color: "#f59e0b" },
    { name: "В работе", value: data.stats.inProgressTasks, color: "#ff6b00" },
    { name: "Выполнены", value: data.stats.completedTasks, color: "#16a34a" },
  ];

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-text">Дашборд</h1>
        <p className="text-text-muted mt-1">Обзор ключевых показателей</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <Link href="/crm/clients" className="text-primary hover:text-accent">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="text-2xl font-bold text-text">{data.stats.totalClients}</div>
          <div className="text-sm text-text-muted">Клиентов</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-accent/10 p-2 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-accent" />
            </div>
            <Link href="/crm/orders" className="text-primary hover:text-accent">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="text-2xl font-bold text-text">{data.stats.totalOrders}</div>
          <div className="text-sm text-text-muted">Заказов</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-info/10 p-2 rounded-lg">
              <ClipboardList className="w-5 h-5 text-info" />
            </div>
            <Link href="/crm/tasks" className="text-primary hover:text-accent">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="text-2xl font-bold text-text">{data.stats.totalTasks}</div>
          <div className="text-sm text-text-muted">Задач</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-accent/10 p-2 rounded-lg">
              <Inbox className="w-5 h-5 text-accent" />
            </div>
            <Link href="/crm/requests" className="text-primary hover:text-accent">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="text-2xl font-bold text-text">{data.stats.totalRequests}</div>
          <div className="text-sm text-text-muted">
            Заявок {data.stats.newRequests > 0 && (
              <span className="text-accent font-semibold">({data.stats.newRequests} новых)</span>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-success/10 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="text-2xl font-bold text-text">
            {new Intl.NumberFormat("ru-RU").format(Math.round(data.stats.totalRevenue))} ₽
          </div>
          <div className="text-sm text-text-muted">Выручка</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-border">
          <h3 className="font-semibold text-text mb-4">Статусы заказов</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {orderStatusData.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-text-muted">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border">
          <h3 className="font-semibold text-text mb-4">Статусы задач</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {taskStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-text">Последние заказы</h3>
            <Link href="/crm/orders" className="text-sm text-primary hover:text-accent flex items-center gap-1">
              Все заказы <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {data.recentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-surface-alt transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-text">{order.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">{order.clientName || "—"}</span>
                  <span className="font-semibold text-text">
                    {new Intl.NumberFormat("ru-RU").format(parseFloat(order.totalAmount))} ₽
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-text">Последние задачи</h3>
            <Link href="/crm/tasks" className="text-sm text-primary hover:text-accent flex items-center gap-1">
              Все задачи <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {data.recentTasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-surface-alt transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-text">{task.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[task.priority] || "bg-gray-100 text-gray-600"}`}>
                    {statusLabels[task.priority] || task.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">{task.clientName || "—"}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status] || "bg-gray-100 text-gray-600"}`}>
                    {statusLabels[task.status] || task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
