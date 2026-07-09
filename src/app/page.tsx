"use client";

import Link from "next/link";
import {
  Package,
  Factory,
  Truck,
  Palette,
  Shield,
  Clock,
  Award,
  Users,
  ArrowRight,
  CheckCircle,
  Box,
  Layers,
  Container,
  Phone,
} from "lucide-react";

const features = [
  {
    icon: Factory,
    title: "Собственное производство",
    description: "Полный цикл производства гофроупаковки на современном оборудовании",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Контроль качества на всех этапах производства",
  },
  {
    icon: Clock,
    title: "Быстрые сроки",
    description: "Изготовление заказа от 3 до 14 рабочих дней",
  },
  {
    icon: Palette,
    title: "Индивидуальный дизайн",
    description: "Разработка уникального дизайна упаковки под ваш бренд",
  },
];

const services = [
  {
    icon: Box,
    title: "Гофрокороба",
    description: "Четырехклапанные, самосборные, телескопические короба любых размеров",
    price: "от 320 ₽/кв.м",
  },
  {
    icon: Layers,
    title: "Гофролисты",
    description: "Плоские листы гофрокартона для упаковки и прокладки",
    price: "от 280 ₽/кв.м",
  },
  {
    icon: Container,
    title: "Паллетные контейнеры",
    description: "Прочные контейнеры для хранения и транспортировки на паллетах",
    price: "от 520 ₽/кв.м",
  },
  {
    icon: Package,
    title: "Упаковка под заказ",
    description: "Нестандартные конструкции по вашим чертежам и спецификациям",
    price: "от 450 ₽/кв.м",
  },
];

const stats = [
  { value: "15+", label: "Лет на рынке" },
  { value: "500+", label: "Клиентов" },
  { value: "1000+", label: "Выполненных заказов" },
  { value: "50+", label: "Сотрудников" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-light px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Работаем под заказ от 1 000 кв.м
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Гофроупаковка любой сложности
            </h1>
            <p className="text-lg lg:text-xl text-white/80 leading-relaxed mb-8">
              Производим и поставляем гофрокороба, гофролисты и паллетные контейнеры. 
              Индивидуальный подход к каждому клиенту, современное оборудование, 
              гарантия качества.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl font-semibold transition-colors"
              >
                Наши услуги
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contacts"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
              >
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 lg:py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4">Почему выбирают нас</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Мы предлагаем комплексный подход к производству упаковки — от проектирования до доставки
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-text mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4">Наши услуги</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Полный спектр услуг по производству гофроупаковки
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-surface-alt p-6 lg:p-8 rounded-2xl border border-border hover:border-accent/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-text">{service.title}</h3>
                      <span className="text-accent font-semibold text-sm">{service.price}</span>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed mb-4">{service.description}</p>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:text-accent font-medium transition-colors"
                    >
                      Подробнее
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Все услуги
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4">Как мы работаем</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Простой и прозрачный процесс от заявки до готовой продукции
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Заявка", desc: "Оставьте заявку или позвоните нам" },
              { step: "02", title: "Расчет", desc: "Подготовим коммерческое предложение" },
              { step: "03", title: "Производство", desc: "Изготовим упаковку по спецификации" },
              { step: "04", title: "Доставка", desc: "Доставим продукцию в удобное время" },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="text-5xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="font-semibold text-lg text-text mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Готовы обсудить ваш проект?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Свяжитесь с нами для получения бесплатной консультации и расчета стоимости
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Оставить заявку
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+74951234567"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              Позвонить
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
