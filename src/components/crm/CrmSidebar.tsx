"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  ClipboardList,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/crm", label: "Дашборд", icon: LayoutDashboard },
  { href: "/crm/clients", label: "Клиенты", icon: Users },
  { href: "/crm/orders", label: "Заказы", icon: ShoppingCart },
  { href: "/crm/tasks", label: "Задачи", icon: ClipboardList },
  { href: "/crm/requests", label: "Заявки", icon: Inbox },
];

export default function CrmSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-primary text-white transition-all duration-300 shrink-0 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="sticky top-0 h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!collapsed && <span className="font-semibold text-sm">CRM система</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          {!collapsed && (
            <div className="text-xs text-white/50">
              <p>ИРУ CRM v1.0</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
