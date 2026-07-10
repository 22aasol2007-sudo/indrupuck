"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  LogOut,
  Package,
  Settings,
  UserCog,
} from "lucide-react";

const navItems = [
  { href: "/admin/requests", label: "Заявки на расчёт", icon: ClipboardList },
  { href: "/admin/users", label: "Пользователи", icon: UserCog },
  { href: "/admin/setup", label: "Подключение", icon: Settings },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)] bg-surface-alt">
      <aside className="w-64 shrink-0 bg-primary text-white">
        <div className="sticky top-0 flex h-full flex-col">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-accent p-2">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold">Админ-панель</div>
                <div className="text-xs text-white/50">ИРУ</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    active ? "bg-accent text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Выйти
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
