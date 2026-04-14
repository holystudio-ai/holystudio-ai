# HOLYSTUDIO AI Landing

Лендінг на `Vite + React` з checkout-потоком через **WayForPay**.

| | URL |
|--|-----|
| 🌐 **Сайт** | https://holystudio.ai |
| 🔧 **Backend API** | https://holystudio-ai.onrender.com |
| 📦 **GitHub** | https://github.com/holystudio-ai/holystudio-ai |

**Base URL для всіх API-запитів:** `https://holystudio-ai.onrender.com`

---

## Що зараз працює

- Кнопка **ОТРИМАТИ ДОСТУП** відкриває модальне вікно для вводу email
- При завантаженні сторінки **попередньо формується** посилання на оплату WayForPay (pre-prepare) — коли користувач натискає «оплатити», перехід відбувається **миттєво**
- Після оплати генерується **одноразовий токен** для доступу до Telegram-бота
- Ціна `490 грн` (конфігурується через `COURSE_PRICE_UAH`)
- Деплой на Vercel (serverless functions)

---

## Потік оплати

```
1. Користувач заходить на сайт
   └─→ Frontend автоматично викликає POST /api/payment/prepare
       └─→ Сервер генерує orderReference, підпис, returnUrl, token
       └─→ Зберігає order у MongoDB зі статусом "prepared"
       └─→ Повертає formFields (без email)

2. Користувач натискає "Отримати доступ"
   └─→ Відкривається модальне вікно для вводу email

3. Користувач вводить email і натискає "Перейти до оплати"
   └─→ Frontend додає clientEmail до кешованих formFields
   └─→ Fire-and-forget: POST /api/users + POST /api/payment/create (updateOnly)
   └─→ МИТТЄВО сабмітить форму на WayForPay → redirect на сторінку оплати

4. WayForPay обробляє оплату
   └─→ Webhook POST /api/payment/service (serviceUrl callback)
       └─→ Перевіряє підпис
       └─→ Оновлює order.status = "paid"
       └─→ Генерує одноразовий botAccessToken
       └─→ Надсилає email з посиланням на Telegram-бот

5. WayForPay перенаправляє користувача на returnUrl
   └─→ GET /api/payment/return → redirect на /return-page?token=X&ref=Y

6. SPA /return-page полить GET /api/payment/status
   └─→ Отримує status: "paid" + botAccessToken
   └─→ Показує кнопку "Отримати доступ до курсу" з deep-link на бот

7. Користувач переходить у Telegram-бот
   └─→ Бот викликає POST /api/bot/verify-token
       └─→ Якщо токен валідний і не використаний → { valid: true }
       └─→ Токен позначається як використаний (одноразовий)
```

---

## API Endpoints

> **Base URL:** `https://holystudio-ai.onrender.com`  
> Всі шляхи нижче відносні до цього URL.  
> Наприклад: `POST https://holystudio-ai.onrender.com/api/payment/prepare`

### `POST /api/payment/prepare`

Попередньо генерує підписану форму для WayForPay **без email**.  
Викликається автоматично при завантаженні сайту.

**Request:** пустий body або `{}`

**Response:**
```json
{
  "ok": true,
  "formFields": {
    "merchantAccount": "...",
    "merchantDomainName": "holystudio.ai",
    "merchantSignature": "...",
    "orderReference": "HOLY-1713100000000-ab12cd34",
    "orderDate": "1713100000",
    "amount": "490",
    "currency": "UAH",
    "productName": "AI Інтенсив HOLYSTUDIO",
    "productCount": "1",
    "productPrice": "490",
    "returnUrl": "https://holystudio.ai/api/payment/return?token=...&ref=...",
    "serviceUrl": "https://holystudio.ai/api/payment/service",
    "defaultPaymentSystem": "card",
    "orderTimeout": "900"
  },
  "token": "abc123...",
  "orderReference": "HOLY-1713100000000-ab12cd34",
  "expiresAt": 1713100840000
}
```

---

### `POST /api/payment/create`

Створює нове замовлення **або** оновлює існуюче (режим `updateOnly`).

**Request (створення):**
```json
{ "email": "user@example.com" }
```

**Request (оновлення email на вже prepared замовленні):**
```json
{
  "email": "user@example.com",
  "orderReference": "HOLY-...",
  "updateOnly": true
}
```

**Response (створення):**
```json
{
  "ok": true,
  "formFields": { ... }
}
```

**Response (оновлення):**
```json
{ "ok": true, "updated": true }
```

---

### `POST /api/payment/service`

Webhook від WayForPay (serviceUrl). Викликається автоматично WayForPay після оплати.

**При успішній оплаті (`transactionStatus: "Approved"`):**
- Оновлює order.status = `"paid"`
- Генерує `botAccessToken` (16 bytes hex, одноразовий)
- Позначає user як `"paid"`
- Надсилає email з посиланням на Telegram-бот

---

### `GET /api/payment/status?token=XXX&ref=HOLY-xxx`

