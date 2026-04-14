import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db';

/**
 * Reusable dev/test token. Works in all environments for testing.
 * Use it in the browser or SmartSender to test the flow without real payment:
 *   GET /api/bot/verify-token?token=dev-test-holy
 */
const DEV_TEST_TOKEN = 'dev-test-holy';
const DEV_TEST_EMAIL = 'dev@holystudio.ai';
const DEV_TEST_ORDER = 'HOLY-DEV-TEST-000';

/**
 * GET /api/bot/verify-token?token=abc123
 * POST /api/bot/verify-token  { "token": "abc123" }
 *
 * Verifies a one-time bot access token. The Telegram bot (or SmartSender)
 * calls this endpoint when a user starts the bot with a token.
 *
 * GET is supported for SmartSender External Request compatibility.
 * POST is supported for programmatic bot integrations.
 *
 * Special: token "dev-test-holy" is reusable and always returns valid.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Support both GET ?token=X and POST { token: X }
        let tokenValue: string | undefined;
        if (req.method === 'GET') {
            tokenValue = typeof req.query.token === 'string' ? req.query.token : undefined;
        } else {
            tokenValue = req.body?.token;
        }

        if (!tokenValue || typeof tokenValue !== 'string') {
            return res.status(400).json({ valid: false, reason: 'missing_token' });
        }

        const trimmedToken = tokenValue.trim();

        // ── Dev test token (reusable, works in all environments) ──
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

        // Find order with this botAccessToken
        const order = await orders.findOne({ botAccessToken: trimmedToken });

        if (!order) {
            return res.status(200).json({ valid: false, reason: 'not_found' });
        }

        // Check if token was already used
        if (order.botAccessTokenUsedAt) {
            return res.status(200).json({ valid: false, reason: 'already_used' });
        }

        // Check if order is actually paid
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
    } catch (err) {
        console.error('[bot/verify-token] Error:', err);
        return res.status(500).json({ valid: false, reason: 'server_error' });
    }
}
