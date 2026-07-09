"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Lock, Mail, AlertCircle } from "lucide-react";

export default function CrmLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/crm");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Ошибка входа");
        setLoading(false);
      }
    } catch {
      setError("Ошибка соединения");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-accent p-2.5 rounded-xl">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div className="text-white">
            <div className="font-bold text-xl leading-tight">ИРУ</div>
            <div className="text-xs text-white/60">CRM — Панель управления</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-text mb-1">Вход в CRM</h1>
          <p className="text-text-muted text-sm mb-6">
            Введите данные учётной записи
          </p>

          {error && (
            <div className="mb-4 bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="admin@iru-pack.ru"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-light text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">
          Доступ только для сотрудников компании
        </p>
      </div>
    </div>
  );
}
