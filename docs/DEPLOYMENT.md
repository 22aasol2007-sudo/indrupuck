# Production-развёртывание сайта ИРУ и подключение домена

Эта инструкция отделена от файлов приложения и находится в папке `docs/`.

## 1. Что подготовлено для production

В проекте уже есть:

- standalone-сборка Next.js;
- security headers;
- `robots.txt`;
- `sitemap.xml`;
- `manifest.webmanifest`;
- `.env.example`;
- `Dockerfile`;
- `docker-compose.prod.yml`;
- пример Nginx-конфига `deploy/nginx/iru-pack.conf`;
- PM2-конфиг `ecosystem.config.cjs`;
- healthcheck `/api/health`.

## 2. DNS для домена

Если домен `iru-pack.ru`, а IP сервера `123.123.123.123`, у регистратора домена нужно добавить:

| Тип | Имя | Значение |
|-----|-----|----------|
| A | `@` | `123.123.123.123` |
| A | `www` | `123.123.123.123` |

Проверка:

```bash
nslookup iru-pack.ru
nslookup www.iru-pack.ru
```

## 3. Переменные окружения

Создайте `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Минимальный набор:

```env
DATABASE_URL=postgresql://iru_user:strong_password@127.0.0.1:5432/iru_pack
NEXT_PUBLIC_SITE_URL=https://iru-pack.ru
NODE_ENV=production
HOSTNAME=0.0.0.0
PORT=3000
```

## 4. Docker Compose

### Установка Docker

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
```

### Запуск

```bash
cd /var/www/iru-pack
docker compose -f docker-compose.prod.yml up -d --build
```

### Создание таблиц БД

```bash
DATABASE_URL=postgresql://iru_user:change_this_strong_password@127.0.0.1:5432/iru_pack npx drizzle-kit push
```

### Проверка

```bash
curl http://127.0.0.1:3000/api/health
```

Ожидаемый ответ:

```json
{"ok":true}
```

## 5. PM2 без Docker

### Установка Node.js и PM2

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### Установка PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql
```

В psql:

```sql
CREATE USER iru_user WITH PASSWORD 'strong_password';
CREATE DATABASE iru_pack OWNER iru_user;
GRANT ALL PRIVILEGES ON DATABASE iru_pack TO iru_user;
\q
```

### Запуск проекта

```bash
cd /var/www/iru-pack
cp .env.example .env
nano .env
npm ci
npx drizzle-kit push
npm run build
mkdir -p logs
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## 6. Nginx и SSL

### Установка

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### Подключение конфига

```bash
sudo cp deploy/nginx/iru-pack.conf /etc/nginx/sites-available/iru-pack.conf
sudo ln -s /etc/nginx/sites-available/iru-pack.conf /etc/nginx/sites-enabled/iru-pack.conf
sudo nginx -t
sudo systemctl reload nginx
```

### SSL

```bash
sudo certbot --nginx -d iru-pack.ru -d www.iru-pack.ru
sudo certbot renew --dry-run
```

## 7. Проверка после запуска

Откройте:

```text
https://iru-pack.ru
https://iru-pack.ru/services
https://iru-pack.ru/contacts
https://iru-pack.ru/crm
https://iru-pack.ru/crm/inquiries
https://iru-pack.ru/api/health
https://iru-pack.ru/sitemap.xml
https://iru-pack.ru/robots.txt
```

## 8. Где хранятся данные

Все CRM-данные хранятся в PostgreSQL:

- `inquiries` — заявки;
- `clients` — клиенты;
- `orders` — заказы;
- `tasks` — задачи;
- `users` — пользователи;
- `activities` — активности.

## 9. Backup базы данных

Ручной backup:

```bash
pg_dump postgresql://iru_user:strong_password@127.0.0.1:5432/iru_pack > backup_$(date +%F).sql
```

Восстановление:

```bash
psql postgresql://iru_user:strong_password@127.0.0.1:5432/iru_pack < backup_2026-01-01.sql
```

## 10. Обновление сайта

### Docker

```bash
cd /var/www/iru-pack
git pull
docker compose -f docker-compose.prod.yml up -d --build
npx drizzle-kit push
```

### PM2

```bash
cd /var/www/iru-pack
git pull
npm ci
npx drizzle-kit push
npm run build
pm2 restart iru-pack
```

## 11. Финальный чеклист

- [ ] Домен куплен.
- [ ] DNS указывает на сервер.
- [ ] PostgreSQL создан и доступен.
- [ ] `.env` заполнен.
- [ ] `NEXT_PUBLIC_SITE_URL` содержит production-домен.
- [ ] Выполнен `npx drizzle-kit push`.
- [ ] Сайт собран.
- [ ] Nginx проксирует на порт 3000.
- [ ] SSL выпущен.
- [ ] `/api/health` возвращает `{ "ok": true }`.
- [ ] Заявки сохраняются в `/crm/inquiries`.
- [ ] Настроены backup базы данных.
