"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Calculator,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  Package,
  Phone,
  Search,
  Send,
  ShieldCheck,
} from "lucide-react";

type SubmitStatus = "idle" | "loading" | "success" | "error";
type LookupStatus = "idle" | "loading" | "success" | "error";

interface ClientRequest {
  id: number;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  packageType: string | null;
  squareMeters: string | null;
  budget: string | null;
  message: string | null;
  status: string;
  managerComment: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

const statusLabels: Record<string, string> = {
  new: "Новая",
  contacted: "Менеджер связался",
  quoted: "КП отправлено",
  converted: "Передана в заказ",
  rejected: "Отклонена",
};

const statusColors: Record<string, string> = {
  new: "bg-accent/10 text-accent",
  contacted: "bg-info/10 text-info",
  quoted: "bg-warning/10 text-warning",
  converted: "bg-success/10 text-success",
  rejected: "bg-danger/10 text-danger",
};

const initialForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  packageType: "",
  squareMeters: "",
  budget: "",
  message: "",
};

export default function AccountPage() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>("idle");
  const [lookupData, setLookupData] = useState({ phone: "", email: "" });
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [error, setError] = useState("");
  const [lookupError, setLookupError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Не удалось отправить заявку");

      setStatus("success");
      setLookupData({ phone: formData.phone, email: formData.email });
      setFormData(initialForm);
    } catch {
      setStatus("error");
      setError("Заявка не отправлена. Попробуйте ещё раз или свяжитесь с нами по телефону.");
    }
  };

  const handleLookup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLookupStatus("loading");
    setLookupError("");

    try {
      const response = await fetch("/api/account/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lookupData),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Не удалось получить заявки");

      setRequests(data);
      setLookupStatus("success");
    } catch (err) {
      setRequests([]);
      setLookupStatus("error");
      setLookupError(err instanceof Error ? err.message : "Не удалось получить заявки");
    }
  };

  return (
    <div>
      <section className="bg-primary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-semibold text-accent-light">
              <Calculator className="h-4 w-4" />
              Личный кабинет клиента
            </div>
            <h1 className="mb-6 text-4xl font-bold text-white lg:text-5xl">
              Ваши заявки на расчёт
            </h1>
            <p className="text-lg leading-relaxed text-white/80">
              Отправьте новую заявку на расчёт гофроупаковки или посмотрите заявки, которые вы уже оставляли ранее.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text">Новая заявка</h2>
                <p className="mt-1 text-sm text-text-muted">
                  Заявка попадёт в админ-панель, менеджер рассчитает стоимость и свяжется с вами.
                </p>
              </div>
            </div>

            {status === "success" && (
              <div className="mb-5 flex gap-3 rounded-xl bg-success/10 p-4 text-success">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <div>
                  <div className="font-semibold">Заявка отправлена</div>
                  <p className="text-sm">Теперь вы можете посмотреть её в блоке «Мои заявки».</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mb-5 flex gap-3 rounded-xl bg-danger/10 p-4 text-danger">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Имя *</label>
                  <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="w-full rounded-xl border border-border px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Телефон *</label>
                  <input type="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} className="w-full rounded-xl border border-border px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20" required />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Компания</label>
                  <input value={formData.company} onChange={(event) => setFormData({ ...formData, company: event.target.value })} className="w-full rounded-xl border border-border px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Email *</label>
                  <input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="w-full rounded-xl border border-border px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20" required />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text">Тип упаковки</label>
                <select value={formData.packageType} onChange={(event) => setFormData({ ...formData, packageType: event.target.value })} className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20">
                  <option value="">Выберите тип</option>
                  <option value="Гофрокороба">Гофрокороба</option>
                  <option value="Гофролисты">Гофролисты</option>
                  <option value="Паллетные контейнеры">Паллетные контейнеры</option>
                  <option value="Упаковка под заказ">Упаковка под заказ</option>
                  <option value="Печать на упаковке">Печать на упаковке</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Объём, кв.м</label>
                  <input type="number" min="1000" value={formData.squareMeters} onChange={(event) => setFormData({ ...formData, squareMeters: event.target.value })} className="w-full rounded-xl border border-border px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder="от 1000" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Ориентировочный бюджет</label>
                  <input type="number" min="0" value={formData.budget} onChange={(event) => setFormData({ ...formData, budget: event.target.value })} className="w-full rounded-xl border border-border px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder="₽" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text">Комментарий</label>
                <textarea rows={4} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} className="w-full resize-none rounded-xl border border-border px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder="Размеры, прочность, печать, сроки, доставка..." />
              </div>

              <button type="submit" disabled={status === "loading"} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 font-semibold text-white transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60">
                <Send className="h-5 w-5" />
                {status === "loading" ? "Отправляем..." : "Отправить заявку"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-border bg-surface-alt p-6 lg:p-8">
            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-xl bg-accent/10 p-3">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text">Мои заявки</h2>
                <p className="mt-1 text-sm text-text-muted">
                  Введите телефон и email, указанные в заявке, чтобы увидеть историю ваших обращений.
                </p>
              </div>
            </div>

            <form onSubmit={handleLookup} className="mb-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Телефон *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                  <input type="tel" value={lookupData.phone} onChange={(event) => setLookupData({ ...lookupData, phone: event.target.value })} className="w-full rounded-xl border border-border py-3 pl-10 pr-4 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20" required />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                  <input type="email" value={lookupData.email} onChange={(event) => setLookupData({ ...lookupData, email: event.target.value })} className="w-full rounded-xl border border-border py-3 pl-10 pr-4 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20" required />
                </div>
              </div>
              <button type="submit" disabled={lookupStatus === "loading"} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-semibold text-white transition-colors hover:bg-primary-light disabled:opacity-60">
                <Search className="h-5 w-5" />
                {lookupStatus === "loading" ? "Ищем..." : "Показать мои заявки"}
              </button>
            </form>

            {lookupStatus === "error" && (
              <div className="mb-4 rounded-xl bg-danger/10 p-4 text-sm text-danger">{lookupError}</div>
            )}

            {lookupStatus === "success" && requests.length === 0 && (
              <div className="rounded-xl bg-white p-5 text-sm text-text-muted">
                Заявки не найдены. Проверьте телефон и email.
              </div>
            )}

            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="rounded-2xl border border-border bg-white p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-text">Заявка №{request.id}</div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[request.status] || "bg-gray-100 text-gray-600"}`}>
                      {statusLabels[request.status] || request.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-text-muted">
                    {request.packageType && <div>Тип упаковки: {request.packageType}</div>}
                    {request.squareMeters && <div>Объём: {Number(request.squareMeters).toLocaleString("ru-RU")} кв.м</div>}
                    {request.budget && <div>Бюджет: {Number(request.budget).toLocaleString("ru-RU")} ₽</div>}
                    {request.message && <div>Ваш комментарий: {request.message}</div>}
                    {request.managerComment && (
                      <div className="rounded-xl bg-accent/5 p-3 text-text">
                        Ответ менеджера: {request.managerComment}
                      </div>
                    )}
                    {request.createdAt && (
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-4 w-4" />
                        Создана: {new Date(request.createdAt).toLocaleString("ru-RU")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold text-text">
                <ShieldCheck className="h-5 w-5 text-accent" />
                Конфиденциальность
              </div>
              <p className="text-sm text-text-muted">
                Заявки показываются только по совпадению телефона и email, которые были указаны при отправке.
              </p>
            </div>

            <Link href="/contacts" className="mt-4 block text-center text-sm font-semibold text-accent hover:underline">
              Нужна помощь? Свяжитесь с нами
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
