"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle, KeyRound, Loader2, ShieldCheck } from "lucide-react";

export default function SetupAdminPage() {
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [adminCount, setAdminCount] = useState(0);
  const [name, setName] = useState("Главный администратор");
  const [email, setEmail] = useState("22aasol2007@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadStatus = () => {
    setLoading(true);
    fetch("/api/setup/admin", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setHasAdmin(Boolean(data.hasAdmin));
        setAdminCount(Number(data.adminCount || 0));
        if (data.defaultEmail) setEmail(data.defaultEmail);
        setLoading(false);
      })
      .catch(() => {
        setError("Не удалось проверить администраторов. Проверьте DATABASE_URL и таблицы БД.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/setup/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error || "Не удалось создать администратора");
      setSubmitting(false);
      return;
    }

    setMessage("Администратор создан. Теперь можно войти в CRM.");
    setHasAdmin(true);
    setAdminCount(1);
    setSubmitting(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)] bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="bg-primary p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Создание первого администратора</h1>
          <p className="mt-2 text-sm text-white/70">ИРУ CRM</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
              Проверяем статус...
            </div>
          ) : hasAdmin ? (
            <div className="space-y-5">
              <div className="rounded-xl bg-success/10 p-4 text-success flex gap-3">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <div>
                  <div className="font-semibold">Администратор уже создан</div>
                  <p className="text-sm">Количество администраторов: {adminCount}</p>
                </div>
              </div>
              {message && <div className="rounded-xl bg-success/10 p-4 text-sm text-success">{message}</div>}
              <Link
                href="/crm/login"
                className="block w-full rounded-xl bg-accent px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-accent-light"
              >
                Перейти ко входу в CRM
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-xl bg-accent/10 p-4 text-sm text-text-muted flex gap-3">
                <KeyRound className="h-5 w-5 shrink-0 text-accent" />
                <div>
                  <div className="font-semibold text-text">Введите пароль из CRM_SECRET</div>
                  <p>Для безопасности первый админ создаётся только если пароль совпадает с переменной Vercel `CRM_SECRET`.</p>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-danger/10 p-4 text-sm text-danger flex gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-text">Имя</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text">Пароль CRM_SECRET</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                  placeholder="Введите CRM_SECRET"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-white transition-colors hover:bg-accent-light disabled:opacity-60"
              >
                {submitting ? "Создаём..." : "Создать администратора"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
