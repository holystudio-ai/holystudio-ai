export interface Env {
    MONGODB_URI: string;
    RESEND_API_KEY: string;
    RESEND_FROM: string;
    CRON_SECRET: string;
    SITE_URL: string;
    COURSE_PRICE_UAH: string;
    WFP_MERCHANT_LOGIN: string;
    WFP_MERCHANT_SECRET: string;
    MERCHANT_DOMAIN: string;
    PRODUCT_NAME: string;
    CURRENCY: string;
    TELEGRAM_BOT_USERNAME: string;
    BOT_URL: string;
    DEV_TEST_TOKEN: string;
    DEV_TEST_EMAIL: string;
    DEV_TEST_ORDER: string;
    INSTAGRAM_URL: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
    WFP_RETURN_URL: string;
    WFP_FAILED_URL: string;
    LEADS_SHEETS_WEBHOOK_URL: string;
    LEADS_NOTIFY_EMAIL: string;
    TELEGRAM_CHANNEL_INVITE_URL: string;
}

export function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

