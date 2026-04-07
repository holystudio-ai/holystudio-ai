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
    API_URL: (process.env.API_URL || 'http://localhost:3001').replace(/\/+$/, ''),
};

export function validateConfig() {
    const required = ['MONGODB_URI', 'WFP_MERCHANT_LOGIN', 'WFP_MERCHANT_SECRET'] as const;
    const missing = required.filter((k) => !config[k]);
    if (missing.length) {
        console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
        process.exit(1);
    }
}

