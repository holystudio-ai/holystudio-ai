export interface Env {
    MONGODB_URI: string;
    RESEND_API_KEY: string;
    RESEND_FROM: string;
    CRON_SECRET: string;
    SITE_URL: string;
    COURSE_PRICE_UAH: string;
    WFP_MERCHANT_LOGIN: string;
    WFP_MERCHANT_SECRET: string;
}

export function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

