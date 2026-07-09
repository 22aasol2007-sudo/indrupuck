import Link from "next/link";
import { Package, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-accent p-2 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg">ИРУ</span>
                <p className="text-xs text-white/60">Индивидуальные Решения Упаковки</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Производство и продажа гофроупаковки любой сложности. 
              Работаем под заказ от 1 000 кв.м.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Навигация</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-white/70 hover:text-accent transition-colors">Главная</Link>
              <Link href="/about" className="text-sm text-white/70 hover:text-accent transition-colors">О компании</Link>
              <Link href="/services" className="text-sm text-white/70 hover:text-accent transition-colors">Услуги</Link>
              <Link href="/contacts" className="text-sm text-white/70 hover:text-accent transition-colors">Контакты</Link>
              <Link href="/crm" className="text-sm text-white/70 hover:text-accent transition-colors">CRM система</Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Услуги</h3>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-white/70">Гофрокороба</span>
              <span className="text-sm text-white/70">Гофролисты</span>
              <span className="text-sm text-white/70">Паллетные контейнеры</span>
              <span className="text-sm text-white/70">Упаковка под заказ</span>
              <span className="text-sm text-white/70">Печать на упаковке</span>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Контакты</h3>
            <div className="flex flex-col gap-3">
              <a href="tel:+74951234567" className="flex items-center gap-2 text-sm text-white/70 hover:text-accent transition-colors">
                <Phone className="w-4 h-4" />
                +7 (495) 123-45-67
              </a>
              <a href="mailto:info@iru-pack.ru" className="flex items-center gap-2 text-sm text-white/70 hover:text-accent transition-colors">
                <Mail className="w-4 h-4" />
                info@iru-pack.ru
              </a>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>г. Москва, ул. Промышленная, 25, стр. 3</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} ИРУ — Индивидуальные Решения Упаковки. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