Перевіряє статус оплати. Використовується сторінкою `/return-page`.

**Response (оплачено):**
```json
{
  "status": "paid",
  "orderReference": "HOLY-...",
  "email": "user@example.com",
  "botAccessToken": "a1b2c3d4e5f6..."
}
```

**Response (в обробці):**
```json
{
  "status": "pending",
  "orderReference": "HOLY-...",
  "wfpStatus": "InProcessing"
}
```

**Response (не оплачено):**
```json
{
  "status": "failed",
  "orderReference": "HOLY-...",
  "wfpStatus": "Declined"
}
```

---

### `GET|POST /api/bot/verify-token` 🔑

Перевіряє одноразовий токен доступу до бота. Підтримує **GET** (для SmartSender) і **POST** (для програмних інтеграцій).

**GET Request (для SmartSender):**
```
GET /api/bot/verify-token?token=a1b2c3d4e5f6...
```

**POST Request:**
```json
{ "token": "a1b2c3d4e5f6..." }
```

#### 🧪 Dev-тестовий токен (багаторазовий)

Для тестування без реальної оплати використовуй токен **`dev-test-holy`**:

```
GET https://holystudio-ai.onrender.com/api/bot/verify-token?token=dev-test-holy
```

Цей токен:
- ✅ Завжди повертає `{ valid: true }`
- ✅ Багаторазовий — можна використовувати скільки завгодно разів
- ✅ Не чіпає базу даних
- ❌ **Не працює в production** (`NODE_ENV=production`)
- Повертає `email: "dev@holystudio.ai"`, `orderReference: "HOLY-DEV-TEST-000"`

**Тестові посилання:**
- **Backend (Render):** `https://holystudio-ai.onrender.com/api/bot/verify-token?token=dev-test-holy`
- **Локально:** `http://localhost:5555/api/bot/verify-token?token=dev-test-holy`
- **SmartSender:** використай будь-яке з посилань вище в полі Request URL


**Response (успіх):**
```json
{
  "valid": true,
  "email": "user@example.com",
  "orderReference": "HOLY-..."
}
```

**Response (токен вже використаний):**
```json
{
  "valid": false,
  "reason": "already_used"
}
```

**Response (не знайдено):**
```json
{
  "valid": false,
  "reason": "not_found"
}
```

**Response (замовлення не оплачене):**
```json
{
  "valid": false,
  "reason": "not_paid"
}
```

**Приклад використання в боті (Python):**
```python
import requests

def verify_access_token(token: str) -> dict:
    """Перевіряє одноразовий токен доступу після оплати."""
    resp = requests.post(
        "https://holystudio-ai.onrender.com/api/bot/verify-token",
        json={"token": token},
        timeout=10,
    )
    return resp.json()

# У хендлері /start:
# /start a1b2c3d4e5f6...
token = message.text.split(" ", 1)[1] if " " in message.text else ""
result = verify_access_token(token)

if result.get("valid"):
    # Надати доступ користувачу
    email = result["email"]
    order_ref = result["orderReference"]
    grant_access(chat_id, email)
else:
    reason = result.get("reason", "unknown")
    if reason == "already_used":
        send_message(chat_id, "Цей токен вже був використаний.")
    elif reason == "not_found":
        send_message(chat_id, "Невірний токен.")
    elif reason == "not_paid":
        send_message(chat_id, "Замовлення не оплачене.")
```

**Приклад використання в боті (Node.js):**
```javascript
async function verifyAccessToken(token) {
  const resp = await fetch("https://holystudio-ai.onrender.com/api/bot/verify-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return resp.json();
}

// У хендлері /start:
bot.onText(/\/start (.+)/, async (msg, match) => {
  const token = match[1];
  const result = await verifyAccessToken(token);

  if (result.valid) {
    // Надати доступ
    await bot.sendMessage(msg.chat.id, `✅ Доступ надано! Email: ${result.email}`);
  } else {
    await bot.sendMessage(msg.chat.id, `❌ Токен невалідний: ${result.reason}`);
  }
});
```

---

### `POST /api/users`

Зберігає email + метадані пристрою користувача.

**Request:**
```json
{
  "email": "user@example.com",
  "clientMeta": { "userAgent": "...", "language": "uk", ... }
}
```

---

### `POST /api/validate-email`

Перевіряє email (формат, disposable-домени, MX-записи).

**Request:**
```json
{ "email": "user@example.com" }
```

**Response:**
```json
{ "valid": true }
```
або
```json
{ "valid": false, "reason": "disposable" }
```

---

### `GET /api/payment/return?token=X&ref=Y`

WayForPay POSTить сюди після оплати. Редіректить на SPA: `/return-page?token=X&ref=Y`

---

### `GET /api/cron/check-unpaid?secret=CRON_SECRET`

Крон для відправки нагадувань неоплаченим юзерам (30 хв після реєстрації).

---

## Де лежать константи

