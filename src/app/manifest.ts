import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ИРУ — Индивидуальные Решения Упаковки",
    short_name: "ИРУ",
    description:
      "Производство и продажа гофроупаковки любой сложности. Работаем под заказ от 1 000 кв.м.",
    start_url: "/",
    display: "standalone",
    background_color: "#161616",
    theme_color: "#ff6b00",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
