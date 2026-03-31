# HOLYSTUDIO AI landing

Лендінг на `Vite + React` з простим checkout-потоком через Zenedu.

## Що зараз працює

- кнопка `ОТРИМАТИ ДОСТУП` веде напряму на `Zenedu direct payment`
- оплата, сторінка подяки, email із доступом і унікальне бот-посилання обробляються самим `Zenedu`
- ціна `770 грн`, direct payment link, landing link, bot link і сайт `https://holystudio.ai/` зашиті прямо в код
- локальний фронтенд не залежить від `.env` для checkout-потоку

## Потік оплати

1. користувач натискає кнопку у `src/components/sections/Pricing.tsx`
2. фронтенд редіректить на Zenedu direct payment link
3. `Zenedu` показує checkout-сторінку
4. після оплати `Zenedu` веде на свою thank-you page
5. `Zenedu` сам відправляє доступ на email і працює з ботом

## Де лежать константи

- `src/lib/pricing.ts` — ціна `490`
- `src/lib/zenedu.ts` — сайт, direct payment, landing і bot link

## Локальний запуск

1. `npm install`
2. `npm run dev`

## Перевірка

- `npm run typecheck`
- `npm run build`

## Основні файли

- `src/components/sections/Pricing.tsx`
- `src/lib/pricing.ts`
- `src/lib/zenedu.ts`
- `src/pages/Home.tsx`
- `vite.config.ts`
