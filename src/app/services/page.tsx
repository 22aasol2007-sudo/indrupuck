import { Box, Layers, Container, Package, Printer, Ruler, Shield, Clock } from "lucide-react";

const services = [
  {
    icon: Box,
    title: "Гофрокороба",
    description: "Изготовление четырехклапанных, самосборных, телескопических и других типов гофрокоробов любых размеров.",
    features: ["Трех- и пятислойный картон", "Любые размеры", "От 1 000 кв.м"],
    price: "от 320 ₽/кв.м",
  },
  {
    icon: Layers,
    title: "Гофролисты",
    description: "Производство плоских листов гофрокартона для упаковки, прокладки и защиты продукции.",
    features: ["Различная толщина", "Прокладочный материал", "Большие форматы"],
    price: "от 280 ₽/кв.м",
  },
  {
    icon: Container,
    title: "Паллетные контейнеры",
    description: "Прочные гофроконтейнеры для хранения и транспортировки грузов на стандартных паллетах.",
    features: ["Высокая грузоподъемность", "Стандартные размеры", "Многоразовое использование"],
    price: "от 520 ₽/кв.м",
  },
  {
    icon: Package,
    title: "Упаковка под заказ",
    description: "Разработка и производство нестандартной упаковки по индивидуальным чертежам и спецификациям.",
    features: ["Уникальные конструкции", "Прототипирование", "Полный цикл"],
    price: "от 450 ₽/кв.м",
  },
  {
    icon: Printer,
    title: "Печать на упаковке",
    description: "Нанесение логотипов, текстовой информации и изображений на гофроупаковку методом флексопечати.",
    features: ["До 4 цветов", "Высокое качество", "Быстрое изготовление"],
    price: "от 50 ₽/кв.м",
  },
  {
    icon: Ruler,
    title: "Конструирование",
    description: "Разработка оптимальных конструкций упаковки с учетом особенностей вашего продукта.",
    features: ["3D-моделирование", "Прочностные расчеты", "Оптимизация материалов"],
    price: "Бесплатно",
  },
];

const advantages = [
  { icon: Shield, title: "Гарантия качества", desc: "Соответствие ГОСТ и ТУ" },
  { icon: Clock, title: "Быстрые сроки", desc: "От 3 до 14 рабочих дней" },
  { icon: Ruler, title: "Точность", desc: "Размеры с точностью до 1 мм" },
  { icon: Box, title: "Объемы", desc: "От 1 000 кв.м и выше" },
];

export default function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Наши услуги</h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Полный спектр услуг по производству гофроупаковки — от проектирования 
              до доставки готовой продукции
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 lg:p-8 rounded-2xl border border-border hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg text-text">{service.title}</h3>
                  <span className="text-accent font-semibold text-sm">{service.price}</span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-sm text-text">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Преимущества работы с нами</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Почему сотни компаний выбирают ИРУ
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-surface-alt">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <adv.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-text mb-1">{adv.title}</h3>
                <p className="text-sm text-text-muted">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
