"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Package,
  Ruler,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface CalcRequest {
  id: number;
  packagingType: string | null;
  volume: string | null;
  message: string | null;
  status: string;
  createdAt: Date | null;
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
  completed: "Выполнена",
  rejected: "Отклонена",
};

const packagingLabels: Record<string, string> = {
  boxes: "Гофрокороба",
  sheets: "Гофролисты",
  pallets: "Паллетные контейнеры",
  custom: "Упаковка под заказ",
  print: "Печать на упаковке",
};

export default function CabinetDashboard() {
  const [requests, setRequests] = useState<CalcRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    packagingType: "",
    volume: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/client/requests")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/client/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (res.ok) {
      setModalOpen(false);
      setForm({ packagingType: "", volume: "", message: "" });
      load();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Мои заявки на расчёт</h1>
          <p className="text-text-muted mt-1">
            Отправьте заявку — менеджер подготовит расчёт
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Новая заявка
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center text-text-muted">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>У вас пока нет заявок на расчёт.</p>
          <p className="text-sm mt-1">
            Нажмите «Новая заявка», чтобы отправить запрос менеджеру.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-border p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-text font-semibold">
                  <Package className="w-5 h-5 text-accent" />
                  {r.packagingType
                    ? packagingLabels[r.packagingType] || r.packagingType
                    : "Заявка на расчёт"}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[r.status] || "bg-gray-100 text-gray-600"}`}
                >
                  {statusLabels[r.status] || r.status}
                </span>
              </div>
              {r.volume && (
                <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
                  <Ruler className="w-4 h-4" />
                  Объём: {r.volume} кв.м
                </div>
              )}
              {r.message && (
                <div className="flex items-start gap-2 text-sm text-text-muted">
                  <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" />
                  {r.message}
                </div>
              )}
              <div className="text-xs text-text-muted mt-3">
                {r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString("ru-RU")
                  : ""}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-text">Новая заявка на расчёт</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg hover:bg-surface-alt transition-colors"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Тип упаковки</label>
                <select
                  value={form.packagingType}
                  onChange={(e) => setForm({ ...form, packagingType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white"
                >
                  <option value="">Выберите тип</option>
                  {Object.entries(packagingLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Объём (кв.м)</label>
                <input
                  type="number"
                  min="1000"
                  value={form.volume}
                  onChange={(e) => setForm({ ...form, volume: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="от 1 000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Комментарий</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                  placeholder="Детали вашего заказа..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-text font-medium hover:bg-surface-alt transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-accent hover:bg-accent-light text-white px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-60"
                >
                  {submitting ? "Отправка..." : "Отправить заявку"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
