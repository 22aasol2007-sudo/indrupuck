"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Lock, Mail, User, Phone, Building2, AlertCircle } from "lucide-react";

export default function CabinetLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const url =
      mode === "login" ? "/api/client/login" : "/api/client/register";
    const body =
      mode === "login"
        ? { email: form.email, password: form.password }
        : form;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        router.push("/cabinet");
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error || "Ошибка");
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
            <div className="text-xs text-white/60">Личный кабинет</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="flex mb-6 bg-surface-alt rounded-xl p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "login" ? "bg-white shadow text-text" : "text-text-muted"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "register" ? "bg-white shadow text-text" : "text-text-muted"
              }`}
            >
              Регистрация
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">Компания / Имя</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="ООО Ваша компания"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-text mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="you@company.ru"
                />
              </div>
            </div>
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">Телефон</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-text mb-1">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              {loading ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>

          <p className="text-center text-text-muted text-xs mt-6">
            Нет аккаунта? Переключитесь на «Регистрацию» выше.
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-white/50 text-sm hover:text-white/80">
            ← На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
