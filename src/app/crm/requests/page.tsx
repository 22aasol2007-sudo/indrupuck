"use client";

import { useEffect, useState } from "react";
import {
  Inbox,
  Search,
  Trash2,
  X,
  Phone,
  Mail,
  Building2,
  Package,
  Ruler,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  UserPlus,
  Eye,
} from "lucide-react";

interface Request {
  id: number;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  packagingType: string | null;
  volume: string | null;
  message: string | null;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const statusColors: Record<string, string> = {
  new: "bg-accent/10 text-accent",
  in_progress: "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
  rejected: "bg-danger/10 text-danger",
};

const statusLabels: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  completed: "Обработана",
  rejected: "Отклонена",
};

const packagingLabels: Record<string, string> = {
  boxes: "Гофрокороба",
  sheets: "Гофролисты",
  pallets: "Паллетные контейнеры",
  custom: "Упаковка под заказ",
  print: "Печать на упаковке",
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewRequest, setViewRequest] = useState<Request | null>(null);
  const [message, setMessage] = useState("");

  const fetchRequests = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.append("status", statusFilter);
    if (search) params.append("search", search);
    fetch(`/api/requests?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, search]);

  const changeStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setRequests(
        requests.map((r) => (r.id === id ? { ...r, status } : r))
      );
      if (viewRequest && viewRequest.id === id) {
        setViewRequest({ ...viewRequest, status });
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить заявку?")) return;
    const res = await fetch(`/api/requests/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRequests(requests.filter((r) => r.id !== id));
      if (viewRequest && viewRequest.id === id) setViewRequest(null);
    }
  };

  const convertToClient = async (req: Request) => {
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: req.company || req.name,
        type: req.company ? "company" : "individual",
        email: req.email || "",
        phone: req.phone,
        contactPerson: req.company ? req.name : "",
        notes: `Создан из заявки #${req.id}`,
      }),
    });
    if (res.ok) {
      setMessage(`Клиент "${req.company || req.name}" создан из заявки`);
      setTimeout(() => setMessage(""), 3000);
      await changeStatus(req.id, "completed");
    }
  };

  const filtered =
    statusFilter || search
      ? requests
      : requests;

  const newCount = requests.filter((r) => r.status === "new").length;
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length;

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text">Заявки</h1>
          <p className="text-text-muted mt-1">
            Заявки от клиентов с сайта
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 px-4 py-2 rounded-xl text-sm">
            <span className="font-semibold text-accent">{newCount}</span>
            <span className="text-text-muted"> новых</span>
          </div>
          <div className="bg-warning/10 px-4 py-2 rounded-xl text-sm">
            <span className="font-semibold text-warning">{inProgressCount}</span>
            <span className="text-text-muted"> в работе</span>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-4 bg-success/10 border border-success/30 text-success px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Поиск по имени, компании, телефону..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white"
          >
            <option value="">Все статусы</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-text-muted">
            <Inbox className="w-12 h-12 mb-3 opacity-30" />
            <p>Заявки не найдены</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-alt border-b border-border">
                <tr>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Клиент</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Тип упаковки</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Объем</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Статус</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Дата</th>
                  <th className="text-right text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-surface-alt transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent/10 w-9 h-9 rounded-lg flex items-center justify-center">
                          {req.company ? (
                            <Building2 className="w-4 h-4 text-accent" />
                          ) : (
                            <Inbox className="w-4 h-4 text-accent" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-text">
                            {req.company || req.name}
                          </div>
                          <div className="text-xs text-text-muted">{req.name}</div>
                          <div className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            {req.phone}
                          </div>
                          {req.email && (
                            <div className="text-xs text-text-muted flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {req.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {req.packagingType ? (
                        <div className="flex items-center gap-1.5 text-sm text-text-muted">
                          <Package className="w-3.5 h-3.5" />
                          {packagingLabels[req.packagingType] || req.packagingType}
                        </div>
                      ) : (
                        <span className="text-sm text-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {req.volume ? (
                        <div className="flex items-center gap-1.5 text-sm text-text-muted">
                          <Ruler className="w-3.5 h-3.5" />
                          {req.volume}
                        </div>
                      ) : (
                        <span className="text-sm text-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={req.status}
                        onChange={(e) => changeStatus(req.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer outline-none ${statusColors[req.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value} className="text-text">
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString("ru-RU")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewRequest(req)}
                          className="p-2 rounded-lg hover:bg-accent/10 text-accent transition-colors"
                          title="Подробнее"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="p-2 rounded-lg hover:bg-danger/10 text-danger transition-colors"
                          title="Удалить"
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

      {/* Detail Modal */}
      {viewRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-text">
                Заявка #{viewRequest.id}
              </h2>
              <button
                onClick={() => setViewRequest(null)}
                className="p-2 rounded-lg hover:bg-surface-alt transition-colors"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-text-muted mb-1">Имя</div>
                  <div className="text-sm text-text flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-accent" />
                    {viewRequest.name}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-text-muted mb-1">Компания</div>
                  <div className="text-sm text-text flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-accent" />
                    {viewRequest.company || "—"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-text-muted mb-1">Телефон</div>
                  <a href={`tel:${viewRequest.phone}`} className="text-sm text-text flex items-center gap-2 hover:text-accent transition-colors">
                    <Phone className="w-4 h-4 text-accent" />
                    {viewRequest.phone}
                  </a>
                </div>
                <div>
                  <div className="text-xs font-medium text-text-muted mb-1">Email</div>
                  <a href={`mailto:${viewRequest.email}`} className="text-sm text-text flex items-center gap-2 hover:text-accent transition-colors">
                    <Mail className="w-4 h-4 text-accent" />
                    {viewRequest.email || "—"}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-text-muted mb-1">Тип упаковки</div>
                  <div className="text-sm text-text flex items-center gap-2">
                    <Package className="w-4 h-4 text-accent" />
                    {viewRequest.packagingType
                      ? packagingLabels[viewRequest.packagingType] || viewRequest.packagingType
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-text-muted mb-1">Объем</div>
                  <div className="text-sm text-text flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-accent" />
                    {viewRequest.volume ? `${viewRequest.volume} кв.м` : "—"}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-text-muted mb-1">Сообщение</div>
                <div className="text-sm text-text flex items-start gap-2 bg-surface-alt p-3 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  {viewRequest.message || "—"}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-text-muted mb-1">Статус</div>
                <select
                  value={viewRequest.status}
                  onChange={(e) => changeStatus(viewRequest.id, e.target.value)}
                  className={`text-sm px-3 py-2 rounded-lg font-medium border border-border cursor-pointer outline-none ${statusColors[viewRequest.status] || "bg-gray-100 text-gray-600"}`}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value} className="text-text">
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => convertToClient(viewRequest)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  В клиенты
                </button>
                <button
                  onClick={() => handleDelete(viewRequest.id)}
                  className="px-4 py-2.5 rounded-xl border border-danger/30 text-danger font-medium hover:bg-danger/10 transition-colors inline-flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
