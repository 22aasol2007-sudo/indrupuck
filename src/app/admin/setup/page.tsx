"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle, Database, Loader2, RefreshCw, Table2 } from "lucide-react";

interface Status {
  ok: boolean;
  adminReady: boolean;
  databaseConfigured: boolean;
  error?: string;
  requiredTables?: Array<{ name: string; exists: boolean }>;
  missingTables?: string[];
  counts?: Record<string, number | null>;
}

export default function AdminSetupPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = () => {
    setLoading(true);
    fetch("/api/admin/status", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => {
        setStatus({ ok: false, adminReady: false, databaseConfigured: false, error: "Не удалось проверить статус" });
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text lg:text-3xl">Подключение админ-панели</h1>
          <p className="mt-1 text-text-muted">Проверка базы данных и таблиц заявок.</p>
        </div>
        <button onClick={loadStatus} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-light">
          <RefreshCw className="h-4 w-4" />
          Обновить
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-accent/10 p-3"><Database className="h-6 w-6 text-accent" /></div>
            <div><h2 className="font-semibold text-text">База данных</h2><p className="text-sm text-text-muted">DATABASE_URL</p></div>
          </div>
          {loading ? <div className="flex items-center gap-2 text-text-muted"><Loader2 className="h-4 w-4 animate-spin" />Проверяем...</div> : status?.databaseConfigured ? <div className="flex gap-2 rounded-xl bg-success/10 p-3 text-success"><CheckCircle className="h-5 w-5" />Подключена</div> : <div className="flex gap-2 rounded-xl bg-danger/10 p-3 text-danger"><AlertCircle className="h-5 w-5" />DATABASE_URL не настроена</div>}
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-accent/10 p-3"><Table2 className="h-6 w-6 text-accent" /></div>
            <div><h2 className="font-semibold text-text">Таблицы</h2><p className="text-sm text-text-muted">Заявки и пользователи</p></div>
          </div>
          {loading ? <div className="flex items-center gap-2 text-text-muted"><Loader2 className="h-4 w-4 animate-spin" />Проверяем...</div> : status?.adminReady ? <div className="flex gap-2 rounded-xl bg-success/10 p-3 text-success"><CheckCircle className="h-5 w-5" />Все таблицы созданы</div> : <div className="flex gap-2 rounded-xl bg-warning/10 p-3 text-warning"><AlertCircle className="h-5 w-5" />Нужно создать таблицы</div>}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">Статус таблиц</h2>
        <div className="space-y-2">
          {(status?.requiredTables || []).map((table) => (
            <div key={table.name} className="flex items-center justify-between rounded-xl bg-surface-alt px-4 py-3">
              <span className="font-mono text-sm text-text">{table.name}</span>
              {table.exists ? <span className="text-sm font-medium text-success">есть</span> : <span className="text-sm font-medium text-danger">нет</span>}
            </div>
          ))}
          {!loading && !status?.requiredTables?.length && <p className="text-sm text-text-muted">Нет данных о таблицах.</p>}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-6">
        <h2 className="mb-2 font-semibold text-text">Что делать дальше</h2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-text-muted">
          <li>Если таблицы не созданы — выполните локально `npm run db:push` с вашим DATABASE_URL.</li>
          <li>Если администратор ещё не создан — откройте <Link href="/setup-admin" className="text-accent hover:underline">/setup-admin</Link>.</li>
          <li>После настройки откройте <Link href="/admin/requests" className="text-accent hover:underline">заявки на расчёт</Link>.</li>
        </ol>
      </div>
    </div>
  );
}
