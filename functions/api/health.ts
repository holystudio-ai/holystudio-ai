import { Env, jsonResponse } from './_lib/types';
import { hmacMd5, randomBytes } from './_lib/crypto';
import { getDb } from './_lib/db';

/**
 * Health check endpoint — tests crypto + MongoDB connection.
 * GET /api/health
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;
    const checks: Record<string, any> = {};

    // 1. Check environment variables
    checks.env = {
        MONGODB_URI: env.MONGODB_URI ? `${env.MONGODB_URI.substring(0, 20)}...` : 'NOT SET',
        WFP_MERCHANT_LOGIN: env.WFP_MERCHANT_LOGIN ? 'SET' : 'NOT SET',
        WFP_MERCHANT_SECRET: env.WFP_MERCHANT_SECRET ? 'SET' : 'NOT SET',
        RESEND_API_KEY: env.RESEND_API_KEY ? 'SET' : 'NOT SET',
        SITE_URL: env.SITE_URL || 'NOT SET',
        COURSE_PRICE_UAH: env.COURSE_PRICE_UAH || 'NOT SET',
    };

    // 2. Test crypto
    try {
        const rand = randomBytes(8);
        const hmac = hmacMd5('test', 'secret');
        checks.crypto = { ok: true, randomBytes: rand, hmacMd5: hmac };
    } catch (err) {
        checks.crypto = { ok: false, error: err instanceof Error ? err.message : String(err) };
    }

    // 3. Test MongoDB connection
    if (env.MONGODB_URI) {
        try {
            const db = await getDb(env.MONGODB_URI);
            // Simple ping
            const result = await db.command({ ping: 1 });
            checks.mongodb = { ok: true, ping: result };
        } catch (err) {
            checks.mongodb = { ok: false, error: err instanceof Error ? err.message : String(err) };
        }
    } else {
        checks.mongodb = { ok: false, error: 'MONGODB_URI not set' };
    }

    const allOk = checks.crypto?.ok && checks.mongodb?.ok;
    return jsonResponse({ status: allOk ? 'healthy' : 'unhealthy', checks }, allOk ? 200 : 500);
};

