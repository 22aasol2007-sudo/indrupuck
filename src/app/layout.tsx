import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "ИРУ — Индивидуальные Решения Упаковки",
    template: "%s | ИРУ",
  },
  description:
    "Производство и продажа гофроупаковки любой сложности. Работаем под заказ от 1 000 кв.м. Гофрокороба, гофролисты, паллетные контейнеры, паллетные борта.",
  keywords: [
    "гофроупаковка",
    "гофрокороба",
    "гофролисты",
    "паллетные контейнеры",
    "упаковка под заказ",
    "ИРУ",
    "Индивидуальные Решения Упаковки",
  ],
  authors: [{ name: "ИРУ — Индивидуальные Решения Упаковки" }],
  creator: "ИРУ",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "ИРУ",
    title: "ИРУ — Индивидуальные Решения Упаковки",
    description:
      "Производство и продажа гофроупаковки любой сложности. Работаем под заказ от 1 000 кв.м.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ИРУ — Индивидуальные Решения Упаковки",
    description:
      "Производство и продажа гофроупаковки любой сложности. Работаем под заказ от 1 000 кв.м.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  category: "business",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-surface-alt text-text antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