| Файл | Що |
|------|----|
| `src/lib/pricing.ts` | Ціна `490` (з env `COURSE_PRICE_UAH`) |
| `src/lib/payment.ts` | API URL, WayForPay URL, pre-prepare логіка |
| `api/_lib/email.ts` | Telegram bot name, email шаблони |

## Env Variables

| Змінна | Опис |
|--------|------|
| `WFP_MERCHANT_LOGIN` | WayForPay merchant account |
| `WFP_MERCHANT_SECRET` | WayForPay HMAC secret |
| `WFP_MERCHANT_PASSWORD` | WayForPay API password (для CHECK_STATUS) |
| `COURSE_PRICE_UAH` | Ціна курсу в грн (default: 490) |
| `SITE_URL` | URL сайту (default: https://holystudio.ai) |
| `MONGODB_URI` | MongoDB connection string |
| `RESEND_API_KEY` | Resend API key для email |
| `RESEND_FROM` | Email відправника |
| `CRON_SECRET` | Секрет для крон-ендпоінту |

## Локальний запуск

Одна команда запускає і фронтенд, і бекенд (API емулюється через Vite-плагін):

```bash
npm install
npm run dev
```

Відкрий http://localhost:5555 — все працює: оплата, prepare, verify-token, webhook.

> **Важливо:** потрібен `.env` файл з `MONGODB_URI`, `WFP_MERCHANT_LOGIN`, `WFP_MERCHANT_SECRET`.
> Для продакшну додай `VITE_API_URL=https://holystudio-ai.onrender.com` (або URL твого API).
> Локально `VITE_API_URL` залишай порожнім — API автоматично піде через localhost.

## Перевірка

- `npm run typecheck`
- `npm run build`

## Основні файли

- `src/lib/payment.ts` — pre-prepare + оплата
- `src/components/features/EmailModal.tsx` — модальне вікно email
- `src/pages/ReturnPage.tsx` — сторінка після оплати
- `api/payment/prepare.ts` — pre-generate payment form
- `api/payment/create.ts` — create/update order
- `api/payment/service.ts` — WayForPay webhook
- `api/payment/status.ts` — перевірка статусу
- `api/bot/verify-token.ts` — одноразовий токен для бота
- `api/_lib/email.ts` — email шаблони

---

## Налаштування SmartSender (перевірка оплати через бот)

SmartSender дозволяє робити External Request з чатбот-флоу. Ось як налаштувати перевірку токена:

### Крок 1: Захоплення токена

Коли юзер стартує бот з deep-link `https://t.me/HOLYSTUDIO_AI_bot?start=TOKEN`, SmartSender отримує `TOKEN` як параметр старту. Зберіть його у змінну, наприклад `{{start_parameter}}` або `{{last_message}}` (залежно від налаштувань бота).

### Крок 2: Створіть External Request

В SmartSender flow додайте блок **External Request** з такими параметрами:

| Поле | Значення |
|------|----------|
| **Method** | `GET` |
| **Request URL** | `https://holystudio-ai.onrender.com/api/bot/verify-token` |

**Вкладка Query:**

| Key | Value |
|-----|-------|
| `token` | `{{start_parameter}}` |

**Вкладка Response → Mappings:**

Маппінг відповіді на змінні SmartSender:

| JSON path | SmartSender variable |
|-----------|---------------------|
| `$.valid` | `{{payment_valid}}` |
| `$.email` | `{{payment_email}}` |
| `$.reason` | `{{payment_reason}}` |
| `$.orderReference` | `{{order_ref}}` |

### Крок 3: Умовне розгалуження

Після External Request додайте **Condition** блок:

**Якщо `{{payment_valid}}` = `true`:**
→ Надайте доступ (надіслати матеріали, додати до каналу, тощо)

**Якщо `{{payment_valid}}` = `false`:**
→ Перевірте `{{payment_reason}}`:
  - `already_used` → «Цей токен вже був використаний. Зверніться до підтримки.»
  - `not_found` → «Невірне посилання. Перевірте що ви перейшли з правильного листа.»
  - `not_paid` → «Оплата ще не пройшла. Спробуйте пізніше.»

### Приклад повного флоу:

```
[User starts bot with /start TOKEN]
       ↓
[Save {{start_parameter}} = TOKEN]
       ↓
[External Request: GET /api/bot/verify-token?token={{start_parameter}}]
       ↓
[Map response → {{payment_valid}}, {{payment_email}}, {{payment_reason}}]
       ↓
[Condition: {{payment_valid}} == true?]
  ├─ YES → "✅ Вітаємо! Доступ надано. Ваш email: {{payment_email}}"
  │         → [Надати доступ до матеріалів]
  └─ NO  → "❌ Не вдалося перевірити оплату: {{payment_reason}}"
           → [Повідомлення з інструкцією]
```

### Тестування

Для тесту можна вручну відкрити в браузері:
```
https://holystudio-ai.onrender.com/api/bot/verify-token?token=dev-test-holy
```

Якщо токен валідний, побачите:
```json
{ "valid": true, "email": "user@example.com", "orderReference": "HOLY-..." }
```


