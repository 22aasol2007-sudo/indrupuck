# Первый запуск сайта самым лёгким способом

Самый простой путь для первого запуска сайта и CRM:

```text
Railway + PostgreSQL внутри Railway
```

Railway удобен тем, что в одном месте можно держать:

- сайт;
- CRM;
- PostgreSQL-базу;
- переменные окружения;
- домен;
- SSL.

## 1. Что нужно заранее

Нужно иметь аккаунты:

- GitHub — для хранения проекта;
- Railway — для запуска сайта и базы данных.

Сайты:

```text
https://github.com
https://railway.app
```

## 2. Загрузить проект на GitHub

В папке проекта выполните:

```bash
git init
git add .
git commit -m "Initial production version"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/iru-pack-site.git
git push -u origin main
```

Перед загрузкой убедитесь, что настоящие пароли не попали в репозиторий.

## 3. Создать проект в Railway

1. Зайдите на `https://railway.app`.
2. Нажмите `New Project`.
3. Выберите `Deploy from GitHub repo`.
4. Подключите GitHub.
5. Выберите репозиторий проекта.

Railway сам начнёт готовить приложение.

## 4. Добавить PostgreSQL

Внутри проекта Railway:

1. Нажмите `New`.
2. Выберите `Database`.
3. Выберите `PostgreSQL`.

Railway создаст базу данных и переменную подключения.

## 5. Добавить переменные окружения

В сервисе сайта в Railway откройте раздел переменных и добавьте:

```env
DATABASE_URL=строка_подключения_PostgreSQL_из_Railway
NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru
NODE_ENV=production
HOSTNAME=0.0.0.0
PORT=3000
```

Если домена пока нет, временно укажите Railway-домен:

```env
NEXT_PUBLIC_SITE_URL=https://ваш-проект.up.railway.app
```

## 6. Создать таблицы базы данных

На компьютере в папке проекта укажите в `.env` тот же `DATABASE_URL`, который дал Railway.

Затем выполните:

```bash
npm install
npx drizzle-kit push
```

Эта команда создаст таблицы:

- `inquiries`;
- `clients`;
- `orders`;
- `tasks`;
- `users`;
- `activities`.

## 7. Запустить deploy

В Railway нажмите `Deploy` или дождитесь автоматического запуска.

После успешного deploy Railway даст ссылку вида:

```text
https://ваш-проект.up.railway.app
```

## 8. Проверить сайт

Откройте:

```text
/
/about
/services
/contacts
/crm
/crm/inquiries
/api/health
```

Healthcheck должен вернуть:

```json
{"ok":true}
```

## 9. Проверить заявки

1. Откройте `/contacts`.
2. Заполните форму заявки.
3. Отправьте заявку.
4. Откройте `/crm/inquiries`.
5. Убедитесь, что заявка появилась.

## 10. Подключить домен

В Railway откройте настройки сервиса и найдите `Domains`.

Добавьте ваш домен, например:

```text
iru-pack.ru
```

Railway покажет DNS-записи. Их нужно добавить у регистратора домена.

Обычно это CNAME или A-запись, которую Railway покажет в интерфейсе.

После обновления DNS подождите от 5 минут до 24 часов.

## 11. Где будут заявки

Клиенты отправляют заявки здесь:

```text
https://ваш-домен.ru/contacts
```

Вы смотрите заявки здесь:

```text
https://ваш-домен.ru/crm/inquiries
```

## Важно про CRM

CRM сейчас технически готова, но перед реальной работой рекомендуется добавить авторизацию, чтобы посторонние не могли открыть `/crm`.
