"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Package, Phone } from "lucide-react";

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/about", label: "О компании" },
    { href: "/services", label: "Услуги" },
    { href: "/contacts", label: "Контакты" },
    { href: "/cabinet", label: "Личный кабинет" },
  ];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-accent p-2 rounded-lg group-hover:bg-accent-light transition-colors">
              <Package className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm lg:text-lg leading-tight">ИРУ</span>
              <span className="text-[10px] lg:text-xs text-white/70 leading-tight hidden sm:block">
                Индивидуальные Решения Упаковки
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+74951234567"
              className="flex items-center gap-2 bg-accent hover:bg-accent-light px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              +7 (495) 123-45-67
            </a>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-primary-dark border-t border-white/10">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+74951234567"
              className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-light px-4 py-3 rounded-lg text-sm font-medium transition-colors mt-2"
            >
              <Phone className="w-4 h-4" />
              +7 (495) 123-45-67
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
