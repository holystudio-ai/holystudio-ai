import { Router, Request, Response } from 'express';
import { config } from '../config.js';
import { hmacMd5, randomBytes } from '../lib/crypto.js';
import { getDb } from '../lib/db.js';

const router = Router();

/**
 * GET /api/health — tests crypto + MongoDB connection.
 */
router.get('/', async (_req: Request, res: Response) => {
    const checks: Record<string, any> = {};

    checks.env = {
        MONGODB_URI: config.MONGODB_URI ? `${config.MONGODB_URI.substring(0, 20)}...` : 'NOT SET',
        WFP_MERCHANT_LOGIN: config.WFP_MERCHANT_LOGIN ? 'SET' : 'NOT SET',
        WFP_MERCHANT_SECRET: config.WFP_MERCHANT_SECRET ? 'SET' : 'NOT SET',
        RESEND_API_KEY: config.RESEND_API_KEY ? 'SET' : 'NOT SET',
        SITE_URL: config.SITE_URL || 'NOT SET',
        COURSE_PRICE_UAH: config.COURSE_PRICE_UAH || 'NOT SET',
    };

    try {
        const rand = randomBytes(8);
        const hmac = hmacMd5('test', 'secret');
        checks.crypto = { ok: true, randomBytes: rand, hmacMd5: hmac };
    } catch (err) {
        checks.crypto = { ok: false, error: err instanceof Error ? err.message : String(err) };
    }

    if (config.MONGODB_URI) {
        try {
            const db = await getDb();
            const result = await db.command({ ping: 1 });
            checks.mongodb = { ok: true, ping: result };
        } catch (err) {
            checks.mongodb = { ok: false, error: err instanceof Error ? err.message : String(err) };
        }
    } else {
        checks.mongodb = { ok: false, error: 'MONGODB_URI not set' };
    }

    const allOk = checks.crypto?.ok && checks.mongodb?.ok;
    res.status(allOk ? 200 : 500).json({ status: allOk ? 'healthy' : 'unhealthy', checks });
});

export default router;

