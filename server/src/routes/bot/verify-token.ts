import { Router, Request, Response } from 'express';
import { getDb } from '../../lib/db.js';

const router = Router();

/**
 * Reusable dev/test token. Works only when NODE_ENV !== 'production'.
 */
const DEV_TEST_TOKEN = 'dev-test-holy';
const DEV_TEST_EMAIL = 'dev@holystudio.ai';
const DEV_TEST_ORDER = 'HOLY-DEV-TEST-000';

/**
 * GET /api/bot/verify-token?token=abc123
 * POST /api/bot/verify-token  { "token": "abc123" }
 *
 * Verifies a one-time bot access token.
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const tokenValue = typeof req.query.token === 'string' ? req.query.token : undefined;
        return await verify(tokenValue, res);
    } catch (err) {
        console.error('[bot/verify-token] Error:', err);
        return res.status(500).json({ valid: false, reason: 'server_error' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const tokenValue = req.body?.token;
        return await verify(tokenValue, res);
    } catch (err) {
        console.error('[bot/verify-token] Error:', err);
        return res.status(500).json({ valid: false, reason: 'server_error' });
    }
});

async function verify(tokenValue: string | undefined, res: Response) {
    if (!tokenValue || typeof tokenValue !== 'string') {
        return res.status(400).json({ valid: false, reason: 'missing_token' });
    }

    const trimmedToken = tokenValue.trim();

    // ── Dev test token (reusable, works in all environments for testing) ──
    if (trimmedToken === DEV_TEST_TOKEN) {
        console.log('[bot/verify-token] DEV TEST TOKEN used (reusable)');
        return res.status(200).json({
            valid: true,
            email: DEV_TEST_EMAIL,
            orderReference: DEV_TEST_ORDER,
            _dev: true,
        });
    }

    const db = await getDb();
    const orders = db.collection('orders');

    const order = await orders.findOne({ botAccessToken: trimmedToken });

    if (!order) {
        return res.status(200).json({ valid: false, reason: 'not_found' });
    }

    if (order.botAccessTokenUsedAt) {
        return res.status(200).json({ valid: false, reason: 'already_used' });
    }

    if (order.status !== 'paid') {
        return res.status(200).json({ valid: false, reason: 'not_paid' });
    }

    // Mark token as used — one-time only
    await orders.updateOne(
        { _id: order._id },
        {
            $set: {
                botAccessTokenUsedAt: new Date(),
                updatedAt: new Date(),
            },
        }
    );

    console.log(`[bot/verify-token] Token used for order ${order.orderReference}, email: ${order.email}`);

    return res.status(200).json({
        valid: true,
        email: order.email || null,
        orderReference: order.orderReference,
    });
}

export default router;

