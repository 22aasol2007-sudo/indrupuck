import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://iru-pack.ru";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ИРУ — Индивидуальные Решения Упаковки",
    template: "%s | ИРУ",
  },
  description:
    "Производство и продажа гофроупаковки любой сложности. Работаем под заказ от 1 000 кв.м. Гофрокороба, гофролисты, паллетные контейнеры.",
  keywords: [
    "гофроупаковка",
    "гофрокороба",
    "упаковка под заказ",
    "производство упаковки",
    "гофролисты",
    "паллетные контейнеры",
    "Индивидуальные Решения Упаковки",
  ],
  authors: [{ name: "ИРУ — Индивидуальные Решения Упаковки" }],
  creator: "ИРУ",
  publisher: "ИРУ",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "ИРУ — Индивидуальные Решения Упаковки",
    title: "ИРУ — Индивидуальные Решения Упаковки",
    description:
      "Гофроупаковка любой сложности под заказ от 1 000 кв.м. Производство, расчёт, CRM для заявок и заказов.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ИРУ — Индивидуальные Решения Упаковки",
    description:
      "Производство гофроупаковки под заказ от 1 000 кв.м.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
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
