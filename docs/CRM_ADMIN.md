# Админ-панель CRM

## Создание первого администратора без 405

Если администратора ещё нет, откройте страницу:

```text
https://indrupuck-522c.vercel.app/setup-admin
```

Заполните:

```text
Имя: Главный администратор
Email: 22aasol2007@gmail.com
Пароль CRM_SECRET: 220310MartSol
```

Нажмите «Создать администратора».

Эта страница работает через обычный интерфейс и не требует вручную открывать POST-only API, поэтому ошибки 405 не будет.

## Адрес входа

После деплоя на Vercel откройте:

```text
https://indrupuck-522c.vercel.app/crm/login
```

Также добавлен короткий адрес:

```text
https://indrupuck-522c.vercel.app/admin
```

Он перенаправит на страницу входа в CRM.

## Данные для входа

Email администратора:

```text
22aasol2007@gmail.com
```

Пароль берётся из переменной окружения Vercel:

```text
CRM_SECRET
```

У вас он должен быть задан в Vercel как:

```text
220310MartSol
```

## Что нужно проверить в Vercel

Откройте проект Vercel:

```text
Settings → Environment Variables
```

Должны быть переменные:

```env
CRM_SECRET=220310MartSol
DATABASE_URL=ваша_строка_PostgreSQL
NEXT_PUBLIC_SITE_URL=https://indrupuck-522c.vercel.app
```

Дополнительно можно добавить:

```env
CRM_EMAIL=22aasol2007@gmail.com
```

Если `CRM_EMAIL` не добавить, система всё равно будет использовать email `22aasol2007@gmail.com` по умолчанию.

## После изменения переменных

Обязательно сделайте новый деплой:

```text
Deployments → Redeploy
```

## Управление пользователями из интерфейса

После входа администратор может открыть основной адрес:

```text
https://indrupuck-522c.vercel.app/crm/admins
```

Также работают запасные адреса:

```text
https://indrupuck-522c.vercel.app/crm/users
https://indrupuck-522c.vercel.app/crm/admin
```

Там можно:

- создавать менеджеров;
- создавать администраторов;
- менять роль пользователя;
- менять пароль пользователя;
- удалять пользователей.

## Роли

### Администратор

Может:

- управлять пользователями CRM;
- видеть заявки;
- управлять клиентами;
- управлять заказами;
- управлять задачами.

### Менеджер

Может:

- видеть и обрабатывать заявки;
- работать с клиентами;
- работать с заказами;
- работать с задачами.

Не может:

- открывать раздел `/crm/admins`;
- создавать или удалять пользователей.

## Защищённые страницы

Теперь без входа нельзя открыть:

```text
/crm
/crm/setup
/crm/admins
/crm/inquiries
/crm/clients
/crm/orders
/crm/tasks
```

## Защищённые API

Теперь без входа закрыты CRM API:

```text
/api/admins
/api/clients
/api/orders
/api/tasks
/api/dashboard
/api/seed
/api/crm/status
```

Публичной остаётся отправка заявки клиентом:

```text
POST /api/inquiries
```

Поэтому форма на странице `/contacts` продолжит работать для клиентов без входа.
