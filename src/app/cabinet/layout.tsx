"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, LogOut, Plus } from "lucide-react";

export default function CabinetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [session, setSession] = useState<{ email?: string; name?: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/client/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) {
          router.replace("/cabinet/login");
        } else {
          setSession(data);
          setLoading(false);
        }
      })
      .catch(() => router.replace("/cabinet/login"));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/client/logout", { method: "POST" });
    router.push("/cabinet/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt">
      <header className="bg-primary text-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/cabinet" className="flex items-center gap-2">
            <div className="bg-accent p-2 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold">ИРУ — Личный кабинет</span>
          </Link>
          <div className="flex items-center gap-4">
            {session?.email && (
              <span className="text-sm text-white/70 hidden sm:block">
                {session.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Выход
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
