"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";

type SubmitStatus = "idle" | "loading" | "success" | "error";

const initialForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  packageType: "",
  squareMeters: "",
  budget: "",
  message: "",
};

export default function ContactsPage() {
  const [formData, setFormData] = useState(initialForm);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Не удалось отправить заявку");
      }

      setSubmitStatus("success");
      setFormData(initialForm);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Заявка не отправлена. Попробуйте ещё раз или позвоните нам.");
    }
  };

  return (
    <div>
      <section className="bg-primary py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-light px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Заявки сразу попадают в CRM
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Контакты и заявка на расчёт</h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Заполните форму — менеджер увидит заявку в CRM, свяжется с вами, уточнит детали и подготовит коммерческое предложение.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold text-text mb-8">Как с нами связаться</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-text mb-1">Телефон</div>
                    <a href="tel:+74951234567" className="text-text-muted hover:text-accent transition-colors">
                      +7 (495) 123-45-67
                    </a>
                    <div className="text-sm text-text-muted mt-1">
                      <a href="tel:+74959876543" className="hover:text-accent transition-colors">
                        +7 (495) 987-65-43
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-text mb-1">Email</div>
                    <a href="mailto:info@iru-pack.ru" className="text-text-muted hover:text-accent transition-colors">
                      info@iru-pack.ru
                    </a>
                    <div className="text-sm text-text-muted mt-1">
                      <a href="mailto:sales@iru-pack.ru" className="hover:text-accent transition-colors">
                        sales@iru-pack.ru
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-text mb-1">Адрес</div>
                    <p className="text-text-muted">г. Москва, ул. Промышленная, 25, стр. 3</p>
                    <p className="text-sm text-text-muted mt-1">Производственный комплекс «Упаковка-Плюс»</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-text mb-1">Режим работы</div>
                    <p className="text-text-muted">Пн–Пт: 9:00 – 18:00</p>
                    <p className="text-sm text-text-muted mt-1">Сб–Вс: выходной</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 bg-primary text-white p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-3">Что происходит после отправки?</h3>
                <ol className="space-y-2 text-sm text-white/80 list-decimal list-inside">
                  <li>Заявка сохраняется в базе данных.</li>
                  <li>Она появляется в CRM в разделе «Заявки» со статусом «Новая».</li>
                  <li>Менеджер меняет статус: «Связались», «КП отправлено» или «Переведена в клиента».</li>
                </ol>
              </div>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-text mb-2">Отправить заявку</h2>
              <p className="text-sm text-text-muted mb-6">
                Минимальный заказ — от 1 000 кв.м. Чем подробнее вы заполните форму, тем точнее будет расчёт.
              </p>

              {submitStatus === "success" && (
                <div className="mb-5 flex items-start gap-3 rounded-xl bg-success/10 text-success p-4">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Заявка отправлена!</div>
                    <p className="text-sm">Она уже появилась в CRM. Менеджер свяжется с вами в рабочее время.</p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-5 flex items-start gap-3 rounded-xl bg-danger/10 text-danger p-4">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Имя *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                      placeholder="Ваше имя"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Телефон *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                      placeholder="+7 (___) ___-__-__"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Компания</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                      placeholder="ООО Компания"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Тип упаковки</label>
                  <select
                    value={formData.packageType}
                    onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white"
                  >
                    <option value="">Выберите тип</option>
                    <option value="Гофрокороба">Гофрокороба</option>
                    <option value="Гофролисты">Гофролисты</option>
                    <option value="Паллетные контейнеры">Паллетные контейнеры</option>
                    <option value="Упаковка под заказ">Упаковка под заказ</option>
                    <option value="Печать на упаковке">Печать на упаковке</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Объем (кв.м)</label>
                    <input
                      type="number"
                      min="1000"
                      value={formData.squareMeters}
                      onChange={(e) => setFormData({ ...formData, squareMeters: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                      placeholder="от 1 000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Ориентировочный бюджет</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                      placeholder="₽"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Сообщение</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                    placeholder="Опишите размеры, требования к прочности, печать, сроки..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-light disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-semibold transition-colors"
                >
                  <Send className="w-5 h-5" />
                  {submitStatus === "loading" ? "Отправляем..." : "Отправить заявку"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
