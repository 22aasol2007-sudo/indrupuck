# ИРУ — Индивидуальные Решения Упаковки

Документация проекта отделена от рабочих файлов приложения и хранится в папке `docs/`.

## Что входит в проект

Проект — это корпоративный сайт и CRM-система для компании «Индивидуальные Решения Упаковки».

### Публичный сайт

- Главная страница.
- Страница «О компании».
- Страница «Услуги».
- Страница «Контакты» с формой заявки.

### CRM-система

CRM доступна по адресу:

```text
/crm
```

Разделы CRM:

- `/crm` — дашборд;
- `/crm/inquiries` — заявки клиентов;
- `/crm/clients` — клиенты;
- `/crm/orders` — заказы;
- `/crm/tasks` — задачи.

## Как работают заявки

Клиент отправляет заявку на странице:

```text
/contacts
```

Заявка отправляется в API:

```text
POST /api/inquiries
```

После этого заявка сохраняется в PostgreSQL в таблицу:

```text
inquiries
```

Менеджер видит заявки в CRM:

```text
/crm/inquiries
```

В разделе заявок можно:

- смотреть имя, телефон, email и компанию клиента;
- видеть тип упаковки, объём и бюджет;
- читать сообщение клиента;
- менять статус заявки;
- оставлять комментарий менеджера;
- удалять неактуальные заявки.

## Основные технологии

- Next.js 16 App Router;
- React 19;
- Tailwind CSS 4;
- PostgreSQL;
- Drizzle ORM;
- Recharts;
- Lucide React.

## Основная структура проекта

```text
src/
  app/
    api/              API-роуты
    crm/              CRM-страницы
    about/            страница о компании
    contacts/         контакты и форма заявки
    services/         услуги
    page.tsx          главная страница
    layout.tsx        общий layout
  components/         общие компоненты
  db/                 подключение и схема базы данных

docs/                 документация и инструкции
public/               публичные статические файлы
```

## Таблицы базы данных

- `inquiries` — заявки;
- `clients` — клиенты;
- `orders` — заказы;
- `tasks` — задачи;
- `users` — пользователи;
- `activities` — активности.

## API

### Заявки

```text
GET    /api/inquiries
POST   /api/inquiries
GET    /api/inquiries/[id]
PUT    /api/inquiries/[id]
DELETE /api/inquiries/[id]
```

### Клиенты

```text
GET    /api/clients
POST   /api/clients
GET    /api/clients/[id]
PUT    /api/clients/[id]
DELETE /api/clients/[id]
```

### Заказы

```text
GET    /api/orders
POST   /api/orders
GET    /api/orders/[id]
PUT    /api/orders/[id]
DELETE /api/orders/[id]
```

### Задачи

```text
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/[id]
PUT    /api/tasks/[id]
DELETE /api/tasks/[id]
```

### Служебные endpoints

```text
GET  /api/dashboard
POST /api/seed
GET  /api/health
```

## Полезные команды

```bash
npm install
npx drizzle-kit push
npm run dev
npm run build
npm start
```

## Где лежат инструкции

- `docs/FIRST_RUN.md` — самый простой первый запуск.
- `docs/DEPLOYMENT.md` — хостинг, домен, SSL, VPS, Docker, PM2.
- `docs/PROJECT.md` — описание проекта.
