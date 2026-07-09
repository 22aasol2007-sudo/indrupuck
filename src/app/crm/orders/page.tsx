"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Package,
  Calendar,
  Ruler,
  Banknote,
} from "lucide-react";

interface Order {
  id: number;
  clientId: number;
  title: string;
  description: string | null;
  status: string;
  squareMeters: string;
  pricePerMeter: string;
  totalAmount: string;
  deadline: string | null;
  createdAt: Date | null;
  clientName: string | null;
}

interface Client {
  id: number;
  name: string;
}

const statusColors: Record<string, string> = {
  new: "bg-info/10 text-info",
  processing: "bg-warning/10 text-warning",
  production: "bg-accent/10 text-accent",
  ready: "bg-success/10 text-success",
  shipped: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
};

const statusLabels: Record<string, string> = {
  new: "Новый",
  processing: "В обработке",
  production: "В производстве",
  ready: "Готов",
  shipped: "Отгружен",
  completed: "Выполнен",
  cancelled: "Отменен",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    clientId: "",
    title: "",
    description: "",
    status: "new",
    squareMeters: "",
    pricePerMeter: "",
    deadline: "",
  });

  const fetchOrders = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.append("status", statusFilter);
    fetch(`/api/orders?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchClients = () => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data));
  };

  useEffect(() => {
    fetchOrders();
    fetchClients();
  }, [statusFilter]);

  const openCreateModal = () => {
    setEditingOrder(null);
    setFormData({
      clientId: "",
      title: "",
      description: "",
      status: "new",
      squareMeters: "",
      pricePerMeter: "",
      deadline: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      clientId: String(order.clientId),
      title: order.title,
      description: order.description || "",
      status: order.status,
      squareMeters: order.squareMeters,
      pricePerMeter: order.pricePerMeter,
      deadline: order.deadline || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingOrder ? `/api/orders/${editingOrder.id}` : "/api/orders";
    const method = editingOrder ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        clientId: parseInt(formData.clientId),
      }),
    });

    if (res.ok) {
      setModalOpen(false);
      fetchOrders();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот заказ?")) return;
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (res.ok) fetchOrders();
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      (o.clientName && o.clientName.toLowerCase().includes(search.toLowerCase()))
  );

  const totalAmount = filteredOrders.reduce(
    (sum, o) => sum + parseFloat(o.totalAmount),
    0
  );

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text">Заказы</h1>
          <p className="text-text-muted mt-1">Управление заказами клиентов</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Новый заказ
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Поиск по названию или клиенту..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
          >
            <option value="">Все статусы</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-sm">
          <span className="text-text-muted">
            Заказов: <span className="font-semibold text-text">{filteredOrders.length}</span>
          </span>
          <span className="text-text-muted">
            Сумма: <span className="font-semibold text-text">
              {new Intl.NumberFormat("ru-RU").format(Math.round(totalAmount))} ₽
            </span>
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-text-muted">
            <ShoppingCart className="w-12 h-12 mb-3 opacity-30" />
            <p>Заказы не найдены</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-alt border-b border-border">
                <tr>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Заказ</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Клиент</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Статус</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Объем</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Цена/кв.м</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Сумма</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Срок</th>
                  <th className="text-right text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-alt transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 w-9 h-9 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-text">{order.title}</div>
                          {order.description && (
                            <div className="text-xs text-text-muted truncate max-w-[200px]">{order.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">{order.clientName || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">
                      <div className="flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5" />
                        {parseFloat(order.squareMeters).toLocaleString("ru-RU")} кв.м
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">
                      <div className="flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5" />
                        {parseFloat(order.pricePerMeter).toLocaleString("ru-RU")} ₽
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-sm text-text">
                        {new Intl.NumberFormat("ru-RU").format(parseFloat(order.totalAmount))} ₽
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {order.deadline && (
                        <div className="flex items-center gap-1 text-sm text-text-muted">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.deadline).toLocaleDateString("ru-RU")}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(order)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 rounded-lg hover:bg-danger/10 text-danger transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-text">
                {editingOrder ? "Редактировать заказ" : "Новый заказ"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg hover:bg-surface-alt transition-colors"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Клиент *</label>
                <select
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                >
                  <option value="">Выберите клиента</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Название заказа *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Например: Гофрокороба для электроники"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Описание</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Детали заказа..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Площадь (кв.м) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.squareMeters}
                    onChange={(e) => setFormData({ ...formData, squareMeters: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Цена за кв.м (₽) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.pricePerMeter}
                    onChange={(e) => setFormData({ ...formData, pricePerMeter: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="450"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Статус</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Срок выполнения</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
              {formData.squareMeters && formData.pricePerMeter && (
                <div className="bg-surface-alt p-3 rounded-lg">
                  <div className="text-sm text-text-muted">
                    Предварительная сумма: {" "}
                    <span className="font-semibold text-text">
                      {new Intl.NumberFormat("ru-RU").format(
                        parseFloat(formData.squareMeters) * parseFloat(formData.pricePerMeter)
                      )} ₽
                    </span>
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-text font-medium hover:bg-surface-alt transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-light text-white font-medium transition-colors"
                >
                  {editingOrder ? "Сохранить" : "Создать"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
