import 'dotenv/config';

export const config = {
    PORT: Number(process.env.PORT) || 3001,
    MONGODB_URI: process.env.MONGODB_URI || '',
    RESEND_API_KEY: process.env.RESEND_API_KEY || '',
    RESEND_FROM: process.env.RESEND_FROM || 'HOLYSTUDIO <noreply@holystudio.ai>',
    CRON_SECRET: process.env.CRON_SECRET || '',
    SITE_URL: (process.env.SITE_URL || 'https://holystudio.ai').replace(/\/+$/, ''),
    COURSE_PRICE_UAH: Number(process.env.COURSE_PRICE_UAH) || 490,
    WFP_MERCHANT_LOGIN: process.env.WFP_MERCHANT_LOGIN || '',
    WFP_MERCHANT_SECRET: process.env.WFP_MERCHANT_SECRET || '',
    WFP_MERCHANT_PASSWORD: process.env.WFP_MERCHANT_PASSWORD || '',
    /** Public URL of THIS server (for WayForPay callbacks) */
    API_URL: (process.env.API_URL || 'https://holystudio-ai.onrender.com').replace(/\/+$/, ''),

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
    const required = ['MONGODB_URI', 'WFP_MERCHANT_LOGIN', 'WFP_MERCHANT_SECRET'] as const;
    const missing = required.filter((k) => !config[k]);
    if (missing.length) {
        console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
        process.exit(1);
    }
}

