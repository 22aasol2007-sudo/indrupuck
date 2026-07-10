"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Banknote,
  Building2,
  Calendar,
  Inbox,
  Mail,
  MessageSquare,
  Package,
  Pencil,
  Phone,
  Ruler,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";

interface Inquiry {
  id: number;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  packageType: string | null;
  squareMeters: string | null;
  budget: string | null;
  message: string | null;
  source: string;
  status: string;
  managerComment: string | null;
  createdAt: string | null;
}

const statusLabels: Record<string, string> = {
  new: "Новая",
  contacted: "Связались",
  quoted: "КП отправлено",
  converted: "Переведена в заказ",
  rejected: "Отклонена",
};

const statusColors: Record<string, string> = {
  new: "bg-accent/10 text-accent ring-1 ring-accent/20",
  contacted: "bg-info/10 text-info",
  quoted: "bg-warning/10 text-warning",
  converted: "bg-success/10 text-success",
  rejected: "bg-danger/10 text-danger",
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState<Inquiry | null>(null);
  const [editForm, setEditForm] = useState({ status: "new", managerComment: "" });

  const fetchRequests = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (statusFilter) params.append("status", statusFilter);

    fetch(`/api/inquiries?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setRequests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(fetchRequests, 250);
    return () => clearTimeout(timeout);
  }, [search, statusFilter]);

  const stats = useMemo(() => ({
    total: requests.length,
    new: requests.filter((item) => item.status === "new").length,
    quoted: requests.filter((item) => item.status === "quoted").length,
    converted: requests.filter((item) => item.status === "converted").length,
  }), [requests]);

  const openEdit = (request: Inquiry) => {
    setEditing(request);
    setEditForm({
      status: request.status,
      managerComment: request.managerComment || "",
    });
  };

  const saveRequest = async () => {
    if (!editing) return;

    const response = await fetch(`/api/inquiries/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    if (response.ok) {
      setEditing(null);
      fetchRequests();
    }
  };

  const deleteRequest = async (id: number) => {
    if (!confirm("Удалить заявку?")) return;

    const response = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    if (response.ok) fetchRequests();
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text lg:text-3xl">Заявки на расчёт</h1>
        <p className="mt-1 text-text-muted">
          Здесь отображаются заявки, которые клиенты отправляют из личного кабинета и со страницы контактов.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="text-2xl font-bold text-text">{stats.total}</div>
          <div className="text-sm text-text-muted">Всего</div>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="text-2xl font-bold text-accent">{stats.new}</div>
          <div className="text-sm text-text-muted">Новых</div>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="text-2xl font-bold text-warning">{stats.quoted}</div>
          <div className="text-sm text-text-muted">КП отправлено</div>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="text-2xl font-bold text-success">{stats.converted}</div>
          <div className="text-sm text-text-muted">В заказ</div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-white p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по имени, телефону, компании..."
              className="w-full rounded-lg border border-border py-2.5 pl-10 pr-4 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-border bg-white px-4 py-2.5 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="">Все статусы</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-text-muted">Загрузка...</div>
        ) : requests.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-text-muted">
            <Inbox className="mb-3 h-12 w-12 opacity-30" />
            <p>Заявки не найдены</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {requests.map((request) => (
              <div key={request.id} className="p-5 transition-colors hover:bg-surface-alt">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-text">{request.name}</h3>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[request.status] || "bg-gray-100 text-gray-600"}`}>
                        {statusLabels[request.status] || request.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-sm text-text-muted md:grid-cols-2 xl:grid-cols-3">
                      <a href={`tel:${request.phone}`} className="flex items-center gap-2 hover:text-accent">
                        <Phone className="h-4 w-4" />
                        {request.phone}
                      </a>
                      {request.email && (
                        <a href={`mailto:${request.email}`} className="flex items-center gap-2 hover:text-accent">
                          <Mail className="h-4 w-4" />
                          {request.email}
                        </a>
                      )}
                      {request.company && <div className="flex items-center gap-2"><Building2 className="h-4 w-4" />{request.company}</div>}
                      {request.packageType && <div className="flex items-center gap-2"><Package className="h-4 w-4" />{request.packageType}</div>}
                      {request.squareMeters && <div className="flex items-center gap-2"><Ruler className="h-4 w-4" />{parseFloat(request.squareMeters).toLocaleString("ru-RU")} кв.м</div>}
                      {request.budget && <div className="flex items-center gap-2"><Banknote className="h-4 w-4" />{parseFloat(request.budget).toLocaleString("ru-RU")} ₽</div>}
                      {request.createdAt && <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{new Date(request.createdAt).toLocaleString("ru-RU")}</div>}
                    </div>

                    {request.message && (
                      <div className="mt-4 rounded-xl border border-border bg-white p-4 text-sm text-text-muted">
                        <div className="mb-1 flex items-center gap-2 font-medium text-text">
                          <MessageSquare className="h-4 w-4 text-accent" />
                          Комментарий клиента
                        </div>
                        {request.message}
                      </div>
                    )}

                    {request.managerComment && (
                      <div className="mt-3 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm text-text-muted">
                        <div className="mb-1 font-medium text-text">Комментарий администратора</div>
                        {request.managerComment}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 lg:flex-col">
                    <button
                      onClick={() => openEdit(request)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-white transition-colors hover:bg-primary-light"
                    >
                      <Pencil className="h-4 w-4" />
                      Обработать
                    </button>
                    <button
                      onClick={() => deleteRequest(request.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="text-lg font-semibold text-text">Обработка заявки #{editing.id}</h2>
                <p className="text-sm text-text-muted">{editing.name} · {editing.phone}</p>
              </div>
              <button onClick={() => setEditing(null)} className="rounded-lg p-2 hover:bg-surface-alt">
                <X className="h-5 w-5 text-text-muted" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Статус</label>
                <select
                  value={editForm.status}
                  onChange={(event) => setEditForm({ ...editForm, status: event.target.value })}
                  className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Комментарий администратора</label>
                <textarea
                  rows={5}
                  value={editForm.managerComment}
                  onChange={(event) => setEditForm({ ...editForm, managerComment: event.target.value })}
                  className="w-full resize-none rounded-lg border border-border px-4 py-2.5 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 font-medium hover:bg-surface-alt"
                >
                  Отмена
                </button>
                <button
                  onClick={saveRequest}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-medium text-white hover:bg-accent-light"
                >
                  <Save className="h-4 w-4" />
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
