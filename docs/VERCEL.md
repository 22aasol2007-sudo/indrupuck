# Запуск на Vercel

## Ошибка `DATABASE_URL is required`

Если Vercel показывает ошибку:

```text
DATABASE_URL is required
```

или:

```text
DATABASE_URL is not configured
```

значит в Vercel не добавлена переменная окружения для PostgreSQL.

## Что нужно сделать

1. Откройте проект в Vercel.
2. Перейдите в:

```text
Settings → Environment Variables
```

3. Добавьте переменную:

```text
DATABASE_URL
```

4. В значение вставьте строку подключения к PostgreSQL.

Например для Neon:

```text
postgresql://user:password@ep-example.neon.tech/dbname?sslmode=require
```

5. Добавьте также:

```text
NEXT_PUBLIC_SITE_URL
```

Если домена пока нет:

```text
https://ваш-проект.vercel.app
```

Если домен уже подключён:

```text
https://ваш-домен.ru
```

6. Нажмите:

```text
Save
```

7. Сделайте новый деплой:

```text
Deployments → Redeploy
```

## Важно

Сайт теперь может собраться даже без `DATABASE_URL`, но CRM, заявки и API базы данных будут работать только после добавления настоящей переменной `DATABASE_URL`.

## Важное исправление build-ошибки Drizzle

Vercel build теперь выполняет только:

```bash
npm run vercel-build
```

А этот скрипт делает только:

```bash
next build
```

Команда `drizzle-kit push` больше не запускается во время сборки Vercel. Это важно, потому что деплой должен собирать сайт, а создание таблиц базы данных нужно делать отдельно.

## Как создать таблицы базы данных

После того как вы создали PostgreSQL и получили `DATABASE_URL`, выполните локально на компьютере:

```bash
npm install
DATABASE_URL="ваша_строка_PostgreSQL" npm run db:push
```

На Windows PowerShell:

```powershell
$env:DATABASE_URL="ваша_строка_PostgreSQL"
npm run db:push
```

После этого в базе появятся таблицы CRM и заявок.

## Проверка

После деплоя откройте страницу подключения CRM:

```text
https://ваш-проект.vercel.app/crm/setup
```

Она покажет, добавлена ли `DATABASE_URL`, созданы ли таблицы и готова ли CRM.

Также можно открыть healthcheck:

```text
https://ваш-проект.vercel.app/api/health
```

Если база подключена правильно, ответ будет:

```json
{"ok":true}
```

Если переменная не добавлена, ответ будет:

```json
{"ok":false,"error":"DATABASE_URL is not configured"}
```
