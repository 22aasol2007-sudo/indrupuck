"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Inbox } from "lucide-react";

const packagingOptions = [
  { value: "boxes", label: "Гофрокороба" },
  { value: "sheets", label: "Гофролисты" },
  { value: "pallets", label: "Паллетные контейнеры" },
  { value: "custom", label: "Упаковка под заказ" },
  { value: "print", label: "Печать на упаковке" },
];

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    packagingType: "",
    volume: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: "",
          phone: "",
          email: "",
          company: "",
          packagingType: "",
          volume: "",
          message: "",
        });
      } else {
        setError("Произошла ошибка. Попробуйте позже или позвоните нам.");
      }
    } catch {
      setError("Произошла ошибка. Попробуйте позже или позвоните нам.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Контакты</h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Оставьте заявку — наш менеджер свяжется с вами в течение рабочего дня. 
              Заявки принимаются от 1 000 кв.м.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
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
                    <p className="text-text-muted">
                      г. Москва, ул. Промышленная, 25, стр. 3
                    </p>
                    <p className="text-sm text-text-muted mt-1">
                      Производственный комплекс «Упаковка-Плюс»
                    </p>
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

              {/* Where requests go */}
              <div className="mt-8 bg-surface-alt border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 text-accent mb-2">
                  <Inbox className="w-5 h-5" />
                  <span className="font-semibold text-text">Куда попадают заявки?</span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  После отправки формы заявка сохраняется в нашей CRM-системе. 
                  Менеджер видит её в разделе <span className="font-medium text-text">«Заявки»</span> 
                  и обрабатывает в течение рабочего дня. Статус заявки можно 
                  отслеживать в панели управления.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 lg:p-8 rounded-2xl border border-border">
              {success ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h2 className="text-xl font-bold text-text mb-2">Заявка отправлена!</h2>
                  <p className="text-text-muted mb-6 max-w-sm">
                    Спасибо! Ваша заявка принята и передана менеджеру. 
                    Мы свяжемся с вами в ближайшее время.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Отправить ещё одну
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-text mb-6">Отправить заявку</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">Имя *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          placeholder="Ваше имя"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">Телефон *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          placeholder="+7 (___) ___-__-__"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">Компания</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          placeholder="ООО / ИП"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">Тип упаковки</label>
                        <select
                          value={formData.packagingType}
                          onChange={(e) => setFormData({ ...formData, packagingType: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-white"
                        >
                          <option value="">Выберите тип</option>
                          {packagingOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">Объем (кв.м)</label>
                        <input
                          type="number"
                          min="1000"
                          value={formData.volume}
                          onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                          placeholder="от 1 000"
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
                        placeholder="Опишите ваши требования..."
                      />
                    </div>
                    {error && (
                      <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl text-sm">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-6 py-4 rounded-xl font-semibold transition-colors disabled:opacity-60"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Отправить заявку
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
