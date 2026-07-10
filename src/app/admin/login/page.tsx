"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Lock, Mail, Package, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin/requests";
  const [email, setEmail] = useState("22aasol2007@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось войти");
      }

      router.replace(next);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Не удалось войти");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-primary p-4 lg:min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-white shadow-2xl">
        <div className="bg-primary p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
            <Package className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Вход в админ-панель</h1>
          <p className="mt-2 text-sm text-white/70">Управление заявками на расчёт</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="flex gap-3 rounded-xl bg-accent/10 p-4 text-sm text-text-muted">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <div className="font-semibold text-text">Панель защищена</div>
              <p>Войдите как администратор или менеджер.</p>
            </div>
          </div>

          {error && (
            <div className="flex gap-3 rounded-xl bg-danger/10 p-4 text-sm text-danger">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-text">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-border py-3 pl-10 pr-4 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-border py-3 pl-10 pr-4 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-white transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
