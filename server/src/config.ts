import 'dotenv/config';

export const config = {
    PORT: Number(process.env.PORT) || 3001,
    MONGODB_URI: process.env.MONGODB_URI || '',
    RESEND_API_KEY: process.env.RESEND_API_KEY || '',
    RESEND_FROM: process.env.RESEND_FROM || '',
    CRON_SECRET: process.env.CRON_SECRET || '',
    SITE_URL: (process.env.SITE_URL || '').replace(/\/+$/, ''),
    COURSE_PRICE_UAH: Number(process.env.COURSE_PRICE_UAH) || 490,
    WFP_MERCHANT_LOGIN: process.env.WFP_MERCHANT_LOGIN || '',
    WFP_MERCHANT_SECRET: process.env.WFP_MERCHANT_SECRET || '',
    WFP_MERCHANT_PASSWORD: process.env.WFP_MERCHANT_PASSWORD || '',
    API_URL: (process.env.API_URL || '').replace(/\/+$/, ''),

    MERCHANT_DOMAIN: process.env.MERCHANT_DOMAIN || '',
    PRODUCT_NAME: process.env.PRODUCT_NAME || '',
    CURRENCY: process.env.CURRENCY || 'UAH',
    WFP_RETURN_URL: process.env.WFP_RETURN_URL || '',
    WFP_FAILED_URL: process.env.WFP_FAILED_URL || '',

    TELEGRAM_BOT_USERNAME: process.env.TELEGRAM_BOT_USERNAME || '',
    BOT_URL: process.env.BOT_URL || '',

    ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',

    DEV_TEST_TOKEN: process.env.DEV_TEST_TOKEN || '',
    DEV_TEST_EMAIL: process.env.DEV_TEST_EMAIL || '',
    DEV_TEST_ORDER: process.env.DEV_TEST_ORDER || '',

    INSTAGRAM_URL: process.env.INSTAGRAM_URL || '',

    // Meta (Facebook) Ads API
    META_APP_ID: process.env.META_APP_ID || '',
    META_APP_SECRET: process.env.META_APP_SECRET || '',
    META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN || '',
    META_AD_ACCOUNT_ID: process.env.META_AD_ACCOUNT_ID || '',

    // Google Sheets API (OAuth2)
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || '',
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID || '',
};

export function validateConfig() {
    const required = ['MONGODB_URI', 'WFP_MERCHANT_LOGIN', 'WFP_MERCHANT_SECRET', 'SITE_URL', 'API_URL', 'MERCHANT_DOMAIN', 'BOT_URL', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'] as const;
    const missing = required.filter((k) => !config[k]);
    if (missing.length) {
        console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
        process.exit(1);
    }
}

