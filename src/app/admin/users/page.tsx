"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Crown,
  KeyRound,
  Pencil,
  Plus,
  Save,
  Shield,
  Trash2,
  UserCog,
  X,
} from "lucide-react";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | string;
  createdAt: string | null;
}

const roleLabels: Record<string, string> = {
  admin: "Администратор",
  manager: "Менеджер",
};

const roleColors: Record<string, string> = {
  admin: "bg-accent/10 text-accent ring-1 ring-accent/20",
  manager: "bg-primary/10 text-primary",
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "manager" as "admin" | "manager",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/admins")
      .then((response) => response.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role === "admin" ? "admin" : "manager",
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const url = editingUser ? `/api/admins/${editingUser.id}` : "/api/admins";
    const method = editingUser ? "PUT" : "POST";

    const body: Record<string, string> = {
      name: form.name,
      email: form.email,
      role: form.role,
    };

    if (form.password) body.password = form.password;

    if (!editingUser && !form.password) {
      setError("Для нового пользователя нужен пароль");
      return;
    }

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error || "Не удалось сохранить пользователя");
      return;
    }

    setModalOpen(false);
    fetchUsers();
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Удалить пользователя ${user.email}?`)) return;

    const response = await fetch(`/api/admins/${user.id}`, { method: "DELETE" });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      alert(data?.error || "Не удалось удалить пользователя");
      return;
    }

    fetchUsers();
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text lg:text-3xl">Пользователи админ-панели</h1>
          <p className="mt-1 text-text-muted">Добавляйте администраторов и менеджеров.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-medium text-white transition-colors hover:bg-accent-light"
        >
          <Plus className="h-5 w-5" />
          Добавить пользователя
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-accent/10 p-3"><Crown className="h-6 w-6 text-accent" /></div>
            <div><div className="text-2xl font-bold text-text">{users.filter((u) => u.role === "admin").length}</div><div className="text-sm text-text-muted">Администраторов</div></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3"><Shield className="h-6 w-6 text-primary" /></div>
            <div><div className="text-2xl font-bold text-text">{users.filter((u) => u.role !== "admin").length}</div><div className="text-sm text-text-muted">Менеджеров</div></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-success/10 p-3"><UserCog className="h-6 w-6 text-success" /></div>
            <div><div className="text-2xl font-bold text-text">{users.length}</div><div className="text-sm text-text-muted">Всего</div></div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-text-muted">Загрузка...</div>
        ) : users.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-text-muted">
            <UserCog className="mb-3 h-12 w-12 opacity-30" />
            <p>Пока нет пользователей</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-surface-alt">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Пользователь</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Роль</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Создан</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-muted">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-surface-alt">
                    <td className="px-4 py-4"><div className="font-medium text-text">{user.name}</div><div className="text-sm text-text-muted">{user.email}</div></td>
                    <td className="px-4 py-4"><span className={`rounded-full px-2 py-1 text-xs font-medium ${roleColors[user.role] || roleColors.manager}`}>{roleLabels[user.role] || user.role}</span></td>
                    <td className="px-4 py-4 text-sm text-text-muted">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("ru-RU") : "—"}</td>
                    <td className="px-4 py-4"><div className="flex items-center justify-end gap-2"><button onClick={() => openEditModal(user)} className="rounded-lg p-2 text-primary hover:bg-primary/10"><Pencil className="h-4 w-4" /></button><button onClick={() => handleDelete(user)} className="rounded-lg p-2 text-danger hover:bg-danger/10"><Trash2 className="h-4 w-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-5 text-sm text-text-muted">
        <div className="mb-2 flex items-center gap-2 font-semibold text-text"><KeyRound className="h-5 w-5 text-accent" />Права доступа</div>
        <ul className="list-inside list-disc space-y-1">
          <li><b>Администратор</b> — управляет пользователями и заявками.</li>
          <li><b>Менеджер</b> — работает с заявками, но не управляет пользователями.</li>
        </ul>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="text-lg font-semibold text-text">{editingUser ? "Редактировать пользователя" : "Новый пользователь"}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-2 hover:bg-surface-alt"><X className="h-5 w-5 text-text-muted" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              {error && <div className="flex gap-2 rounded-xl bg-danger/10 p-3 text-sm text-danger"><AlertCircle className="h-5 w-5 shrink-0" />{error}</div>}
              <div><label className="mb-1 block text-sm font-medium text-text">Имя *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" required /></div>
              <div><label className="mb-1 block text-sm font-medium text-text">Email *</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" required /></div>
              <div><label className="mb-1 block text-sm font-medium text-text">Роль</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "manager" })} className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"><option value="manager">Менеджер</option><option value="admin">Администратор</option></select></div>
              <div><label className="mb-1 block text-sm font-medium text-text">{editingUser ? "Новый пароль" : "Пароль *"}</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" minLength={6} required={!editingUser} /></div>
              <div className="flex gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="flex-1 rounded-xl border border-border px-4 py-3 font-medium hover:bg-surface-alt">Отмена</button><button type="submit" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-medium text-white hover:bg-accent-light"><Save className="h-4 w-4" />Сохранить</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
