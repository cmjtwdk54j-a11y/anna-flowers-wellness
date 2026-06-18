# Anna Flowers & Wellness — Инструкция по запуску

## Требования
- Node.js 18+
- PostgreSQL 14+
- Аккаунт Stripe (для оплаты)

---

## 1. Настройка базы данных

Создайте базу данных PostgreSQL:
```sql
CREATE DATABASE anna_flowers;
```

## 2. Настройка переменных окружения

Отредактируйте файл `.env`:
```env
DATABASE_URL="postgresql://ВАШ_ПОЛЬЗОВАТЕЛЬ:ВАШ_ПАРОЛЬ@localhost:5432/anna_flowers"

STRIPE_SECRET_KEY="sk_test_xxxxxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxx"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="ВАШ_GOOGLE_MAPS_КЛЮЧ"
```

## 3. Установка зависимостей
```bash
npm install
```

## 4. Применение миграций базы данных
```bash
npx prisma db push
```

## 5. Заполнение тестовыми данными
```bash
npm run db:seed
```

## 6. Запуск dev-сервера
```bash
npm run dev
```

Сайт будет доступен по адресу: http://localhost:3000

---

## Структура проекта

```
anna-flowers/
├── app/
│   ├── page.tsx              # Главная страница
│   ├── flowers/              # Каталог цветов
│   │   ├── page.tsx
│   │   └── [slug]/           # Страница товара
│   ├── massage/              # Массаж
│   ├── gift-cards/           # Подарочные карты
│   ├── delivery/             # Доставка
│   ├── contact/              # Контакты
│   ├── checkout/             # Оформление заказа
│   └── api/                  # API роуты
│       ├── products/
│       ├── orders/
│       ├── bookings/
│       ├── gift-cards/
│       ├── checkout/stripe/
│       └── webhooks/stripe/
├── components/
│   ├── layout/               # Header, Footer
│   └── cart/                 # CartDrawer
├── context/
│   └── CartContext.tsx       # Состояние корзины
├── lib/
│   ├── prisma.ts             # Prisma клиент
│   ├── stripe.ts             # Stripe интеграция
│   └── utils.ts              # Утилиты
├── messages/
│   ├── fi.json               # Финский язык
│   └── en.json               # Английский язык
└── prisma/
    ├── schema.prisma         # Схема БД
    └── seed.ts               # Тестовые данные
```

---

## API эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| GET | /api/products | Список товаров |
| POST | /api/orders | Создать заказ |
| GET | /api/orders?email=x | Заказы клиента |
| POST | /api/bookings | Записаться на массаж |
| POST | /api/gift-cards | Купить подарочную карту |
| GET | /api/gift-cards/validate?code=x | Проверить карту |
| POST | /api/checkout/stripe | Stripe Checkout сессия |
| POST | /api/webhooks/stripe | Stripe Webhook |

---

## Платёжные системы

- **Stripe** (банковские карты) — полностью интегрирован
- **MobilePay** — заглушка, готова к интеграции
- **Edenred** — заглушка, готова к интеграции

Для Stripe Webhooks в разработке используйте Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Настройка Google Maps

1. Получите API ключ на Google Cloud Console
2. Включите Maps Embed API
3. Добавьте в `.env`: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="ваш_ключ"`
4. Обновите iframe src в `app/contact/ContactClient.tsx`
