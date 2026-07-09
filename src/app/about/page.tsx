import { Award, Users, Factory, Target, Heart, TrendingUp } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Надежность",
    description: "Выполняем заказы точно в срок, соблюдаем все договоренности",
  },
  {
    icon: Heart,
    title: "Клиентоориентированность",
    description: "Индивидуальный подход к каждому клиенту и проекту",
  },
  {
    icon: TrendingUp,
    title: "Развитие",
    description: "Постоянно совершенствуем технологии и расширяем возможности",
  },
];

const history = [
  { year: "2009", event: "Основание компании ИРУ" },
  { year: "2012", event: "Запуск собственного производства" },
  { year: "2015", event: "Расширение линейки продукции" },
  { year: "2018", event: "Внедрение CRM-системы управления заказами" },
  { year: "2021", event: "Модернизация оборудования" },
  { year: "2024", event: "Выход на федеральный уровень" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">О компании</h1>
            <p className="text-lg text-white/80 leading-relaxed">
              ИРУ — это команда профессионалов с многолетним опытом в производстве гофроупаковки. 
              Мы создаем надежную упаковку, которая защищает ваш продукт и подчеркивает имидж бренда.
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text mb-6">Кто мы</h2>
              <div className="space-y-4 text-text-muted leading-relaxed">
                <p>
                  Компания «Индивидуальные Решения Упаковки» (ИРУ) была основана в 2009 году 
                  и за это время зарекомендовала себя как надежный партнер в сфере производства 
                  гофроупаковки.
                </p>
                <p>
                  Мы специализируемся на изготовлении гофрокоробов, гофролистов и паллетных 
                  контейнеров любой сложности. Наше производство оснащено современным 
                  оборудованием, что позволяет нам выполнять заказы любого объема — от 
                  1 000 квадратных метров.
                </p>
                <p>
                  В штате компании работают более 50 квалифицированных специалистов: 
                  конструкторы, технологи, дизайнеры и менеджеры. Мы гордимся тем, что 
                  среди наших клиентов — крупные производственные и торговые компании 
                  из разных отраслей.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 p-6 rounded-2xl text-center">
                <Factory className="w-10 h-10 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-text">2 500+</div>
                <div className="text-sm text-text-muted">кв.м в сутки</div>
              </div>
              <div className="bg-accent/10 p-6 rounded-2xl text-center">
                <Users className="w-10 h-10 text-accent mx-auto mb-3" />
                <div className="text-2xl font-bold text-text">500+</div>
                <div className="text-sm text-text-muted">клиентов</div>
              </div>
              <div className="bg-success/10 p-6 rounded-2xl text-center">
                <Award className="w-10 h-10 text-success mx-auto mb-3" />
                <div className="text-2xl font-bold text-text">15+</div>
                <div className="text-sm text-text-muted">лет опыта</div>
              </div>
              <div className="bg-info/10 p-6 rounded-2xl text-center">
                <TrendingUp className="w-10 h-10 text-info mx-auto mb-3" />
                <div className="text-2xl font-bold text-text">99%</div>
                <div className="text-sm text-text-muted">выполнение в срок</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Наши ценности</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Принципы, которыми мы руководствуемся в работе
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-surface-alt border border-border">
                <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-text mb-2">{value.title}</h3>
                <p className="text-sm text-text-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">История компании</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Ключевые этапы развития ИРУ
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {history.map((item, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-accent rounded-full" />
                  {index < history.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <div className="text-accent font-bold text-lg">{item.year}</div>
                  <div className="text-text">{item.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
