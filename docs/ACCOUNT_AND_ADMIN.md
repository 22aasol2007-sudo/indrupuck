# Личный кабинет клиента и админ-панель

CRM заменена на более простую схему:

- клиентский личный кабинет — для отправки заявок на расчёт;
- админ-панель — для просмотра и обработки этих заявок.

## Адреса

### Личный кабинет клиента

```text
https://indrupuck-522c.vercel.app/account
```

Клиент заполняет форму заявки на расчёт упаковки.

### Админ-панель

```text
https://indrupuck-522c.vercel.app/admin
```

После входа администратор попадает в заявки.

### Вход в админ-панель

```text
https://indrupuck-522c.vercel.app/admin/login
```

### Заявки на расчёт

```text
https://indrupuck-522c.vercel.app/admin/requests
```

### Пользователи админ-панели

```text
https://indrupuck-522c.vercel.app/admin/users
```

### Проверка подключения

```text
https://indrupuck-522c.vercel.app/admin/setup
```

## Как работает заявка

1. Клиент открывает `/account`.
2. Заполняет форму заявки на расчёт.
3. Форма отправляет данные в `POST /api/inquiries`.
4. Заявка сохраняется в PostgreSQL в таблицу `inquiries`.
5. Администратор видит заявку в `/admin/requests`.
6. Администратор меняет статус и оставляет внутренний комментарий.

## Статусы заявки

- Новая;
- Связались;
- КП отправлено;
- Переведена в заказ;
- Отклонена.

## Как войти в админ-панель первый раз

1. Убедитесь, что в Vercel добавлены переменные:

```env
CRM_SECRET=220310MartSol
DATABASE_URL=ваша_строка_PostgreSQL
NEXT_PUBLIC_SITE_URL=https://indrupuck-522c.vercel.app
```

2. Сделайте Redeploy в Vercel.

3. Если таблицы ещё не созданы, выполните локально:

```bash
DATABASE_URL="ваша_строка_PostgreSQL" npm run db:push
```

Для Windows PowerShell:

```powershell
$env:DATABASE_URL="ваша_строка_PostgreSQL"
npm run db:push
```

4. Создайте первого администратора:

```text
https://indrupuck-522c.vercel.app/setup-admin
```

Данные:

```text
Email: 22aasol2007@gmail.com
Пароль CRM_SECRET: 220310MartSol
```

5. Войдите:

```text
https://indrupuck-522c.vercel.app/admin/login
```

## Что закрыто от клиентов

Клиенты не видят админ-панель. Без входа нельзя открыть:

```text
/admin
/admin/requests
/admin/users
/admin/setup
```

## Что открыто клиентам

Клиенты могут открыть:

```text
/
/about
/services
/contacts
/account
```

И могут отправлять заявки через форму.
