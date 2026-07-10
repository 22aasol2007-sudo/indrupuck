import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ИРУ — Индивидуальные Решения Упаковки",
    short_name: "ИРУ",
    description: "Производство и продажа гофроупаковки под заказ от 1 000 кв.м.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    lang: "ru",
    categories: ["business", "productivity"],
  };
}
